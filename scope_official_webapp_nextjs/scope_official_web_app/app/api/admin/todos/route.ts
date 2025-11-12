import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

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
      console.warn('[admin/todos] Missing or invalid authorization header')
      return false
    }

    const token = authHeader.substring(7)
    const { payload } = await jwtVerify(token, SECRET)
    const role = typeof payload.role === 'string' ? payload.role : ''
    const allowed = ['admin', 'super_admin', 'super-admin', 'owner']
    if (role && allowed.includes(role)) return true
    console.warn('[admin/todos] Token does not have required admin role:', role)
    return false
  } catch (error) {
    console.warn('[admin/todos] Token verification failed:', error)
    return false
  }
}

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) return unauthorized()

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/admin_todos`)
    url.searchParams.set('select', '*')
    url.searchParams.set('order', 'created_at.desc')

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[GET /api/admin/todos] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase request failed', details: text }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ todos: data })
  } catch (err) {
    console.error('GET /api/admin/todos error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) return unauthorized()

  let body
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payload = {
    title: body.title || '',
    details: body.details || null,
    is_done: body.is_done === true,
    created_by: body.created_by || null
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/admin_todos`
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

    if (!res.ok) {
      const text = await res.text()
      console.error('[POST /api/admin/todos] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase insert failed', details: text }, { status: 502 })
    }

    const created = await res.json()
    return NextResponse.json({ created, success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/todos] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error', details: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) return unauthorized()

  const urlObj = new URL(req.url)
  const id = urlObj.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const body = await req.json()
  const payload: Record<string, unknown> = {}
  if (body.title !== undefined) payload.title = body.title
  if (body.details !== undefined) payload.details = body.details
  if (body.is_done !== undefined) payload.is_done = body.is_done

  try {
    const url = `${SUPABASE_URL}/rest/v1/admin_todos?id=eq.${encodeURIComponent(id)}`
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
      console.error('[PATCH /api/admin/todos] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase update failed', details: text }, { status: 502 })
    }

    const updated = await res.json()
    return NextResponse.json({ updated, success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/todos] Unexpected error:', err)
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
    const url = `${SUPABASE_URL}/rest/v1/admin_todos?id=eq.${encodeURIComponent(id)}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE_KEY || '',
        Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[DELETE /api/admin/todos] Supabase error:', res.status, text)
      return NextResponse.json({ error: 'Supabase delete failed', details: text }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/todos] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error', details: String(err) }, { status: 500 })
  }
}
