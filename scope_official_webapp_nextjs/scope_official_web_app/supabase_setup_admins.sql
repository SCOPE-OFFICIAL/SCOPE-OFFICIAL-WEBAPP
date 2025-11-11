-- ============================================
-- SCOPE Admin Management System
-- Supabase Database Setup Script
-- ============================================
-- 
-- Instructions:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Create a new query
-- 4. Copy and paste this entire script
-- 5. Click Run
-- 6. Replace the email/password in the INSERT statement with your details
-- ============================================

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'super_admin' CHECK (role IN ('super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- Add table and column comments
COMMENT ON TABLE public.admins IS 'Stores admin user accounts with their credentials';
COMMENT ON COLUMN public.admins.id IS 'Unique identifier for each admin';
COMMENT ON COLUMN public.admins.email IS 'Admin email address (unique)';
COMMENT ON COLUMN public.admins.password IS 'Plain text password (visible to all admins)';
COMMENT ON COLUMN public.admins.name IS 'Full name of the admin';
COMMENT ON COLUMN public.admins.role IS 'Admin role: super_admin (all members are super admins)';
COMMENT ON COLUMN public.admins.created_at IS 'Timestamp when admin account was created';
COMMENT ON COLUMN public.admins.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN public.admins.updated_at IS 'Timestamp of last update';

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Allow service role full access to admins" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;

-- Create policy to allow service role full access
-- (Your API uses service role key, so this allows API to manage admins)
CREATE POLICY "Allow service role full access to admins"
ON public.admins
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Allow authenticated users to read admins
CREATE POLICY "Allow authenticated users to read admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- Insert your first super admin
-- ⚠️ IMPORTANT: Replace these values with your actual details!
-- ============================================

INSERT INTO public.admins (email, password, name, role)
VALUES (
  'admin@scope.com',              -- 👈 CHANGE THIS to your email
  'your-secure-password-here',    -- 👈 CHANGE THIS to your password
  'Your Full Name',               -- 👈 CHANGE THIS to your name
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;  -- Prevents duplicate if run multiple times

-- ============================================
-- Verify the setup
-- ============================================

-- Check if the table was created successfully
SELECT 
  table_name, 
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'admins';

-- View all admins (should show the admin you just created)
SELECT 
  id,
  email,
  name,
  role,
  created_at,
  last_login
FROM public.admins
ORDER BY created_at DESC;

-- Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'admins'
  AND schemaname = 'public';

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'admins';

-- ============================================
-- Success! 🎉
-- ============================================
-- Your admins table is now set up and ready to use!
-- 
-- Next steps:
-- 1. Update your .env.local file with Supabase credentials
-- 2. Start your Next.js application
-- 3. Login with your admin credentials
-- 4. Navigate to /admin/admins to add more admins
-- ============================================
