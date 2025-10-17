/**
 * Simple Admin Authentication API
 * Validates credentials against environment variables
 */

import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@scope.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'change_this_password_123'

    if (email === adminEmail && password === adminPassword) {
      // Generate JWT token
      const token = await new SignJWT({ email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token expires in 7 days
        .sign(SECRET)

      return NextResponse.json({
        success: true,
        token,
        user: { email, role: 'admin' }
      }, { status: 200 })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 })
  }
}
