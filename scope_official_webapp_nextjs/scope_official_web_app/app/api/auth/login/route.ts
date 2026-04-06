import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { SignJWT } from 'jose'

interface AdminRecord {
  email?: string
  password?: string
  role?: string
}

const SECRET = new TextEncoder().encode(
process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
)

export async function POST(request: NextRequest) {
try {
const body = await request.json()


const email = body.email?.trim()
const password = body.password?.trim()

// ✅ Only email + password required
if (!email || !password) {
  return NextResponse.json(
    { success: false, error: 'Email and password required' },
    { status: 400 }
  )
}

// 🔥 Fetch admins
const snapshot = await getDocs(collection(db, 'admins'))

// Convert docs safely
const admins = snapshot.docs.map(doc => doc.data() as AdminRecord)

// 🔥 Match ONLY email + password
const admin = admins.find(
  (a) =>
    a.email?.trim() === email &&
    a.password?.trim() === password
)

if (!admin) {
  return NextResponse.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  )
}

// ✅ Minimal JWT (no dependency on extra fields)
const token = await new SignJWT({
  email: admin.email,
  role: admin.role || 'admin'
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(SECRET)

const response = NextResponse.json({
  success: true,
  token,
  user: {
    email: admin.email,
    role: admin.role || 'admin'
  }
})

response.cookies.set('admin_token', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7
})

return response


} catch (error) {
console.error('Login error:', error)


return NextResponse.json(
  { success: false, error: 'Authentication failed' },
  { status: 500 }
)


}
}
