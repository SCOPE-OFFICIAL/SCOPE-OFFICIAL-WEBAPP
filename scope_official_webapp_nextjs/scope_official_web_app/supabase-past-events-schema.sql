-- =============================================
-- PAST EVENTS TABLE FOR SCOPE WEBAPP
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PAST EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS past_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name VARCHAR(255) NOT NULL,
  poster_image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_past_events_order ON past_events(display_order);
CREATE INDEX idx_past_events_visible ON past_events(is_visible);
CREATE INDEX idx_past_events_created ON past_events(created_at DESC);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_past_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_past_events_updated_at
  BEFORE UPDATE ON past_events
  FOR EACH ROW
  EXECUTE FUNCTION update_past_events_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;

-- Public read access for visible past events
CREATE POLICY "Public can read visible past events"
  ON past_events FOR SELECT
  USING (is_visible = true);

-- Admin full access (service role)
CREATE POLICY "Service role can do everything on past_events"
  ON past_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- INSERT SAMPLE DATA (OPTIONAL)
-- =============================================

INSERT INTO past_events (event_name, poster_image_url, display_order, is_visible) VALUES
  ('Past Event 1', '/images/past-event-1.jpg', 1, true),
  ('MATLAB Workshop', '/images/past-event-2-matlab.jpg', 2, true),
  ('Tech Talk Series', '/images/past-event-3-tech.jpg', 3, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- STORAGE BUCKET FOR PAST EVENT POSTERS
-- =============================================
-- Create this bucket in Supabase Dashboard > Storage:
-- Bucket name: past-event-posters (public)
-- 
-- Or run via SQL if you have permissions:
-- insert into storage.buckets (id, name, public) values ('past-event-posters', 'past-event-posters', true);

-- =============================================
-- DONE! Past events table is ready.
-- =============================================
