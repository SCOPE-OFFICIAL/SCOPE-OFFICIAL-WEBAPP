/**
 * Gallery Images Migration Script
 * Uploads existing MATLAB and ATLASSIAN gallery images to Supabase Storage
 * and creates database entries
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Gallery data with metadata
const galleryFolders = [
  {
    folderName: 'MATLAB',
    displayName: 'MATLAB Workshop',
    description: 'MATLAB Workshop - Learn, Analyze, Innovate with MATLAB workshops and training sessions',
    images: [
      { filename: 'matlab1.jpg', caption: 'MATLAB Workshop Session 1' },
      { filename: 'matlab2.jpg', caption: 'MATLAB Workshop Session 2' },
      { filename: 'matlab3.jpg', caption: 'MATLAB Workshop Session 3' },
      { filename: 'matlab4.jpg', caption: 'MATLAB Workshop Session 4' },
      { filename: 'matlab5.jpg', caption: 'MATLAB Workshop Session 5' },
    ]
  },
  {
    folderName: 'ATLASSIAN',
    displayName: 'Atlassian Workshop',
    description: 'Atlassian Workshop - Master project management and collaboration tools',
    images: [
      { filename: 'WhatsApp Image 2025-08-30 at 21.38.46_45e28e7e.jpg', caption: 'Atlassian Workshop Session 1' },
      { filename: 'WhatsApp Image 2025-08-30 at 21.38.47_700ced33.jpg', caption: 'Atlassian Workshop Session 2' },
      { filename: 'WhatsApp Image 2025-08-30 at 21.38.47_7dca8d71.jpg', caption: 'Atlassian Workshop Session 3' },
      { filename: 'WhatsApp Image 2025-08-30 at 21.38.48_3525b7ff.jpg', caption: 'Atlassian Workshop Session 4' },
    ]
  }
]

async function migrateGalleryImages() {
  console.log('🚀 Starting gallery images migration...\n')

  let totalUploaded = 0
  let totalFailed = 0

  for (const folder of galleryFolders) {
    console.log(`\n📁 Processing folder: ${folder.displayName}`)
    console.log(`   Description: ${folder.description}`)
    console.log(`   Images to upload: ${folder.images.length}\n`)

    for (let i = 0; i < folder.images.length; i++) {
      const image = folder.images[i]
      const imagePath = path.join(process.cwd(), 'public', 'images', folder.folderName, image.filename)

      console.log(`   [${i + 1}/${folder.images.length}] Uploading: ${image.filename}`)

      try {
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.log(`   ⚠️  File not found: ${imagePath}`)
          totalFailed++
          continue
        }

        // Read file
        const fileBuffer = fs.readFileSync(imagePath)
        const fileExt = path.extname(image.filename)
        const fileName = `${folder.folderName.toLowerCase()}_${i + 1}${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(`${folder.folderName.toLowerCase()}/${fileName}`, fileBuffer, {
            contentType: `image/${fileExt.slice(1)}`,
            upsert: true
          })

        if (uploadError) {
          console.log(`   ❌ Upload failed: ${uploadError.message}`)
          totalFailed++
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(`${folder.folderName.toLowerCase()}/${fileName}`)

        const publicUrl = urlData.publicUrl

        // Insert into database
        const { error: dbError } = await supabase
          .from('gallery')
          .insert({
            image_url: publicUrl,
            folder_name: folder.folderName,
            caption: image.caption,
            is_visible: true,
            display_order: i
          })

        if (dbError) {
          console.log(`   ❌ Database insert failed: ${dbError.message}`)
          totalFailed++
          continue
        }

        console.log(`   ✅ Success: ${image.caption}`)
        console.log(`      URL: ${publicUrl}`)
        totalUploaded++

      } catch (error) {
        console.log(`   ❌ Error: ${error}`)
        totalFailed++
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary:')
  console.log(`   ✅ Successfully uploaded: ${totalUploaded} images`)
  console.log(`   ❌ Failed: ${totalFailed} images`)
  console.log('='.repeat(50))
}

// Run migration
migrateGalleryImages()
  .then(() => {
    console.log('\n✨ Migration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
