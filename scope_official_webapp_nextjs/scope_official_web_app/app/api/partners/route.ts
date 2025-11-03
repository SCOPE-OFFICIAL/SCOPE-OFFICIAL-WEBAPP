import { NextRequest, NextResponse } from 'next/server'

// Public endpoint: returns visible partners ordered by sort_order
export async function GET(req: NextRequest) {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
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
    return NextResponse.json({ partners: data })
  } catch (err) {
    console.error('GET /api/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
