# 🔐 Admin Management System - Supabase Setup Guide

This guide will help you set up the admin management system in your Supabase database.

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Creating the Admins Table](#creating-the-admins-table)
3. [Setting Up Row Level Security](#setting-up-row-level-security)
4. [Adding Your First Admin](#adding-your-first-admin)
5. [Environment Variables](#environment-variables)
6. [Testing the System](#testing-the-system)

---

## 1. Database Setup

### Prerequisites
- Supabase account and project created
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file

---

## 2. Creating the Admins Table

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Following SQL

Copy and paste this SQL script to create the `admins` table:

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- Add comment to table
COMMENT ON TABLE public.admins IS 'Stores admin user accounts with their credentials';

-- Add comments to columns
COMMENT ON COLUMN public.admins.id IS 'Unique identifier for each admin';
COMMENT ON COLUMN public.admins.email IS 'Admin email address (unique)';
COMMENT ON COLUMN public.admins.password IS 'Plain text password (visible to all admins)';
COMMENT ON COLUMN public.admins.name IS 'Full name of the admin';
COMMENT ON COLUMN public.admins.role IS 'Admin role: admin or super_admin';
COMMENT ON COLUMN public.admins.created_at IS 'Timestamp when admin account was created';
COMMENT ON COLUMN public.admins.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN public.admins.updated_at IS 'Timestamp of last update';
```

### Step 3: Execute the Query
Click the **Run** button to execute the SQL script.

---

## 3. Setting Up Row Level Security (RLS)

For security, we'll enable RLS but allow service role access (which your API uses):

```sql
-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to do everything
-- (Your API uses service role key, so this allows API to manage admins)
CREATE POLICY "Allow service role full access to admins"
ON public.admins
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: If you want to allow authenticated users to read all admins
-- (useful if you implement API authentication checks)
CREATE POLICY "Allow authenticated users to read admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);
```

---

## 4. Adding Your First Admin

### Option A: Using SQL Editor (Recommended for First Admin)

```sql
-- Insert your first super admin
INSERT INTO public.admins (email, password, name, role)
VALUES (
  'your-email@scope.com',
  'your-secure-password',
  'Your Full Name',
  'super_admin'
);
```

### Option B: Using the Admin Panel UI
1. Start your Next.js application
2. Login using your environment variable credentials (ADMIN_EMAIL and ADMIN_PASSWORD)
3. Navigate to `/admin/admins`
4. Click "Add New Admin"
5. Fill in the form and submit

---

## 5. Environment Variables

Ensure your `.env.local` file has these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Fallback Admin Credentials (optional, for initial access)
ADMIN_EMAIL=admin@scope.com
ADMIN_PASSWORD=your-secure-password

# JWT Secret for authentication
NEXTAUTH_SECRET=your-random-secret-key-here
```

### Getting Your Supabase Keys:
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the **Project URL** for `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

---

## 6. Testing the System

### Test 1: Login with Environment Variable Admin
1. Go to `/admin/login`
2. Use the email and password from your `.env.local` file
3. You should be redirected to `/admin/dashboard`

### Test 2: Add a New Admin
1. Navigate to `/admin/admins`
2. Click "Add New Admin"
3. Fill in:
   - **Name**: Club Member Name
   - **Email**: member@scope.com
   - **Password**: member-password-123
   - **Role**: Admin or Super Admin
4. Click "Add Admin"

### Test 3: Login with Database Admin
1. Logout from the dashboard
2. Login with the newly created admin credentials
3. Verify you can access the admin panel

### Test 4: View All Admins
1. Go to `/admin/admins`
2. You should see all registered admins with their:
   - Name
   - Email
   - Password (visible)
   - Role
   - Created date
   - Last login

---

## 🎨 Features Implemented

### ✅ Admin Management UI
- **Modern Design**: Glassmorphism with gradient accents
- **Responsive Table**: Shows all admin details
- **Quick Actions**: Add, delete admins easily
- **Copy Buttons**: One-click copy for emails and passwords
- **Stats Dashboard**: View total admins, active today, super admins
- **Role Badges**: Visual distinction between admin and super admin

### ✅ Security Features
- **JWT Authentication**: Secure token-based login
- **Role-Based Access**: Support for admin and super_admin roles
- **Last Login Tracking**: Monitor admin activity
- **Service Role Access**: API uses secure service role key

### ✅ Database Features
- **UUID Primary Keys**: Unique identifiers for each admin
- **Email Uniqueness**: Prevents duplicate admin accounts
- **Indexed Columns**: Fast email and role lookups
- **Timestamps**: Track creation and last update
- **Row Level Security**: Protect data with RLS policies

---

## 🔒 Security Considerations

### ⚠️ Important Notes:
1. **Plain Text Passwords**: As requested, passwords are stored in plain text and visible to all admins. This is intentional for your use case but NOT recommended for production systems handling sensitive data.

2. **Service Role Key**: Never commit your `SUPABASE_SERVICE_ROLE_KEY` to version control. Keep it in `.env.local` which should be in `.gitignore`.

3. **Admin Access**: Only trusted club members should be given admin access.

4. **Environment Variables**: The fallback environment variable authentication allows you to always access the system even if the database is unavailable.

---

## 📱 Access Routes

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Admin Management**: `/admin/admins`

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch admins"
**Solution**: Check that your `SUPABASE_SERVICE_ROLE_KEY` is correctly set in `.env.local`

### Issue: "Admin with this email already exists"
**Solution**: Check the existing admins in the database or use a different email

### Issue: RLS Policy blocking access
**Solution**: Make sure you created the service role policy correctly

### Issue: Cannot login with database admin
**Solution**: 
1. Verify the admin exists in the database
2. Check the email and password are exactly correct (case-sensitive)
3. Check browser console for error messages

---

## 🎉 Next Steps

1. ✅ Create the admins table in Supabase
2. ✅ Add your first super admin
3. ✅ Login and test the system
4. ✅ Add your club members as admins
5. ✅ Share credentials with your team

---

## 📊 Database Schema Reference

```typescript
interface Admin {
  id: string              // UUID
  email: string          // Unique email address
  password: string       // Plain text password
  name: string          // Full name
  role: 'admin' | 'super_admin'  // Admin role
  created_at: string    // ISO timestamp
  last_login?: string   // ISO timestamp
  updated_at: string    // ISO timestamp
}
```

---

## 🚀 You're All Set!

Your admin management system is now fully configured. All your club members can access the admin panel with their assigned credentials, and you can manage them all from the `/admin/admins` page.

**Happy Managing! 🎊**
