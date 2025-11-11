/**
 * Admin Authentication API
 * Validates credentials against database ONLY
 */

import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createClient } from '@supabase/supabase-js'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Authenticate from database ONLY
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (admin && !error) {
      // Update last login timestamp
      await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id)

      // Generate JWT token
      const token = await new SignJWT({ email, role: admin.role, name: admin.name })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token expires in 7 days
        .sign(SECRET)

      return NextResponse.json({
        success: true,
        token,
        user: { email, role: admin.role, name: admin.name }
      }, { status: 200 })
    }

    // No fallback - database only!
    return NextResponse.json({
      success: false,
      error: 'Invalid email or password'
    }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 })
  }
}
