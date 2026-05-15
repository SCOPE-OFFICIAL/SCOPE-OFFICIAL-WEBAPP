/**
 * Gallery API Route (Firebase + ImgBB Version)
 * Converted from Supabase to Firebase Firestore + ImgBB image storage
 */

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
  where,
  orderBy
} from 'firebase/firestore'

// GET - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder')
    const visible = searchParams.get('visible')

    const snapshot = await getDocs(collection(db, 'gallery'))

    let images = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as any[]

    if (folder) {
      images = images.filter(img => img.folder_name === folder)
    }

    if (visible === 'true') {
      images = images.filter(img => img.is_visible === true)
    }

    images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

    return NextResponse.json({ images }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add new gallery image (with optional ImgBB upload)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // CASE 1: IMAGE UPLOAD via multipart/form-data → upload to ImgBB
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File must be less than 5MB' }, { status: 400 })
      }

      const apiKey = process.env.IMGBB_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: 'Image upload service not configured' }, { status: 500 })
      }

      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: new URLSearchParams({ image: base64 })
      })

      const data = await res.json()

      if (!data.success) {
        console.error('ImgBB error:', data)
        return NextResponse.json(
          { error: 'Image upload failed: ' + (data.error?.message || 'Unknown error') },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, imageUrl: data.data.url })
    }

    // CASE 2: Add gallery image record (JSON body with image_url already set)
    const body = await request.json()

    if (!body.image_url || !body.folder_name) {
      return NextResponse.json(
        { error: 'Missing required fields: image_url, folder_name' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, 'gallery'), {
      image_url: body.image_url,
      folder_name: body.folder_name,
      caption: body.caption ?? null,
      display_order: typeof body.display_order === 'number' ? body.display_order : 0,
      is_visible: typeof body.is_visible === 'boolean' ? body.is_visible : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ image: { id: docRef.id } }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update gallery image metadata
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const allowedFields = ['image_url', 'folder_name', 'caption', 'display_order', 'is_visible']
    const filteredUpdates: any = { updatedAt: new Date().toISOString() }

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field] ?? null
      }
    }

    const ref = doc(db, 'gallery', id)
    await updateDoc(ref, filteredUpdates)

    return NextResponse.json({ image: { id, ...filteredUpdates } }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete gallery image record
// Note: ImgBB does not support deletion via API on free plans.
// The record is removed from Firestore; the hosted image URL becomes orphaned.
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'gallery', id))

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}