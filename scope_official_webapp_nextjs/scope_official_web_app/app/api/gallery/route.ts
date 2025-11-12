/**
 * Gallery API Route
 * Handles CRUD operations for gallery images
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Helper function to extract storage path from Supabase URL
 */
function extractStoragePath(imageUrl: string, bucketName: string): string | null {
  try {
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`))
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch (error) {
    console.error('Error extracting storage path:', error)
    return null
  }
}

// GET - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder')
    const visible = searchParams.get('visible')

    let query = supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })

    if (folder) {
      query = query.eq('folder_name', folder)
    }

    if (visible === 'true') {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ images: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.image_url || !body.folder_name) {
      return NextResponse.json(
        { error: 'Missing required fields: image_url, folder_name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update gallery image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // First, get the image data to find the storage path
    const { data: imageData, error: fetchError } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log('[DELETE gallery] Image data:', imageData)

    // Delete from database
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Delete from storage if image exists
    if (imageData?.image_url) {
      try {
        const storagePath = extractStoragePath(imageData.image_url, 'gallery-images')
        
        if (storagePath) {
          console.log('[DELETE gallery] Deleting from storage:', storagePath)
          
          const { error: storageError } = await supabase.storage
            .from('gallery-images')
            .remove([storagePath])

          if (storageError) {
            console.error('Storage deletion error:', storageError)
          } else {
            console.log('[DELETE gallery] Successfully deleted from storage')
          }
        } else {
          console.warn('[DELETE gallery] Could not extract storage path from URL:', imageData.image_url)
        }
      } catch (storageErr) {
        console.error('Storage cleanup error:', storageErr)
      }
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
