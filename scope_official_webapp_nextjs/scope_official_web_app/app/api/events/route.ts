/**
 * Events API Route (Firebase Version)
 */

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

// GET - Fetch all events
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'events'))
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new event OR upload image
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // 🔥 CASE 1: IMAGE UPLOAD (form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File must be less than 5MB' }, { status: 400 })
      }

      // Convert file → base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')

      const apiKey = process.env.IMGBB_API_KEY

      if (!apiKey) {
        console.error('IMGBB_API_KEY is not configured in environment variables')
        return NextResponse.json({ error: 'Image upload service not configured' }, { status: 500 })
      }

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: 'POST',
          body: new URLSearchParams({ image: base64 })
        }
      )

      const data = await res.json()

      if (!data.success) {
        console.error('ImgBB error:', data)
        return NextResponse.json({ error: 'Image upload failed: ' + (data.error?.message || 'Unknown error') }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        imageUrl: data.data.url
      })
    }

    // 🔥 CASE 2: CREATE EVENT (JSON)
    const body = await request.json()

    if (!body.title || !body.description || !body.event_date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, and event_date are required' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, 'events'), {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(
      { success: true, id: docRef.id, message: 'Event created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 })
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    const ref = doc(db, 'events', id)
    await updateDoc(ref, {
      ...updates,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, message: 'Event updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'events', id))

    return NextResponse.json({ success: true, message: 'Event deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}