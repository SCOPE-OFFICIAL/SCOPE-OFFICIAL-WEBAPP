/**
 * Team API Route (Firebase Version)
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

// GET - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')

    const snapshot = await getDocs(collection(db, 'team'))
    
    let members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter active members if requested
    if (active === 'true') {
      members = members.filter((m: any) => m.is_active === true)
    }

    // Sort by display order
    members.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))

    return NextResponse.json({ members }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new team member OR upload image
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

    // 🔥 CASE 2: CREATE TEAM MEMBER (JSON)
    const body = await request.json()

    if (!body.name || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: name and role are required' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, 'team'), {
      name: body.name,
      role: body.role,
      year: body.year ?? null,
      bio: body.bio ?? null,
      email: body.email ?? null,
      linkedin_url: body.linkedin_url ?? null,
      instagram_url: body.instagram_url ?? null,
      github_url: body.github_url ?? null,
      personality: body.personality ?? null,
      photo_url: body.photo_url ?? null,
      display_order: typeof body.display_order === 'number' ? body.display_order : 0,
      is_active: typeof body.is_active === 'boolean' ? body.is_active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(
      { success: true, id: docRef.id, message: 'Team member created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 })
  }
}

// PUT - Update team member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Team member ID required' }, { status: 400 })
    }

    // Define allowed fields for update
    const allowedFields = [
      'name',
      'role',
      'year',
      'bio',
      'email',
      'linkedin_url',
      'instagram_url',
      'github_url',
      'personality',
      'photo_url',
      'display_order',
      'is_active'
    ]

    // Filter only allowed fields
    const filteredUpdates: any = {
      updatedAt: new Date().toISOString()
    }

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field] ?? null
      }
    }

    const ref = doc(db, 'team', id)
    await updateDoc(ref, filteredUpdates)

    return NextResponse.json({ success: true, message: 'Team member updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Team member ID required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'team', id))

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}