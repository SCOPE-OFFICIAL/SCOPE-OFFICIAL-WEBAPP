/**
 * Events API Route
 * Handles CRUD operations for events
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for admin operations
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

// GET - Fetch all events (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // published, draft, completed
    const type = searchParams.get('type') // workshop, hackathon, etc.
    const featured = searchParams.get('featured') // true/false
    const upcoming = searchParams.get('upcoming') // true for upcoming events only

    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (type) {
      query = query.eq('event_type', type)
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (upcoming === 'true') {
      // When requesting upcoming events, we'll fetch published events and
      // perform a full datetime filter server-side using event_date + event_time.
      // This is more accurate than date-only comparisons and handles events
      // with specific times (and timezone differences).
      query = query.eq('status', 'published')
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If the client requested upcoming events, filter them by full datetime
    // (event_date + event_time). This ensures that events on previous dates
    // (e.g., yesterday) are excluded even if their date string comparison
    // might be ambiguous due to timezone differences.
    type ApiEvent = {
      event_date?: string | null
      event_time?: string | null
      [key: string]: unknown
    }

    let events: ApiEvent[] = (data || []) as ApiEvent[]
    if (upcoming === 'true') {
      const now = Date.now()
      events = events.filter((ev) => {
        try {
          const datePart = (ev.event_date as string) || ''
          const timePart = (ev.event_time as string) || '00:00:00'
          const dt = new Date(`${datePart}T${timePart}`)
          return dt.getTime() >= now
        } catch {
          return false
        }
      })

      // Sort by ascending datetime just in case
      events = events.sort((a, b) => {
        const aTime = new Date(`${(a.event_date as string) || ''}T${(a.event_time as string) || '00:00:00'}`).getTime()
        const bTime = new Date(`${(b.event_date as string) || ''}T${(b.event_time as string) || '00:00:00'}`).getTime()
        return aTime - bTime
      })
    }

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.event_date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, event_date' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update existing event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
