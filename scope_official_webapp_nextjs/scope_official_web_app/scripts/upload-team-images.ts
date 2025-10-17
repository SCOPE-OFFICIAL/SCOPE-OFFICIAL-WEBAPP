/**
 * Bulk Upload Script: Upload Team Images to Supabase Storage
 * This script uploads all team member photos to Supabase and updates database URLs
 * 
 * Usage: npm run upload:images
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

// Team member photo mappings (local path -> member name)
const photoMappings = [
  { localPath: '/images/neha pick.jpg', memberName: 'Marisetty Nehasree' },
  { localPath: '/images/brundha pick.png', memberName: 'Brunda R' },
  { localPath: '/images/guraman singh pick.jpg', memberName: 'Guraman Singh' },
  { localPath: '/images/nandana pick.jpg', memberName: 'Nandana Rajesh' },
  { localPath: '/images/monika pick.jpg', memberName: 'Monika S' },
  { localPath: '/images/pratham pick.png', memberName: 'Pratham Gupta' },
  { localPath: '/images/kishor pick.jpg', memberName: 'Kishore' },
  { localPath: '/images/dhanya pick.jpg', memberName: 'Dhanya Karnam' },
  { localPath: '/images/akshaya pick.jpg', memberName: 'Kadiri Akshaya' },
  { localPath: '/images/rohan biju pick.jpg', memberName: 'Rohan Baiju' },
  { localPath: '/images/rayan .jpg', memberName: 'Rayyan Ahamed' },
  { localPath: '/images/ananth pick.jpg', memberName: 'Ananta Sai Gudivada' },
  { localPath: '/images/prasanna pick.jpg', memberName: 'Prasanna Kumaran' },
  { localPath: '/images/dilip sir.jpg', memberName: 'Prof. Dilip Chandra E' },
]

const BUCKET_NAME = 'team-photos'

async function uploadTeamImages() {
  console.log('🚀 Starting bulk image upload to Supabase Storage...\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing environment variables!')
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('✅ Connected to Supabase\n')

  // Check if bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
  
  if (bucketError) {
    console.error('❌ Error checking buckets:', bucketError)
    process.exit(1)
  }

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`)
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError)
      process.exit(1)
    }
    console.log('✅ Bucket created successfully\n')
  } else {
    console.log(`✅ Bucket '${BUCKET_NAME}' already exists\n`)
  }

  let uploadCount = 0
  let updateCount = 0
  let errorCount = 0

  console.log('📸 Uploading images...\n')

  for (const mapping of photoMappings) {
    try {
      // Convert local path to file system path
      const publicDir = resolve(process.cwd(), 'public')
      const filePath = join(publicDir, mapping.localPath.replace('/images/', 'images/'))
      
      console.log(`📤 Processing: ${mapping.memberName}`)
      console.log(`   Local: ${mapping.localPath}`)

      // Check if file exists
      if (!statSync(filePath, { throwIfNoEntry: false })) {
        console.log(`   ⚠️  File not found, skipping...\n`)
        errorCount++
        continue
      }

      // Read file
      const fileBuffer = readFileSync(filePath)
      const fileName = mapping.localPath.split('/').pop() || 'unknown.jpg'
      const fileExt = fileName.split('.').pop()
      
      // Create clean filename (member name + timestamp + extension)
      const cleanName = mapping.memberName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
      const storagePath = `${cleanName}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
          upsert: false
        })

      if (uploadError) {
        console.log(`   ❌ Upload failed: ${uploadError.message}\n`)
        errorCount++
        continue
      }

      console.log(`   ✅ Uploaded to: ${storagePath}`)
      uploadCount++

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath)

      const publicUrl = urlData.publicUrl

      console.log(`   🔗 URL: ${publicUrl}`)

      // Update database with new URL
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ photo_url: publicUrl })
        .eq('name', mapping.memberName)

      if (updateError) {
        console.log(`   ⚠️  Database update failed: ${updateError.message}`)
      } else {
        console.log(`   ✅ Database updated`)
        updateCount++
      }

      console.log('')

    } catch (error) {
      console.error(`   ❌ Error processing ${mapping.memberName}:`, error)
      console.log('')
      errorCount++
    }
  }

  console.log('\n📊 Upload Summary:')
  console.log(`   📤 Uploaded: ${uploadCount}`)
  console.log(`   💾 Database Updated: ${updateCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📝 Total: ${photoMappings.length}\n`)

  if (uploadCount > 0) {
    console.log('🎉 Team images uploaded successfully!')
    console.log('   All photos are now hosted on Supabase Storage!')
    console.log('   Refresh your team page to see cloud-hosted images!\n')
  }
}

// Run upload
uploadTeamImages()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Upload failed:', error)
    process.exit(1)
  })
