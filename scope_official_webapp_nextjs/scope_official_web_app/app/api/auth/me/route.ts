import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return req.cookies.get('admin_token')?.value || null
}

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const email = typeof payload.email === 'string' ? payload.email : ''
    const role = typeof payload.role === 'string' ? payload.role : 'admin'

    if (!email) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      token,
      user: {
        email,
        role
      }
    })
  } catch (error) {
    console.warn('[auth/me] token verification failed', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
