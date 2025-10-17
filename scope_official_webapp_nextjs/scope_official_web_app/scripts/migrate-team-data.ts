/**
 * Migration Script: Import Existing Team Members to Supabase
 * Run this once to migrate your hardcoded team data to the database
 * 
 * Usage: npm run migrate:team
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Your existing team data
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    photo_url: "/images/neha pick.jpg",
    instagram_url: "https://www.instagram.com/",
    linkedin_url: "http://www.linkedin.com/in/marisettynehasree",
    is_active: true,
    display_order: 1,
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    photo_url: "/images/brundha pick.png",
    instagram_url: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin_url: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
    is_active: true,
    display_order: 2,
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    photo_url: "/images/guraman singh pick.jpg",
    instagram_url: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin_url: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
    is_active: true,
    display_order: 3,
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    photo_url: "/images/nandana pick.jpg",
    instagram_url: "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin_url: "https://www.linkedin.com/in/nandana-rajesh-583827294",
    is_active: true,
    display_order: 4,
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    photo_url: "/images/monika pick.jpg",
    instagram_url: "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin_url: "http://linkedin.com/in/monika-s-85b275341",
    is_active: true,
    display_order: 5,
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    photo_url: "/images/pratham pick.png",
    instagram_url: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin_url: "https://linkedin.com/in/pratham21gupta",
    is_active: true,
    display_order: 6,
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    photo_url: "/images/kishor pick.jpg",
    instagram_url: "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin_url: "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
    is_active: true,
    display_order: 7,
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    photo_url: "/images/dhanya pick.jpg",
    instagram_url: "https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg==",
    linkedin_url: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
    is_active: true,
    display_order: 8,
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    photo_url: "/images/akshaya pick.jpg",
    instagram_url: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin_url: "http://www.linkedin.com/in/kadiriakshaya",
    is_active: true,
    display_order: 9,
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    photo_url: "/images/rohan biju pick.jpg",
    instagram_url: "https://www.instagram.com/",
    linkedin_url: "http://www.linkedin.com/in/rohanbaiju",
    is_active: true,
    display_order: 10,
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    photo_url: "/images/rayan .jpg",
    instagram_url: "https://www.instagram.com/",
    linkedin_url: "https://www.linkedin.com/",
    is_active: true,
    display_order: 11,
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    photo_url: "/images/ananth pick.jpg",
    instagram_url: "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin_url: "https://www.linkedin.com/in/ananthasaigudivada",
    is_active: true,
    display_order: 12,
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    photo_url: "/images/prasanna pick.jpg",
    instagram_url: "https://www.instagram.com/prasi2004/",
    linkedin_url: "https://www.linkedin.com/in/prasi2004",
    is_active: true,
    display_order: 13,
  },
  {
    role: "FACULTY COORDINATOR",
    name: "Prof. Dilip Chandra E",
    photo_url: "/images/dilip sir.jpg",
    instagram_url: "https://www.instagram.com/",
    linkedin_url: "https://www.linkedin.com/",
    is_active: true,
    display_order: 0, // First in list
  },
];

async function migrateTeamData() {
  console.log('🚀 Starting team data migration...\n')

  // Check for environment variables
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

  // Check existing members
  const { data: existingMembers, error: checkError } = await supabase
    .from('team_members')
    .select('name')

  if (checkError) {
    console.error('❌ Error checking existing members:', checkError)
    process.exit(1)
  }

  if (existingMembers && existingMembers.length > 0) {
    console.log(`⚠️  Found ${existingMembers.length} existing members in database:`)
    existingMembers.forEach(m => console.log(`   - ${m.name}`))
    console.log('\n❓ Do you want to:')
    console.log('   1. Skip migration (existing data preserved)')
    console.log('   2. Delete all and re-import (fresh start)')
    console.log('\n💡 Tip: Press Ctrl+C to cancel, or delete manually from Supabase dashboard\n')
    
    // For now, skip if data exists
    console.log('⏭️  Skipping migration - data already exists!')
    console.log('   To re-import, delete existing members from Supabase dashboard first.\n')
    return
  }

  console.log('📝 Importing team members...\n')

  let successCount = 0
  let errorCount = 0

  for (const member of teamMembers) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
      .single()

    if (error) {
      console.error(`❌ Failed to import ${member.name}:`, error.message)
      errorCount++
    } else {
      console.log(`✅ Imported: ${member.name} (${member.role})`)
      successCount++
    }
  }

  console.log(`\n📊 Migration Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📝 Total: ${teamMembers.length}\n`)

  if (successCount > 0) {
    console.log('🎉 Team data migration completed!')
    console.log('   Visit your team page to see the dynamic members!\n')
  }
}

// Run migration
migrateTeamData()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
