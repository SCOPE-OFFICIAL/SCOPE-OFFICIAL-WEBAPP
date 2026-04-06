import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createClient } from '@supabase/supabase-js'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

// Admin CRUD endpoint for partners. Requires JWT token from admin login

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')
const LOCAL_PARTNERS_PATH = path.join(process.cwd(), 'data', 'admin-partners.json')

type PartnerRecord = {
  id: string
  name: string
  image_url: string
  link?: string | null
  visible?: boolean
  sort_order?: number
}

// Create Supabase client for storage operations
const supabase = createClient(
  SUPABASE_URL!,
  SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Helper function to extract storage path from Supabase URL
 */
function extractStoragePath(imageUrl: string, bucketName: string): string | null {
  try {
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`))
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch (error) {
    console.error('Error extracting storage path:', error)
    return null
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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

async function writeLocalPartners(partners: PartnerRecord[]) {
  await ensureLocalStore()
  await writeFile(LOCAL_PARTNERS_PATH, JSON.stringify(partners, null, 2), 'utf8')
}

function normalizePartner(partner: Partial<PartnerRecord> & { id: string }): PartnerRecord {
  return {
    id: partner.id,
    name: partner.name || '',
    image_url: partner.image_url || '',
    link: partner.link ?? null,
    visible: partner.visible ?? true,
    sort_order: typeof partner.sort_order === 'number' ? partner.sort_order : 0
  }
}

function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookieToken = req.cookies.get('admin_token')?.value
  if (cookieToken) {
    return cookieToken
  }

  return null
}

async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      console.warn('[admin/partners] Missing auth token in header/cookie')
      return false
    }

    const { payload } = await jwtVerify(token, SECRET)
    
    // Accept common admin roles. Older code/seeded admins use 'super_admin'
    const role = typeof payload.role === 'string' ? payload.role : ''
    const allowed = ['admin', 'super_admin', 'super-admin', 'owner']
    if (role && allowed.includes(role)) {
      return true
    }

    const email = typeof payload.email === 'string' ? payload.email : ''
    if (email.includes('@')) {
      return true
    }

    console.warn('[admin/partners] Token does not have required admin claims:', role)
    return false
  } catch (error) {
    console.warn('[admin/partners] Token verification failed:', error)
    return false
  }
}

export async function GET(req: NextRequest) {
  // list all partners (admin view)
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) {
    return unauthorized()
  }

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/partners`)
    url.searchParams.set('select', '*')
    url.searchParams.set('order', 'sort_order')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Supabase request failed', details: text }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ partners: data })
  } catch (err) {
    console.error('[GET partners] Supabase unavailable, using local fallback', err)
    const partners = await readLocalPartners()
    return NextResponse.json({ partners, source: 'local-fallback' })
  }
}

