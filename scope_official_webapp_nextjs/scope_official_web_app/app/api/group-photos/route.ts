/**
 * Group Photos API Route
 * Handles team group photos with tagged members
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

// GET - Fetch group photos with tags
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const withTags = searchParams.get('withTags')

    let query = supabase
      .from('group_photos')
      .select('*')
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: photos, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If withTags=true, fetch tags for each photo
    if (withTags === 'true' && photos) {
      const photosWithTags = await Promise.all(
        photos.map(async (photo) => {
          const { data: tags } = await supabase
            .from('photo_tags')
            .select('*')
            .eq('photo_id', photo.id)

          return { ...photo, tags: tags || [] }
        })
      )
      return NextResponse.json({ photos: photosWithTags }, { status: 200 })
    }

    return NextResponse.json({ photos }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    const { data, error } = await supabase
      .from('group_photos')
      .insert([{
        title: body.title,
        description: body.description,
        image_url: body.image_url,
        category: body.category || 'team',
        is_visible: body.is_visible ?? true,
        display_order: body.display_order || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photo: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update group photo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('group_photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photo: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete group photo and its tags
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 })
    }

    // Tags will be auto-deleted due to CASCADE
    const { error } = await supabase
      .from('group_photos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Photo deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
