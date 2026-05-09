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

// GET - Fetch user questions
export async function GET(request: NextRequest) {
try {
const searchParams = request.nextUrl.searchParams
const status = searchParams.get('status')
const publicOnly = searchParams.get('public')


// Build Firestore query
let questionsQuery

if (publicOnly === 'true') {
  questionsQuery = query(
    collection(db, 'user-questions'),
    where('is_public', '==', true),
    where('status', '==', 'answered')
  )
} else if (status) {
  questionsQuery = query(
    collection(db, 'user-questions'),
    where('status', '==', status)
  )
} else {
  questionsQuery = collection(db, 'user-questions')
}

const snapshot = await getDocs(questionsQuery)

let questions = snapshot.docs.map(docSnap => ({
  id: docSnap.id,
  ...docSnap.data()
}))

// Sort by submitted_at descending
questions.sort(
  (a: any, b: any) =>
    new Date(b.submitted_at || 0).getTime() -
    new Date(a.submitted_at || 0).getTime()
)

return NextResponse.json({ questions }, { status: 200 })


} catch (error) {
console.error('GET /api/user-questions error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// POST - Submit new question
export async function POST(request: NextRequest) {
try {
const body = await request.json()


if (!body.question) {
  return NextResponse.json(
    { error: 'Question is required' },
    { status: 400 }
  )
}

const questionData = {
  user_name: body.user_name || 'Anonymous',
  user_email: body.user_email || '',
  question: body.question,
  answer: body.answer || null,
  category: body.category || null,
  status: body.answer ? 'answered' : 'pending',
  is_public: body.is_public || false,
  submitted_at: new Date().toISOString(),
  answered_at: body.answer ? new Date().toISOString() : null
}

const docRef = await addDoc(
  collection(db, 'user-questions'),
  questionData
)

return NextResponse.json(
  {
    question: {
      id: docRef.id,
      ...questionData
    }
  },
  { status: 201 }
)


} catch (error) {
console.error('POST /api/user-questions error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// PUT - Update question (answer, status, visibility)
export async function PUT(request: NextRequest) {
try {
const body = await request.json()
const { id, ...updates } = body


if (!id) {
  return NextResponse.json(
    { error: 'Question ID is required' },
    { status: 400 }
  )
}

// If answering for the first time
if (updates.answer && !updates.answered_at) {
  updates.answered_at = new Date().toISOString()
  updates.status = 'answered'
}

const ref = doc(db, 'user-questions', id)
await updateDoc(ref, updates)

return NextResponse.json(
  {
    question: {
      id,
      ...updates
    }
  },
  { status: 200 }
)


} catch (error) {
console.error('PUT /api/user-questions error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}

// DELETE - Delete question
export async function DELETE(request: NextRequest) {
try {
const id = request.nextUrl.searchParams.get('id')


if (!id) {
  return NextResponse.json(
    { error: 'Question ID is required' },
    { status: 400 }
  )
}

await deleteDoc(doc(db, 'user-questions', id))

return NextResponse.json(
  { message: 'Question deleted successfully' },
  { status: 200 }
)


} catch (error) {
console.error('DELETE /api/user-questions error:', error)
return NextResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
)
}
}
