/**
 * Team Members API Route
 * Handles CRUD operations for team members
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

// GET - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')

    let query = supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })

    if (active === 'true') {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ members: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role' },
        { status: 400 }
      )
    }

    // Whitelist expected fields to avoid inserting unexpected keys
    const insertPayload: Record<string, any> = {
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
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert([insertPayload])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ member: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update team member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Only allow known fields to be updated
    const allowedKeys = new Set([
      'name', 'role', 'year', 'bio', 'email', 'linkedin_url', 'instagram_url', 'github_url', 'personality', 'photo_url', 'display_order', 'is_active'
    ])

    const filteredUpdates: { [k: string]: string | number | boolean | null } = {}
    for (const key of Object.keys(updates)) {
      if (allowedKeys.has(key)) {
        filteredUpdates[key] = updates[key] ?? null
      }
    }

    const { data, error } = await supabase
      .from('team_members')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ member: data }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // First, get the team member data to find the storage path
    const { data: memberData, error: fetchError } = await supabase
      .from('team_members')
      .select('photo_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log('[DELETE team] Member data:', memberData)

    // Delete from database
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Delete from storage if photo exists
    if (memberData?.photo_url) {
      try {
        const storagePath = extractStoragePath(memberData.photo_url, 'team-photos')
        
        if (storagePath) {
          console.log('[DELETE team] Deleting from storage:', storagePath)
          
          const { error: storageError } = await supabase.storage
            .from('team-photos')
            .remove([storagePath])

          if (storageError) {
            console.error('Storage deletion error:', storageError)
          } else {
            console.log('[DELETE team] Successfully deleted from storage')
          }
        } else {
          console.warn('[DELETE team] Could not extract storage path from URL:', memberData.photo_url)
        }
      } catch (storageErr) {
        console.error('Storage cleanup error:', storageErr)
      }
    }

    return NextResponse.json({ message: 'Team member deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
