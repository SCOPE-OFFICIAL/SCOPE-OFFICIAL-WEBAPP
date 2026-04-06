import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')
const ADMIN_TOKEN_COOKIE = 'admin_token'

const isValidAdminPath = (path: string | null) => {
  if (!path) return false
  return path.startsWith('/admin')
}

const verifyToken = async (token: string) => {
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value
  const isAuthenticated = token ? await verifyToken(token) : false

  if (pathname === '/admin/login') {
    if (!isAuthenticated) {
      return NextResponse.next()
    }

    const redirectTarget = request.nextUrl.searchParams.get('redirect')
    const destination = isValidAdminPath(redirectTarget) ? redirectTarget! : '/admin/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  if (!isAuthenticated) {
    const from = `${pathname}${search}`
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', from)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
