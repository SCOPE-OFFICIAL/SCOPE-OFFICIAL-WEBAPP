import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc
} from 'firebase/firestore'

// GET
export async function GET() {
try {
const snapshot = await getDocs(collection(db, 'past-events'))


let pastEvents = snapshot.docs.map(docSnap => ({
  id: docSnap.id,
  ...docSnap.data()
}))

pastEvents.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))

return NextResponse.json({ pastEvents })


} catch (error) {
console.error(error)
return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
}
}

// POST (JSON ONLY)
export async function POST(request: NextRequest) {
try {
const body = await request.json()

if (!body.event_name || !body.poster_image_url) {
  return NextResponse.json(
    { error: 'event_name + poster_image_url required' },
    { status: 400 }
  )
}

const docRef = await addDoc(collection(db, 'past-events'), {
  event_name: body.event_name,
  poster_image_url: body.poster_image_url,
  description: body.description || '',
  display_order: body.display_order || 0,
  is_visible: body.is_visible ?? true,
  gallery_folder: body.gallery_folder || '',
  createdAt: new Date().toISOString()
})

return NextResponse.json({ success: true, id: docRef.id })


} catch (error) {
console.error(error)
return NextResponse.json({ error: 'Create failed' }, { status: 500 })
}
}

// PUT
export async function PUT(request: NextRequest) {
try {
const id = request.nextUrl.searchParams.get('id')
const body = await request.json()


if (!id) {
  return NextResponse.json({ error: 'ID required' }, { status: 400 })
}

await updateDoc(doc(db, 'past-events', id), body)

return NextResponse.json({ success: true })


} catch (error) {
console.error(error)
return NextResponse.json({ error: 'Update failed' }, { status: 500 })
}
}

// DELETE
export async function DELETE(request: NextRequest) {
try {
const id = request.nextUrl.searchParams.get('id')


if (!id) {
  return NextResponse.json({ error: 'ID required' }, { status: 400 })
}

await deleteDoc(doc(db, 'past-events', id))

return NextResponse.json({ success: true })


} catch (error) {
console.error(error)
return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
}
}
