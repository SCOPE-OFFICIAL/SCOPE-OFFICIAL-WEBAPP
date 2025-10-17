# 🚀 SCOPE WEBAPP - Complete Setup Guide

## 📝 STEP-BY-STEP INSTRUCTIONS

### ✅ Step 1: Dependencies Installed
Already done! ✓

---

### 🔹 Step 2: Set Up Supabase (DO THIS NOW!)

#### 2.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub/Google/Email

#### 2.2 Create New Project
1. Click "New Project"
2. Fill in:
   - **Organization**: Create new (e.g., "SCOPE-Club")
   - **Name**: `scope-webapp`
   - **Database Password**: Create strong password (SAVE THIS!)
   - **Region**: Select "Southeast Asia (Singapore)" or closest
   - **Pricing Plan**: Free
3. Click "Create new project"
4. **Wait 2-3 minutes** for setup to complete

#### 2.3 Get API Keys
1. In your project, go to **Settings** (⚙️ icon in sidebar)
2. Click **API** section
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (starts with `eyJ...`)
     - `service_role` `secret` key (KEEP PRIVATE!)

#### 2.4 Add Keys to .env.local
1. Open `.env.local` file in your project
2. Replace these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_long_key_here
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_key_here
   ```

#### 2.5 Generate NextAuth Secret
1. Open PowerShell/Terminal
2. Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Copy the output
4. Paste in `.env.local`:
   ```
   NEXTAUTH_SECRET=<paste_here>
   ```

---

### 🗄️ Step 3: Create Database Tables

#### 3.1 Run SQL Script
1. In Supabase Dashboard, go to **SQL Editor** (lightning icon ⚡)
2. Click **"New query"**
3. Open `supabase-schema.sql` file in your project
4. **Copy ALL the SQL** from that file
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

#### 3.2 Verify Tables Created
1. Go to **Table Editor** (📋 icon)
2. You should see 4 tables:
   - `events`
   - `gallery`
   - `team_members`
   - `faq`

---

### 📦 Step 4: Create Storage Buckets

#### 4.1 Create Buckets for Images
1. Go to **Storage** (📦 icon) in Supabase
2. Click **"New bucket"**
3. Create 3 buckets (one by one):

**Bucket 1: event-images**
- Name: `event-images`
- Public: ✅ YES
- File size limit: 5MB
- Allowed MIME types: `image/*`
- Click Create

**Bucket 2: gallery-images**
- Name: `gallery-images`
- Public: ✅ YES
- File size limit: 5MB
- Allowed MIME types: `image/*`
- Click Create

**Bucket 3: team-photos**
- Name: `team-photos`
- Public: ✅ YES
- File size limit: 5MB
- Allowed MIME types: `image/*`
- Click Create

#### 4.2 Set Storage Policies
For each bucket:
1. Click the bucket name
2. Go to **Policies** tab
3. Click **"New policy"**
4. Choose **"For full customization"**
5. Add two policies:

**Policy 1: Public Read**
```sql
Policy name: Public Read
Allowed operation: SELECT
Target roles: public
WITH CHECK expression: true
```

**Policy 2: Authenticated Upload**
```sql
Policy name: Authenticated Upload
Allowed operation: INSERT
Target roles: authenticated
WITH CHECK expression: true
```

---

### ✅ Step 5: Verify Setup

#### Test Database Connection
1. In Supabase, go to **Table Editor**
2. Click `events` table
3. You should see 5 sample events
4. Click `faq` table
5. You should see 4 sample FAQs

#### Check API Keys
1. Make sure `.env.local` has all values filled
2. NO placeholders like "your_key_here"
3. Save the file

---

### 🎉 Step 6: Ready to Code!

Once you've completed Steps 2-5, tell me:
**"Supabase setup complete!"**

Then I'll continue with:
- Creating API routes
- Building the admin panel
- Making events page dynamic
- Image upload functionality

---

## 🆘 TROUBLESHOOTING

### Issue: Can't find API keys
- Go to Settings → API in Supabase
- Keys are in the "Project API keys" section

### Issue: SQL script fails
- Make sure you copied the ENTIRE script
- Run it all at once, not line by line

### Issue: Storage buckets not working
- Make sure they're set to PUBLIC
- Check that policies are added

### Issue: .env.local not working
- Restart your dev server after adding keys
- Make sure file is named exactly `.env.local`
- File should be in root of `scope_official_web_app` folder

---

## 📧 Need Help?
Stuck? Let me know which step you're on and what error you're seeing!
