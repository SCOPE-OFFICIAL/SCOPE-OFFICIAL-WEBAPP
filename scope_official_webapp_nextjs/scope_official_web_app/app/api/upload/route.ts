/**
 * Image Upload API Route (ImgBB Version)
 * Converted from Supabase Storage to ImgBB
 * Handles file uploads — returns a hosted image URL from ImgBB
 *
 * Note: ImgBB free plan does not support programmatic deletion.
 * The DELETE handler is kept for API compatibility but returns a notice.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    // `bucket` and `folder` params are accepted but unused — kept for
    // drop-in compatibility with existing callers that pass them.
    // const bucket = formData.get('bucket') as string || ''
    // const folder = formData.get('folder') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      console.error('IMGBB_API_KEY is not set in environment variables')
      return NextResponse.json({ error: 'Image upload service not configured' }, { status: 500 })
    }

    // Convert to base64 and upload to ImgBB
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: new URLSearchParams({ image: base64 })
    })

    const data = await res.json()

    if (!data.success) {
      console.error('ImgBB upload error:', data)
      return NextResponse.json(
        { error: 'Image upload failed: ' + (data.error?.message || 'Unknown error') },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        url: data.data.url,         // direct image URL  (used by callers expecting `data.url`)
        imageUrl: data.data.url,    // alias kept for callers expecting `data.imageUrl`
        deleteUrl: data.data.delete_url // ImgBB manual delete link (not programmatic)
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - ImgBB free plan does not support API-based deletion.
// This stub is kept so existing code that calls DELETE /api/upload doesn't crash.
export async function DELETE(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message:
        'Programmatic deletion is not supported by ImgBB on the free plan. ' +
        'Use the deleteUrl returned at upload time to remove the image manually.'
    },
    { status: 501 }
  )
}