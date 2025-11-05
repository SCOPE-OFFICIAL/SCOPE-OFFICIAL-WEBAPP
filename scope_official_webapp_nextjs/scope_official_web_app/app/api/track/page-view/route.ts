/**
 * API Route to track page views
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page_path, page_title, referrer, session_id } = body

    // Get user agent and IP
    const user_agent = req.headers.get('user-agent') || 'Unknown'
    const ip_address = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'Unknown'

    // Insert page view
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_path,
        page_title,
        referrer,
        user_agent,
        ip_address,
        session_id
      })

    if (error) {
      console.error('Error tracking page view:', error)
      return NextResponse.json(
        { error: 'Failed to track page view' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Page view tracking error:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
