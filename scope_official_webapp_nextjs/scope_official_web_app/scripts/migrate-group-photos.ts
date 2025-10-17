/**
 * Migration Script: Upload Existing Group Photos to Supabase
 * Uploads team group photos and adds them to the database
 * 
 * Usage: npm run migrate:photos
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

// Group photos to migrate (based on your screenshot)
const groupPhotos = [
  {
    localPath: '/images/TEAM_Mem/tech_team.jpeg',
    title: 'Technical Team',
    description: 'Our talented technical team members',
    category: 'technical',
    display_order: 1
  },
  {
    localPath: '/images/TEAM_Mem/Design_team.jpeg',
    title: 'Design Team',
    description: 'Creative minds behind SCOPE\'s visual identity',
    category: 'design',
    display_order: 2
  },
  {
    localPath: '/images/TEAM_Mem/events_team.jpeg',
    title: 'Events Team',
    description: 'Organizing amazing events and experiences',
    category: 'events',
    display_order: 3
  },
  {
    localPath: '/images/TEAM_Mem/pr_team.jpeg',
    title: 'PR Team',
    description: 'Managing public relations and communications',
    category: 'pr',
    display_order: 4
  },
  {
    localPath: '/images/TEAM_Mem/student_cordinator.jpeg',
    title: 'Student Coordinator',
    description: 'Student coordinators leading the way',
    category: 'coordinators',
    display_order: 5
  },
  {
    localPath: '/images/TEAM_Mem/team_leads.jpeg',
    title: 'Team Leads',
    description: 'Leadership team guiding SCOPE',
    category: 'leadership',
    display_order: 6
  }
]

const BUCKET_NAME = 'team-photos'

async function migrateGroupPhotos() {
  console.log('🚀 Starting group photos migration to Supabase...\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing environment variables!')
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
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`)
    await supabase.storage.createBucket(BUCKET_NAME, { public: true })
    console.log('✅ Bucket created\n')
  }

  let uploadCount = 0
  let dbCount = 0
  let errorCount = 0
  const publicDir = resolve(process.cwd(), 'public')

  console.log('📸 Processing group photos...\n')

  for (const photo of groupPhotos) {
    try {
      const filePath = join(publicDir, photo.localPath.replace('/images/', 'images/'))
      
      console.log(`📤 Processing: ${photo.title}`)
      console.log(`   Local: ${photo.localPath}`)

      // Check if file exists
      if (!statSync(filePath, { throwIfNoEntry: false })) {
        console.log(`   ⚠️  File not found, skipping...\n`)
        errorCount++
        continue
      }

      // Read file
      const fileBuffer = readFileSync(filePath)
      const fileName = photo.localPath.split('/').pop() || 'unknown.jpg'
      const fileExt = fileName.split('.').pop()
      
      // Create clean filename
      const cleanName = photo.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
      const storagePath = `groups/${cleanName}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
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

      // Insert into database
      const { error: dbError } = await supabase
        .from('group_photos')
        .insert([{
          title: photo.title,
          description: photo.description,
          image_url: publicUrl,
          category: photo.category,
          is_visible: true,
          display_order: photo.display_order
        }])

      if (dbError) {
        console.log(`   ⚠️  Database insert failed: ${dbError.message}`)
      } else {
        console.log(`   ✅ Added to database`)
        dbCount++
      }

      console.log('')

    } catch (error) {
      console.error(`   ❌ Error processing ${photo.title}:`, error)
      console.log('')
      errorCount++
    }
  }

  console.log('\n📊 Migration Summary:')
  console.log(`   📤 Uploaded: ${uploadCount}`)
  console.log(`   💾 Database Entries: ${dbCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📝 Total: ${groupPhotos.length}\n`)

  if (uploadCount > 0) {
    console.log('🎉 Group photos migrated successfully!')
    console.log('   Photos are now in Supabase Storage!')
    console.log('   Go to Admin Panel > Team > Group Photos to tag members!\n')
  }
}

// Run migration
migrateGroupPhotos()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
