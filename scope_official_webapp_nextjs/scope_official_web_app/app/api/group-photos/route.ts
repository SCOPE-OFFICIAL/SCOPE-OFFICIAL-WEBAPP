import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
query,
where
} from 'firebase/firestore'

// GET - Fetch group photos (optionally filtered by category)
// If withTags=true, tags are fetched from the photo-tags collection.
export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const category = searchParams.get('category')
const withTags = searchParams.get('withTags')


// Build query
const photosQuery = category
  ? query(collection(db, 'group-photos'), where('category', '==', category))
  : collection(db, 'group-photos')

const snapshot = await getDocs(photosQuery)

let photos = snapshot.docs.map(docSnap => ({
  id: docSnap.id,
  ...docSnap.data()
}))

// Sort by display_order
photos.sort(
  (a: any, b: any) =>
    (a.display_order || 0) - (b.display_order || 0)
)

// Include tags if requested
if (withTags === 'true') {
  const photosWithTags = await Promise.all(
    photos.map(async (photo: any) => {
      const tagsSnapshot = await getDocs(
        query(
          collection(db, 'photo-tags'),
          where('photo_id', '==', photo.id)
        )
      )

      const tags = tagsSnapshot.docs.map(tagDoc => ({
        id: tagDoc.id,
        ...tagDoc.data()
      }))

      return {
        ...photo,
        tags
      }
    })
  )

  return NextResponse.json(
    { photos: photosWithTags },
    { status: 200 }
  )
}

return NextResponse.json({ photos }, { status: 200 })


} catch (error) {
console.error('GET /api/group-photos error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// POST - Create new group photo
export async function POST(request: NextRequest) {
try {
const body = await request.json()


if (!body.title || !body.image_url) {
  return NextResponse.json(
    { error: 'Missing required fields: title, image_url' },
    { status: 400 }
  )
}

const docRef = await addDoc(collection(db, 'group-photos'), {
  title: body.title,
  description: body.description || '',
  image_url: body.image_url,
  category: body.category || 'team',
  is_visible: body.is_visible ?? true,
  display_order: body.display_order || 0,
  createdAt: new Date().toISOString()
})

return NextResponse.json(
  {
    photo: {
      id: docRef.id,
      title: body.title,
      description: body.description || '',
      image_url: body.image_url,
      category: body.category || 'team',
      is_visible: body.is_visible ?? true,
      display_order: body.display_order || 0
    }
  },
  { status: 201 }
)


} catch (error) {
console.error('POST /api/group-photos error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// PUT - Update group photo
export async function PUT(request: NextRequest) {
try {
const body = await request.json()
const { id, ...updates } = body


if (!id) {
  return NextResponse.json(
    { error: 'Photo ID is required' },
    { status: 400 }
  )
}

const ref = doc(db, 'group-photos', id)
await updateDoc(ref, updates)

return NextResponse.json(
  {
    photo: {
      id,
      ...updates
    }
  },
  { status: 200 }
)


} catch (error) {
console.error('PUT /api/group-photos error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// DELETE - Delete group photo and all associated tags
export async function DELETE(request: NextRequest) {
try {
const id = request.nextUrl.searchParams.get('id')


if (!id) {
  return NextResponse.json(
    { error: 'Photo ID is required' },
    { status: 400 }
  )
}

// Delete associated photo tags
const tagsSnapshot = await getDocs(
  query(
    collection(db, 'photo-tags'),
    where('photo_id', '==', id)
  )
)

await Promise.all(
  tagsSnapshot.docs.map(tagDoc =>
    deleteDoc(doc(db, 'photo-tags', tagDoc.id))
  )
)

// Delete the group photo document
await deleteDoc(doc(db, 'group-photos', id))

// Note: Image remains hosted on ImgBB.
// ImgBB does not support anonymous deletion without storing delete URLs.

return NextResponse.json(
  { message: 'Photo deleted successfully' },
  { status: 200 }
)


} catch (error) {
console.error('DELETE /api/group-photos error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}
