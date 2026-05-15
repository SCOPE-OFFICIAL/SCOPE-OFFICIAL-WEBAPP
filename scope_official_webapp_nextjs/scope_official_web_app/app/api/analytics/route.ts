/**
 * Page Views Analytics Route (Firebase Version)
 * Converted from Supabase to Firebase Firestore
 * Tracks page views for analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page_path, page_title, referrer, session_id } = body

    const user_agent = req.headers.get('user-agent') || 'Unknown'
    const ip_address =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'Unknown'

    await addDoc(collection(db, 'page_views'), {
      page_path,
      page_title,
      referrer,
      user_agent,
      ip_address,
      session_id,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Page view tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}