export async function POST(req: NextRequest) {
  console.log('[POST partners] Starting...')
  
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) {
    console.error('[POST partners] Unauthorized')
    return unauthorized()
  }

  let body
  try {
    body = await req.json()
    console.log('[POST partners] Request body:', body)
  } catch (err) {
    console.error('[POST partners] Failed to parse JSON:', err)
    return NextResponse.json({ error: 'Invalid JSON', details: String(err) }, { status: 400 })
  }

  const payload = {
    name: body.name,
    image_url: body.image_url,
    link: body.link || null,
    visible: body.visible === undefined ? true : !!body.visible,
    sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0
  }

  console.log('[POST partners] Payload to insert:', payload)

  try {
    const url = `${SUPABASE_URL}/rest/v1/partners`
    console.log('[POST partners] Request URL:', url)
    
    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SERVICE_ROLE_KEY || '',
          Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      })
    } catch (networkError) {
      console.error('[POST partners] Supabase fetch failed, using local fallback:', networkError)
      const localPartners = await readLocalPartners()
      const newPartner = normalizePartner({
        id: crypto.randomUUID(),
        ...payload,
        sort_order: payload.sort_order ?? localPartners.length
      })
      localPartners.push(newPartner)
      await writeLocalPartners(localPartners)
      return NextResponse.json({ created: [newPartner], success: true, source: 'local-fallback' }, { status: 201 })
    }

    console.log('[POST partners] Supabase response status:', res.status)

    if (!res.ok) {
      const text = await res.text()
      console.error('[POST partners] Supabase error:', res.status, text)
      const localPartners = await readLocalPartners()
      const newPartner = normalizePartner({
        id: crypto.randomUUID(),
        ...payload,
        sort_order: payload.sort_order ?? localPartners.length
      })
      localPartners.push(newPartner)
      await writeLocalPartners(localPartners)
      return NextResponse.json({ created: [newPartner], success: true, source: 'local-fallback', warning: text }, { status: 201 })
    }

    const created = await res.json()
    console.log('[POST partners] Success:', created)
    return NextResponse.json({ created, success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/partners] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error', details: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) return unauthorized()

  const urlObj = new URL(req.url)
  const id = urlObj.searchParams.get('id')
  if (!id) {
    console.error('[PATCH partners] Missing id parameter')
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  console.log('[PATCH partners] Updating partner with id:', id)

  const body = await req.json()
  const payload: Record<string, unknown> = {}
  if (body.name !== undefined) payload.name = body.name
  if (body.image_url !== undefined) payload.image_url = body.image_url
  if (body.link !== undefined) payload.link = body.link
  if (body.visible !== undefined) payload.visible = body.visible
  if (body.sort_order !== undefined) payload.sort_order = body.sort_order

  console.log('[PATCH partners] Payload:', payload)

  try {
    const url = `${SUPABASE_URL}/rest/v1/partners?id=eq.${encodeURIComponent(id)}`
    console.log('[PATCH partners] Request URL:', url)

    let res: Response
    try {
      res = await fetch(url, {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_ROLE_KEY || '',
          Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      })
    } catch (networkError) {
      console.error('[PATCH partners] Supabase fetch failed, using local fallback:', networkError)
      const localPartners = await readLocalPartners()
      const updatedPartners = localPartners.map((partner) =>
        partner.id === id ? normalizePartner({ ...partner, ...payload, id }) : partner
      )
      await writeLocalPartners(updatedPartners)
      return NextResponse.json({ updated: updatedPartners.filter((partner) => partner.id === id), success: true, source: 'local-fallback' })
    }

    if (!res.ok) {
      const text = await res.text()
      console.error('[PATCH partners] Supabase error:', res.status, text)
      const localPartners = await readLocalPartners()
      const updatedPartners = localPartners.map((partner) =>
        partner.id === id ? normalizePartner({ ...partner, ...payload, id }) : partner
      )
      await writeLocalPartners(updatedPartners)
      return NextResponse.json({ updated: updatedPartners.filter((partner) => partner.id === id), success: true, source: 'local-fallback', warning: text })
    }

    const updated = await res.json()
    console.log('[PATCH partners] Success:', updated)
    return NextResponse.json({ updated, success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/partners] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error', details: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) return unauthorized()

  const urlObj = new URL(req.url)
  const id = urlObj.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    // First, get the partner data to find the storage path
    const fetchUrl = `${SUPABASE_URL}/rest/v1/partners?id=eq.${encodeURIComponent(id)}&select=image_url`
    let fetchRes: Response | null = null
    try {
      fetchRes = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          apikey: SERVICE_ROLE_KEY || '',
          Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
        }
      })
    } catch (networkError) {
      console.error('[DELETE partners] Supabase fetch failed, using local fallback:', networkError)
    }

    let imageUrl = null
    if (fetchRes?.ok) {
      const data = await fetchRes.json()
      if (data && data.length > 0) {
        imageUrl = data[0].image_url
      }
    }

    console.log('[DELETE partners] Partner image URL:', imageUrl)

    // Delete from database
    const url = `${SUPABASE_URL}/rest/v1/partners?id=eq.${id}`
    let res: Response
    try {
      res = await fetch(url, {
        method: 'DELETE',
        headers: {
          apikey: SERVICE_ROLE_KEY || '',
          Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
        }
      })
    } catch (networkError) {
      console.error('[DELETE partners] Supabase delete failed, using local fallback:', networkError)
      const localPartners = await readLocalPartners()
      const nextPartners = localPartners.filter((partner) => partner.id !== id)
      await writeLocalPartners(nextPartners)
      return NextResponse.json({ success: true, source: 'local-fallback' })
    }

    if (!res.ok) {
      const text = await res.text()
      const localPartners = await readLocalPartners()
      const nextPartners = localPartners.filter((partner) => partner.id !== id)
      await writeLocalPartners(nextPartners)
      return NextResponse.json({ success: true, source: 'local-fallback', warning: text })
    }

    // Delete from storage if image exists
    if (imageUrl) {
      try {
        // Try to extract path from multiple possible bucket names
        let storagePath = extractStoragePath(imageUrl, 'partners-logos')
        let bucketName = 'partners-logos'
        
        if (!storagePath) {
          storagePath = extractStoragePath(imageUrl, 'partner-logos')
          bucketName = 'partner-logos'
        }
        
        if (storagePath) {
          console.log('[DELETE partners] Deleting from storage:', bucketName, '/', storagePath)
          
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([storagePath])

          if (storageError) {
            console.error('Storage deletion error:', storageError)
          } else {
            console.log('[DELETE partners] Successfully deleted from storage')
          }
        } else {
          console.warn('[DELETE partners] Could not extract storage path from URL:', imageUrl)
        }
      } catch (storageErr) {
        console.error('Storage cleanup error:', storageErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
