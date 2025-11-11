/**
 * Admin Management API
 * Handles CRUD operations for admin accounts
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Fetch all admins
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ admins: data || [] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// POST - Add new admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if admin with this email already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      )
    }

    // Insert new admin
    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          email,
          password, // Storing plain text password (as requested)
          name,
          role: 'super_admin', // Everyone is super admin
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, admin: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}

// DELETE - Remove admin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Authorization: only allow the owner email to delete admins
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')
    let payload: Record<string, unknown> | null = null
    try {
      const verified = await jwtVerify(token, SECRET)
      payload = verified.payload
    } catch (err) {
      console.error('JWT verification failed:', err)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const OWNER_EMAIL = 'rohanbaiju210@gmail.com'
    if (!payload?.email || payload.email !== OWNER_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json(
      { success: true, message: 'Admin deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    )
  }
}
