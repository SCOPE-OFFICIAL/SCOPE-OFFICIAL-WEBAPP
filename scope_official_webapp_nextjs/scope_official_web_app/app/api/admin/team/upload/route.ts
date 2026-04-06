import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const TEAM_BUCKET = process.env.SUPABASE_TEAM_BUCKET || 'team-photos'
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
  return req.cookies.get('admin_token')?.value || null
}

async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      console.warn('[admin/team/upload] Missing auth token in header/cookie')
      return false
    }

    const { payload } = await jwtVerify(token, SECRET)
    const role = (payload as Record<string, unknown>).role
    const allowedRoles = ['admin', 'super_admin', 'super-admin', 'owner']
    if (typeof role === 'string' && allowedRoles.includes(role)) {
      return true
    }

    const email = (payload as Record<string, unknown>).email
    if (typeof email === 'string' && email.includes('@')) {
      return true
    }

    console.warn('[admin/team/upload] Token payload missing accepted admin claims', { role })
    return false
  } catch (error) {
    console.warn('[admin/team/upload] Token verification failed:', error)
    return false
  }
}

function getSupabaseOrigin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

async function parseUploadPayload(req: NextRequest): Promise<{
  fileName: string
  contentType: string
  bytes: Buffer
} | null> {
  const formData = await req.formData().catch((error) => {
    console.error('[admin/team/upload] formData parse failed', error)
    return null
  })

  if (!formData) return null

  const file = formData.get('file')
  if (!file || typeof file !== 'object' || !('arrayBuffer' in file) || !('type' in file) || !('name' in file)) {
    console.warn('[admin/team/upload] file missing in formData')
    return null
  }

  const typedFile = file as File
  const lowerName = typedFile.name.toLowerCase()
  const isImageMime = !!typedFile.type && typedFile.type.startsWith('image/')
  const isPngByExt = lowerName.endsWith('.png')

  if (!isImageMime && !isPngByExt) {
    console.warn('[admin/team/upload] invalid file type', typedFile.type)
    return null
  }

  const bytes = await typedFile.arrayBuffer()
  return {
    fileName: `${Date.now()}-${typedFile.name.replace(/\s+/g, '_')}`,
    contentType: typedFile.type || (isPngByExt ? 'image/png' : 'application/octet-stream'),
    bytes: Buffer.from(bytes)
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
  console.log('[admin/team/upload] incoming auth debug', {
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
    return NextResponse.json({ error: 'File missing or invalid file type (only images are allowed)' }, { status: 400 })
  }

  const { fileName, contentType, bytes } = parsed

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('[admin/team/upload] Supabase config missing', {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceRole: !!SERVICE_ROLE
    })
    if (IMGBB_API_KEY) {
      try {
        const fallbackUrl = await uploadToImgBBFallback(fileName, bytes)
        return NextResponse.json({ success: true, url: fallbackUrl, fileName, provider: 'imgbb-fallback' })
      } catch (fallbackError) {
        console.error('[admin/team/upload] ImgBB fallback failed', fallbackError)
      }
    }
    return NextResponse.json({ error: 'Upload service not configured' }, { status: 500 })
  }

  try {
    const supabaseOrigin = getSupabaseOrigin(SUPABASE_URL)
    if (!supabaseOrigin) {
      throw new Error('Invalid Supabase URL configuration')
    }

    const uploadUrl = `${supabaseOrigin}/storage/v1/object/${TEAM_BUCKET}/${encodeURIComponent(fileName)}`
    console.log('[admin/team/upload] uploading to', uploadUrl, 'contentType:', contentType, 'bytes:', bytes.length)

    let response: Response
    try {
      response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE}`,
          apikey: SERVICE_ROLE,
          'Content-Type': contentType
        },
        body: bytes as unknown as BodyInit
      })
    } catch (storageError) {
      console.error('[admin/team/upload] Supabase storage fetch failed, trying ImgBB fallback', storageError)
      const fallbackUrl = await uploadToImgBBFallback(fileName, bytes)
      return NextResponse.json({ success: true, url: fallbackUrl, fileName, provider: 'imgbb-fallback' })
    }

    if (!response.ok) {
      const text = await response.text()
      console.error('[admin/team/upload] storage upload failed:', response.status, text)
      if (IMGBB_API_KEY) {
        try {
          const fallbackUrl = await uploadToImgBBFallback(fileName, bytes)
          return NextResponse.json({ success: true, url: fallbackUrl, fileName, provider: 'imgbb-fallback' })
        } catch (fallbackError) {
          console.error('[admin/team/upload] ImgBB fallback failed after storage reject', fallbackError)
        }
      }
      return NextResponse.json({ error: 'Storage upload failed', details: text }, { status: 500 })
    }

    const url = `${supabaseOrigin}/storage/v1/object/public/${TEAM_BUCKET}/${encodeURIComponent(fileName)}`
    return NextResponse.json({ success: true, url, fileName, provider: 'supabase' })
  } catch (error) {
    console.error('TEAM UPLOAD CRASH:', error)
    const message = error instanceof Error ? error.message : 'Unknown upload crash'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
