/**
 * Clean Duplicate Gallery Images Script
 * Removes duplicate entries from the gallery table
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function cleanDuplicates() {
  console.log('🧹 Starting cleanup of duplicate gallery images...\n')

  try {
    // Fetch all gallery images
    const { data: images, error } = await supabase
      .from('gallery')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('❌ Error fetching images:', error.message)
      process.exit(1)
    }

    console.log(`📊 Found ${images?.length || 0} total images in database\n`)

    // Group by image_url to find duplicates
    const urlMap = new Map<string, any[]>()
    
    images?.forEach(img => {
      if (!urlMap.has(img.image_url)) {
        urlMap.set(img.image_url, [])
      }
      urlMap.get(img.image_url)!.push(img)
    })

    // Find and delete duplicates (keep the first one)
    let deletedCount = 0
    
    for (const [url, duplicates] of urlMap.entries()) {
      if (duplicates.length > 1) {
        console.log(`🔍 Found ${duplicates.length} duplicates for: ${url.split('/').pop()}`)
        
        // Keep the first one, delete the rest
        const toDelete = duplicates.slice(1)
        
        for (const dup of toDelete) {
          const { error: deleteError } = await supabase
            .from('gallery')
            .delete()
            .eq('id', dup.id)

          if (deleteError) {
            console.log(`   ❌ Failed to delete: ${deleteError.message}`)
          } else {
            console.log(`   ✅ Deleted duplicate (ID: ${dup.id})`)
            deletedCount++
          }
        }
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Cleanup Summary:')
    console.log(`   🗑️  Deleted: ${deletedCount} duplicate images`)
    console.log(`   ✅ Remaining: ${(images?.length || 0) - deletedCount} unique images`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  }
}

// Run cleanup
cleanDuplicates()
  .then(() => {
    console.log('\n✨ Cleanup completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error)
    process.exit(1)
  })
