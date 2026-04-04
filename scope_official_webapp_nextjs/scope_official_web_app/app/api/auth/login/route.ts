import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(
process.env.NEXTAUTH_SECRET || 'fallback-secret'
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
const admins = snapshot.docs.map(doc => doc.data())

// 🔥 Match ONLY email + password
const admin = admins.find(
  (a: any) =>
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
  email: admin.email
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(SECRET)

return NextResponse.json({
  success: true,
  token,
  user: {
    email: admin.email
  }
})


} catch (error) {
console.error('Login error:', error)


return NextResponse.json(
  { success: false, error: 'Authentication failed' },
  { status: 500 }
)


}
}
