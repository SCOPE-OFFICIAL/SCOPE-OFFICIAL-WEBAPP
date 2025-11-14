-- =============================================
-- Migration: Add github_url column to team_members
-- Run this in Supabase SQL editor or via psql against the database
-- =============================================

ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Optional: add a comment for clarity
COMMENT ON COLUMN public.team_members.github_url IS 'Optional GitHub profile URL for team members';

-- DONE
