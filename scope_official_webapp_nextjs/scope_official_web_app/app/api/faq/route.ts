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

// GET - Fetch FAQs
export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const category = searchParams.get('category')


const faqQuery = category
  ? query(collection(db, 'faq'), where('category', '==', category))
  : collection(db, 'faq')

const snapshot = await getDocs(faqQuery)

let faqs = snapshot.docs.map(docSnap => ({
  id: docSnap.id,
  ...docSnap.data()
}))

// Sort by display_order
faqs.sort(
  (a: any, b: any) =>
    (a.display_order || 0) - (b.display_order || 0)
)

return NextResponse.json({ faqs }, { status: 200 })


} catch (error) {
console.error('GET /api/faq error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
try {
const body = await request.json()


if (!body.question || !body.answer) {
  return NextResponse.json(
    { error: 'Missing required fields: question, answer' },
    { status: 400 }
  )
}

const docRef = await addDoc(collection(db, 'faq'), {
  question: body.question,
  answer: body.answer,
  category: body.category || null,
  display_order: body.display_order || 0,
  is_visible: body.is_visible ?? true,
  createdAt: new Date().toISOString()
})

return NextResponse.json(
  {
    faq: {
      id: docRef.id,
      question: body.question,
      answer: body.answer,
      category: body.category || null,
      display_order: body.display_order || 0,
      is_visible: body.is_visible ?? true
    }
  },
  { status: 201 }
)


} catch (error) {
console.error('POST /api/faq error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// PUT - Update FAQ
export async function PUT(request: NextRequest) {
try {
const body = await request.json()
const { id, ...updates } = body


if (!id) {
  return NextResponse.json(
    { error: 'FAQ ID is required' },
    { status: 400 }
  )
}

const ref = doc(db, 'faq', id)
await updateDoc(ref, updates)

return NextResponse.json(
  {
    faq: {
      id,
      ...updates
    }
  },
  { status: 200 }
)


} catch (error) {
console.error('PUT /api/faq error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// DELETE - Delete FAQ
export async function DELETE(request: NextRequest) {
try {
const id = request.nextUrl.searchParams.get('id')


if (!id) {
  return NextResponse.json(
    { error: 'FAQ ID is required' },
    { status: 400 }
  )
}

await deleteDoc(doc(db, 'faq', id))

return NextResponse.json(
  { message: 'FAQ deleted successfully' },
  { status: 200 }
)

} catch (error) {
console.error('DELETE /api/faq error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}
