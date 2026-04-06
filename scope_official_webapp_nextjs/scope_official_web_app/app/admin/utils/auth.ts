const ADMIN_TOKEN_STORAGE_KEY = 'admin_token'
const ADMIN_EMAIL_STORAGE_KEY = 'admin_email'
const ADMIN_NAME_STORAGE_KEY = 'admin_name'
const ADMIN_ROLE_STORAGE_KEY = 'admin_role'
const ADMIN_REDIRECT_STORAGE_KEY = 'admin_redirect_after_login'
const ADMIN_TOKEN_COOKIE = 'admin_token'

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7

const isBrowser = () => typeof window !== 'undefined'

const readCookie = (name: string): string | null => {
  if (!isBrowser()) return null
  const parts = document.cookie ? document.cookie.split('; ') : []
  const key = `${name}=`
  for (const part of parts) {
    if (part.startsWith(key)) {
      return decodeURIComponent(part.slice(key.length))
    }
  }
  return null
}

const writeCookie = (name: string, value: string, maxAgeSeconds: number) => {
  if (!isBrowser()) return
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`
}

const clearCookie = (name: string) => {
  if (!isBrowser()) return
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}

export const getRedirectFromSearch = (search: string): string | null => {
  const redirect = new URLSearchParams(search).get('redirect')
  if (!redirect) return null
  if (!redirect.startsWith('/admin')) return null
  return redirect
}

export const buildLoginHref = (fromPath: string) => {
  const safePath = fromPath.startsWith('/admin') ? fromPath : '/admin/dashboard'
  return `/admin/login?redirect=${encodeURIComponent(safePath)}`
}

export const setAdminSession = (args: {
  token: string
  email?: string
  name?: string
  role?: string
}) => {
  if (!isBrowser()) return
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, args.token)
  if (args.email) localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, args.email)
  if (args.name) localStorage.setItem(ADMIN_NAME_STORAGE_KEY, args.name)
  if (args.role) localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, args.role)
  writeCookie(ADMIN_TOKEN_COOKIE, args.token, SEVEN_DAYS_IN_SECONDS)
}

export const clearAdminSession = () => {
  if (!isBrowser()) return
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
  localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY)
  localStorage.removeItem(ADMIN_NAME_STORAGE_KEY)
  localStorage.removeItem(ADMIN_ROLE_STORAGE_KEY)
  clearCookie(ADMIN_TOKEN_COOKIE)
}

export const getAdminToken = (): string | null => {
  if (!isBrowser()) return null
  const fromStorage = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
  if (fromStorage) return fromStorage

  const fromCookie = readCookie(ADMIN_TOKEN_COOKIE)
  if (fromCookie) {
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, fromCookie)
    return fromCookie
  }

  return null
}

export const storePostLoginRedirect = (path: string) => {
  if (!isBrowser()) return
  if (path.startsWith('/admin')) {
    localStorage.setItem(ADMIN_REDIRECT_STORAGE_KEY, path)
  }
}

export const consumePostLoginRedirect = (): string | null => {
  if (!isBrowser()) return null
  const path = localStorage.getItem(ADMIN_REDIRECT_STORAGE_KEY)
  if (!path) return null
  localStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY)
  return path.startsWith('/admin') ? path : null
}

export const resolveAdminSession = async (timeoutMs = 8000): Promise<boolean> => {
  if (!isBrowser()) return false

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const token = getAdminToken()
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal
    })

    if (!response.ok) {
      console.warn('[admin-auth] /api/auth/me returned non-OK', response.status)
      return false
    }

    const data = await response.json().catch(() => null)
    if (!data?.authenticated) {
      console.warn('[admin-auth] /api/auth/me says unauthenticated')
      return false
    }

    if (data.token && data.user?.email) {
      setAdminSession({
        token: data.token,
        email: data.user.email,
        name: data.user.name || data.user.email,
        role: data.user.role || 'admin'
      })
    }

    return true
  } catch (error) {
    console.error('[admin-auth] resolveAdminSession failed', error)
    return false
  } finally {
    window.clearTimeout(timeoutId)
  }
}
