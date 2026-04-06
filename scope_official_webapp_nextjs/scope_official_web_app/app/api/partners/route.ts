import { NextRequest, NextResponse } from 'next/server'
import { readFile, mkdir } from 'fs/promises'
import path from 'path'

// Public endpoint: returns visible partners ordered by sort_order
const LOCAL_PARTNERS_PATH = path.join(process.cwd(), 'data', 'admin-partners.json')

type PartnerRecord = {
  id: string
  name: string
  image_url: string
  link?: string | null
  visible?: boolean
  is_visible?: boolean
  show_on_website?: boolean
  sort_order?: number
}

async function ensureLocalStore() {
  await mkdir(path.dirname(LOCAL_PARTNERS_PATH), { recursive: true })
}

async function readLocalPartners(): Promise<PartnerRecord[]> {
  try {
    await ensureLocalStore()
    const raw = await readFile(LOCAL_PARTNERS_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function isVisiblePartner(partner: PartnerRecord) {
  return partner.show_on_website === true || partner.visible === true || partner.is_visible === true
}

function normalizePartner(partner: PartnerRecord) {
  const showOnWebsite = isVisiblePartner(partner)
  return {
    ...partner,
    show_on_website: showOnWebsite,
    visible: partner.visible ?? showOnWebsite,
    is_visible: partner.is_visible ?? showOnWebsite
  }
}

export async function GET(req: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[/api/partners] Missing Supabase credentials')
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/partners`)
    // select all columns and filter visible=true, order by sort_order
    url.searchParams.set('select', '*')
    url.searchParams.set('visible', 'eq.true')
    url.searchParams.set('order', 'sort_order')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Supabase request failed', details: text }, { status: 502 })
    }

    const data = await res.json()
    const normalized = Array.isArray(data)
      ? data
          .map(normalizePartner)
          .filter((partner: PartnerRecord) => partner.show_on_website === true)
          .sort((a: PartnerRecord, b: PartnerRecord) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : []

    return NextResponse.json({ partners: normalized, source: 'supabase' })
  } catch (err) {
    console.error('GET /api/partners error', err)
    const localPartners = await readLocalPartners()
    const normalized = localPartners
      .map(normalizePartner)
      .filter((partner) => partner.show_on_website === true)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

    return NextResponse.json({ partners: normalized, source: 'local-fallback' })
  }
}
