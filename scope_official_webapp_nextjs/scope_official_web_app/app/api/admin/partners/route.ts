import { NextRequest, NextResponse } from 'next/server'

// Admin CRUD endpoint for partners. Requires an admin API key header 'x-admin-api-key'
// Configure ADMIN_API_KEY (or set it equal to your SUPABASE_SERVICE_ROLE) in environment.

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || SERVICE_ROLE_KEY

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  // list all partners (admin view)
  const key = req.headers.get('x-admin-api-key')
  // debug logging
  try {
    console.log('[admin/partners] incoming x-admin-api-key:', key)
    console.log('[admin/partners] ADMIN_API_KEY configured?', !!ADMIN_API_KEY)
    console.log('[admin/partners] SUPABASE_URL present?', !!SUPABASE_URL)
    console.log('[admin/partners] SUPABASE_SERVICE_ROLE present?', !!SERVICE_ROLE_KEY)
  } catch {
    /* ignore logging errors */
  }
  if (!ADMIN_API_KEY || key !== ADMIN_API_KEY) {
    console.warn('[admin/partners] unauthorized - missing or incorrect x-admin-api-key')
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
    console.error('GET /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-admin-api-key')
  if (!ADMIN_API_KEY || key !== ADMIN_API_KEY) return unauthorized()

  const body = await req.json()
  const payload = {
    name: body.name,
    image_url: body.image_url,
    link: body.link || null,
    visible: body.visible === undefined ? true : !!body.visible,
    sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/partners`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Supabase insert failed', details: text }, { status: 502 })
    }

    const created = await res.json()
    return NextResponse.json({ created }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const key = req.headers.get('x-admin-api-key')
  if (!ADMIN_API_KEY || key !== ADMIN_API_KEY) return unauthorized()

  const urlObj = new URL(req.url)
  const id = urlObj.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const body = await req.json()
  const payload: Record<string, unknown> = {}
  if (body.name !== undefined) payload.name = body.name
  if (body.image_url !== undefined) payload.image_url = body.image_url
  if (body.link !== undefined) payload.link = body.link
  if (body.visible !== undefined) payload.visible = body.visible
  if (body.sort_order !== undefined) payload.sort_order = body.sort_order

  try {
    const url = `${SUPABASE_URL}/rest/v1/partners?id=eq.${id}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Supabase update failed', details: text }, { status: 502 })
    }

    const updated = await res.json()
    return NextResponse.json({ updated })
  } catch (err) {
    console.error('PATCH /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const key = req.headers.get('x-admin-api-key')
  if (!ADMIN_API_KEY || key !== ADMIN_API_KEY) return unauthorized()

  const urlObj = new URL(req.url)
  const id = urlObj.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const url = `${SUPABASE_URL}/rest/v1/partners?id=eq.${id}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Supabase delete failed', details: text }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
