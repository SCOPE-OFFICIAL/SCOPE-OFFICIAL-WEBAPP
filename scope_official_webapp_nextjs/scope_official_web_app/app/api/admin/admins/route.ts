import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
collection,
getDocs,
addDoc,
deleteDoc,
doc,
query,
where
} from 'firebase/firestore'
import { jwtVerify } from 'jose'

// GET - Fetch all admins
export async function GET() {
try {
const snapshot = await getDocs(collection(db, 'admins'))


let admins = snapshot.docs.map(docSnap => ({
  id: docSnap.id,
  ...docSnap.data()
}))

// Sort by created_at descending
admins.sort(
  (a: any, b: any) =>
    new Date(b.created_at || 0).getTime() -
    new Date(a.created_at || 0).getTime()
)

return NextResponse.json(
  { admins: admins || [] },
  { status: 200 }
)


} catch (error) {
console.error('Error fetching admins:', error)
return NextResponse.json(
{ error: 'Failed to fetch admins' },
{ status: 500 }
)
}
}

// POST - Add new admin
export async function POST(request: NextRequest) {
try {
const body = await request.json()
const { email, password, name } = body


// Validate required fields
if (!email || !password || !name) {
  return NextResponse.json(
    { error: 'Email, password, and name are required' },
    { status: 400 }
  )
}

// Check if admin with this email already exists
const existingQuery = query(
  collection(db, 'admins'),
  where('email', '==', email)
)

const existingSnapshot = await getDocs(existingQuery)

if (!existingSnapshot.empty) {
  return NextResponse.json(
    { error: 'Admin with this email already exists' },
    { status: 400 }
  )
}

// Create new admin document
const adminData = {
  email,
  password, // Plain text password (as requested)
  name,
  role: 'super_admin',
  created_at: new Date().toISOString()
}

const docRef = await addDoc(
  collection(db, 'admins'),
  adminData
)

return NextResponse.json(
  {
    success: true,
    admin: {
      id: docRef.id,
      ...adminData
    }
  },
  { status: 201 }
)


} catch (error) {
console.error('Error creating admin:', error)
return NextResponse.json(
{ error: 'Failed to create admin' },
{ status: 500 }
)
}
}

// DELETE - Remove admin (only owner can delete)
export async function DELETE(request: NextRequest) {
try {
const { searchParams } = new URL(request.url)
const id = searchParams.get('id')


if (!id) {
  return NextResponse.json(
    { error: 'Admin ID is required' },
    { status: 400 }
  )
}

// Read Bearer token
const authHeader = request.headers.get('authorization') || ''
const token = authHeader.startsWith('Bearer ')
  ? authHeader.replace('Bearer ', '')
  : null

if (!token) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}

// Verify JWT
const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
)

let payload: Record<string, unknown>

try {
  const verified = await jwtVerify(token, SECRET)
  payload = verified.payload
} catch (err) {
  console.error('JWT verification failed:', err)
  return NextResponse.json(
    { error: 'Invalid token' },
    { status: 401 }
  )
}

// Only owner email can delete admins
const OWNER_EMAIL = 'rohanbaiju210@gmail.com'

if (!payload?.email || payload.email !== OWNER_EMAIL) {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  )
}

// Delete admin document
await deleteDoc(doc(db, 'admins', id))

return NextResponse.json(
  {
    success: true,
    message: 'Admin deleted successfully'
  },
  { status: 200 }
)


} catch (error) {
console.error('Error deleting admin:', error)
return NextResponse.json(
{ error: 'Failed to delete admin' },
{ status: 500 }
)
}
}
