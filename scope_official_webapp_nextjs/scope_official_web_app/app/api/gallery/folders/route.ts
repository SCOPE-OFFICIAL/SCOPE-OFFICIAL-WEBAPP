/**
 * Gallery Folders API Route (Firebase Version)
 * Converted from Supabase to Firebase Firestore
 * Returns distinct folder names for typeahead dropdown
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

// GET - Return distinct gallery folder names
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const visible = searchParams.get('visible')

    const snapshot = await getDocs(collection(db, 'gallery'))

    let docs = snapshot.docs.map(docSnap => docSnap.data()) as any[]

    if (visible === 'true') {
      docs = docs.filter(d => d.is_visible === true)
    }

    // Extract unique, non-empty folder names, sorted alphabetically
    const folders = Array.from(
      new Set(
        docs
          .map(d => (d.folder_name ? String(d.folder_name).trim() : ''))
          .filter(n => n.length > 0)
      )
    ).sort()

    return NextResponse.json({ folders }, { status: 200 })
  } catch (error) {
    console.error('Error in folders GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}