import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
)

// GET - Return distinct gallery folder names for a typeahead dropdown
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const visible = searchParams.get('visible')

    let query = supabase.from('gallery').select('folder_name')

    if (visible === 'true') {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query.order('folder_name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching folders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique, non-empty folder names
    const folders = Array.from(
      new Set(
        (data || [])
          .map((r: any) => (r.folder_name ? String(r.folder_name).trim() : ''))
          .filter((n: string) => n.length > 0)
      )
    )

    return NextResponse.json({ folders }, { status: 200 })
  } catch (error) {
    console.error('Error in folders GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
