import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Admin CRUD endpoint for partners. Requires JWT token from admin login

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[admin/partners] Missing or invalid authorization header')
      return false
    }
    
    const token = authHeader.substring(7)
    const { payload } = await jwtVerify(token, SECRET)
    
    if (payload.role === 'admin') {
      return true
    }
    console.warn('[admin/partners] Token does not have admin role')
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
    console.error('GET /api/admin/partners error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
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
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    })

    console.log('[POST partners] Supabase response status:', res.status)

    if (!res.ok) {
      const text = await res.text()
      console.error('[POST partners] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase insert failed', details: text }, { status: 502 })
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
    
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[PATCH partners] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase update failed', details: text }, { status: 502 })
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
