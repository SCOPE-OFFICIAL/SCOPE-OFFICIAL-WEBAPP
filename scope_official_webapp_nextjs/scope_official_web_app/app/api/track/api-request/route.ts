/**
 * API Route to track API requests for analytics
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
    const { endpoint, method, status_code, response_time_ms } = body

    // Get user agent and IP
    const user_agent = req.headers.get('user-agent') || 'Unknown'
    const ip_address = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'Unknown'

    // Insert API request log
    const { error } = await supabase
      .from('api_requests')
      .insert({
        endpoint,
        method,
        status_code,
        response_time_ms,
        user_agent,
        ip_address
      })

    if (error) {
      console.error('Error tracking API request:', error)
      return NextResponse.json(
        { error: 'Failed to track API request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API request tracking error:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
