import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Server-side upload route for partner logos.
// Expects JSON: { filename, contentType, base64 }
// Requires JWT token from admin login

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[admin/upload] Missing or invalid authorization header')
      return false
    }
    
    const token = authHeader.substring(7)
    const { payload } = await jwtVerify(token, SECRET)
      // Accept several common admin role variants produced by the login token
    const allowed = ['admin', 'super_admin', 'super-admin', 'owner']
    const role = (payload as Record<string, unknown>)['role']
      if (typeof role === 'string' && allowed.includes(role)) {
        return true
      }
      console.warn('[admin/upload] Token does not have an allowed admin role', role)
      return false
  } catch (error) {
    console.warn('[admin/upload] Token verification failed:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) {
    return unauthorized()
  }

  const body = await req.json().catch(() => null)
  if (!body || !body.filename || !body.base64) {
    console.warn('[admin/upload] invalid payload', body)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { filename, contentType, base64 } = body
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/partners-logos/${encodeURIComponent(filename)}`
    const buffer = Buffer.from(base64, 'base64')

    console.log('[admin/upload] uploading to', uploadUrl, 'filename:', filename, 'contentType:', contentType, 'bytes:', buffer.length)

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE}`,
        apikey: SERVICE_ROLE,
        'Content-Type': contentType || 'application/octet-stream'
      },
      body: buffer
    })

    console.log('[admin/upload] storage response status', res.status)

    if (!res.ok) {
      const text = await res.text()
      console.error('[admin/upload] storage upload failed:', res.status, text)
      return NextResponse.json({ error: 'Storage upload failed', details: text }, { status: 502 })
    }

    // Construct public URL for the object (if bucket is public)
    const publicUrl = `${SUPABASE_URL.replace(/\/rest\/.+$/, '')}/storage/v1/object/public/partners-logos/${encodeURIComponent(filename)}`
    // Fallback: if replace fails, use SUPABASE_URL + storage path
    const fallback = `${SUPABASE_URL}/storage/v1/object/public/partners-logos/${encodeURIComponent(filename)}`
    const url = publicUrl || fallback

    console.log('[admin/upload] upload successful, public url:', url)

    return NextResponse.json({ url })
  } catch (err) {
    console.error('[admin/upload] Upload error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
