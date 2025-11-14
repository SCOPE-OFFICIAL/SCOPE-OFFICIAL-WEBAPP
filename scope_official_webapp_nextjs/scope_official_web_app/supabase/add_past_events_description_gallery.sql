-- Add columns to store rich description and gallery mapping for past events
-- Run this against your Supabase/Postgres database (via psql or Supabase SQL editor)

ALTER TABLE IF EXISTS public.past_events
  ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE IF EXISTS public.past_events
  ADD COLUMN IF NOT EXISTS gallery_folder text;

-- Optionally create an index on gallery_folder if you'll query by it
CREATE INDEX IF NOT EXISTS idx_past_events_gallery_folder ON public.past_events (gallery_folder);
