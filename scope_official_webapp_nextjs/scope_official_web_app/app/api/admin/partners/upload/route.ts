import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Server-side upload route for partner logos.
// Expects JSON: { filename, contentType, base64 }
// Requires JWT token from admin login

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const PARTNERS_BUCKET = process.env.SUPABASE_PARTNERS_BUCKET || 'partners-logos'
const IMGBB_API_KEY = process.env.IMGBB_API_KEY
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

function unauthorized() {
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
      console.warn('[admin/upload] Missing auth token in header/cookie')
      return false
    }

    const { payload } = await jwtVerify(token, SECRET)
    // Accept tokens with either an allowed admin role or a verified email claim.
    const allowed = ['admin', 'super_admin', 'super-admin', 'owner']
    const role = (payload as Record<string, unknown>)['role']
    if (typeof role === 'string' && allowed.includes(role)) {
      return true
    }

    const email = (payload as Record<string, unknown>)['email']
    if (typeof email === 'string' && email.includes('@')) {
      return true
    }

    console.warn('[admin/upload] Token payload missing accepted admin claims', {
      role,
      hasEmail: typeof email === 'string'
    })
    return false
  } catch (error) {
    console.warn('[admin/upload] Token verification failed:', error)
    return false
  }
}

async function parseUploadPayload(req: NextRequest): Promise<{
  filename: string
  contentType: string
  bytes: Buffer
} | null> {
  const formData = await req.formData().catch((error) => {
    console.error('[admin/upload] formData parse failed', error)
    return null
  })

  if (!formData) {
    return null
  }

  const file = formData.get('file')
  if (!file || typeof file !== 'object' || !('arrayBuffer' in file) || !('type' in file) || !('name' in file)) {
    console.warn('[admin/upload] file missing in formData')
    return null
  }

  const typedFile = file as File
  const lowerName = typedFile.name.toLowerCase()
  const isImageMime = !!typedFile.type && typedFile.type.startsWith('image/')
  const isPngByExt = lowerName.endsWith('.png')

  if (!isImageMime && !isPngByExt) {
    console.warn('[admin/upload] invalid file type', typedFile.type)
    return null
  }

  const bytes = await typedFile.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return {
    filename: `${Date.now()}-${typedFile.name.replace(/\s+/g, '_')}`,
    contentType: typedFile.type || (isPngByExt ? 'image/png' : 'application/octet-stream'),
    bytes: buffer
  }
}

function getSupabaseOrigin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

async function uploadToImgBBFallback(fileName: string, bytes: Buffer) {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB fallback is not configured')
  }

  const formData = new FormData()
  formData.append('image', bytes.toString('base64'))
  formData.append('name', fileName)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success || !payload?.data?.url) {
    const details = payload?.error?.message || payload?.status_txt || 'ImgBB upload failed'
    throw new Error(details)
  }

  return payload.data.url as string
}

export async function POST(req: NextRequest) {
  console.log('[admin/upload] incoming auth debug', {
    hasAuthorizationHeader: !!req.headers.get('authorization'),
    hasAdminCookie: !!req.cookies.get('admin_token')?.value,
    contentType: req.headers.get('content-type') || ''
  })

  const isAuthorized = await verifyToken(req)
  if (!isAuthorized) {
    return unauthorized()
  }

  const parsed = await parseUploadPayload(req)
  if (!parsed) {
    console.warn('[admin/upload] invalid payload: expected multipart form-data with image file field "file"')
    return NextResponse.json({ error: 'File missing or invalid file type (only images are allowed, PNG supported)' }, { status: 400 })
  }

  const { filename, contentType, bytes } = parsed
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[admin/upload] supabase config missing', {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceRole: !!SERVICE_ROLE,
      bucket: PARTNERS_BUCKET
    })
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const supabaseOrigin = getSupabaseOrigin(SUPABASE_URL)
    if (!supabaseOrigin) {
      return NextResponse.json({ error: 'Invalid Supabase URL configuration' }, { status: 500 })
    }

    const uploadUrl = `${supabaseOrigin}/storage/v1/object/${PARTNERS_BUCKET}/${encodeURIComponent(filename)}`

    console.log('[admin/upload] uploading to', uploadUrl, 'filename:', filename, 'contentType:', contentType, 'bytes:', bytes.length, 'bucket:', PARTNERS_BUCKET)

    let res: Response
    try {
      res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE}`,
          apikey: SERVICE_ROLE,
          'Content-Type': contentType || 'application/octet-stream'
        },
        body: bytes as unknown as BodyInit
      })
    } catch (storageError) {
      console.error('[admin/upload] supabase storage fetch failed, trying ImgBB fallback', storageError)
      const fallbackUrl = await uploadToImgBBFallback(filename, bytes)
      return NextResponse.json({ success: true, fileName: filename, url: fallbackUrl, provider: 'imgbb-fallback' })
    }

    console.log('[admin/upload] storage response status', res.status)

    if (!res.ok) {
      const text = await res.text()
      console.error('[admin/upload] storage upload failed:', res.status, text)
      if (IMGBB_API_KEY) {
        try {
          console.warn('[admin/upload] supabase rejected upload, trying ImgBB fallback')
          const fallbackUrl = await uploadToImgBBFallback(filename, bytes)
          return NextResponse.json({ success: true, fileName: filename, url: fallbackUrl, provider: 'imgbb-fallback' })
        } catch (fallbackError) {
          console.error('[admin/upload] ImgBB fallback failed', fallbackError)
        }
      }
      return NextResponse.json({ error: 'Storage upload failed', details: text }, { status: 500 })
    }

    const url = `${supabaseOrigin}/storage/v1/object/public/${PARTNERS_BUCKET}/${encodeURIComponent(filename)}`

    console.log('[admin/upload] upload successful, public url:', url)

    return NextResponse.json({ success: true, fileName: filename, url })
  } catch (err) {
    console.error('UPLOAD CRASH:', err)
    const message = err instanceof Error ? err.message : 'Unknown upload crash'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
