-- =============================================
-- Migration: Add personality column to team_members
-- Run this in Supabase SQL editor or via psql against the database
-- =============================================

ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS personality TEXT;

COMMENT ON COLUMN public.team_members.personality IS 'Optional descriptive paragraph about the team member (displayed in Know more modal)';

-- DONE
