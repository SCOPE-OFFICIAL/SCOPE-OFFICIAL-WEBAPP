/**
 * Photo Tags API Route (Firebase Version)
 * Converted from Supabase to Firebase Firestore
 * Handles tagging people in group photos
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

// GET - Fetch tags (optionally filtered by photoId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const photoId = searchParams.get('photoId')

    const snapshot = await getDocs(collection(db, 'photo_tags'))

    let tags = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as any[]

    if (photoId) {
      tags = tags.filter(tag => tag.photo_id === photoId)
    }

    return NextResponse.json({ tags }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add tag to photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (
      !body.photo_id ||
      !body.person_name ||
      body.position_x === undefined ||
      body.position_y === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: photo_id, person_name, position_x, position_y' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, 'photo_tags'), {
      photo_id: body.photo_id,
      person_name: body.person_name,
      position_x: body.position_x,
      position_y: body.position_y,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json(
      { tag: { id: docRef.id, ...body } },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update tag position or name
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    const allowedFields = ['person_name', 'position_x', 'position_y']
    const filteredUpdates: any = { updatedAt: new Date().toISOString() }

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }

    const ref = doc(db, 'photo_tags', id)
    await updateDoc(ref, filteredUpdates)

    return NextResponse.json({ tag: { id, ...filteredUpdates } }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete tag
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'photo_tags', id))

    return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}