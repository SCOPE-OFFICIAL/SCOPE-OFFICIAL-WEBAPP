/**
 * API Route for Past Events Management
 * GET - Fetch all past events
 * POST - Create new past event
 * PUT - Update past event
 * DELETE - Delete past event
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Fetch past events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible') === 'true'
    
    let query = supabase
      .from('past_events')
      .select('*')
      .order('display_order', { ascending: true })

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ pastEvents: data || [] })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new past event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_name, poster_image_url, display_order, is_visible } = body

    if (!event_name || !poster_image_url) {
      return NextResponse.json(
        { error: 'Event name and poster image are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('past_events')
      .insert([
        {
          event_name,
          poster_image_url,
          display_order: display_order || 0,
          is_visible: is_visible !== undefined ? is_visible : true
        }
      ])
      .select()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ pastEvent: data[0] }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update past event
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { event_name, poster_image_url, display_order, is_visible } = body

    const updateData: Record<string, string | number | boolean> = {}
    if (event_name !== undefined) updateData.event_name = event_name
    if (poster_image_url !== undefined) updateData.poster_image_url = poster_image_url
    if (display_order !== undefined) updateData.display_order = display_order
    if (is_visible !== undefined) updateData.is_visible = is_visible

    const { data, error } = await supabase
      .from('past_events')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Past event not found' }, { status: 404 })
    }

    return NextResponse.json({ pastEvent: data[0] })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete past event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('past_events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Past event deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
