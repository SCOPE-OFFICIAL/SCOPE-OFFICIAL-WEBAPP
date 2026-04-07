/**
 * API Request Analytics Route (Firebase Version)
 * Converted from Supabase to Firebase Firestore
 * Tracks API requests for analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { endpoint, method, status_code, response_time_ms } = body

    const user_agent = req.headers.get('user-agent') || 'Unknown'
    const ip_address =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'Unknown'

    await addDoc(collection(db, 'api_requests'), {
      endpoint,
      method,
      status_code,
      response_time_ms,
      user_agent,
      ip_address,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API request tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}