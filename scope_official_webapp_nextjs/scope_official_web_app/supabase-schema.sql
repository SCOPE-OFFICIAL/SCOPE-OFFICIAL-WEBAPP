-- =============================================
-- SCOPE WEBAPP DATABASE SCHEMA
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255),
  image_url TEXT,
  registration_link TEXT,
  event_type VARCHAR(50) DEFAULT 'other' CHECK (event_type IN ('workshop', 'hackathon', 'webinar', 'competition', 'meetup', 'other')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_events_date ON events(event_date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured);

-- =============================================
-- GALLERY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  folder_name VARCHAR(100) NOT NULL,
  caption TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_gallery_folder ON gallery(folder_name);
CREATE INDEX idx_gallery_order ON gallery(display_order);

-- =============================================
-- TEAM MEMBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  photo_url TEXT,
  bio TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  email VARCHAR(255),
  year VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_active ON team_members(is_active);
CREATE INDEX idx_team_order ON team_members(display_order);

-- =============================================
-- FAQ TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_faq_category ON faq(category);
CREATE INDEX idx_faq_order ON faq(display_order);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read visible gallery images"
  ON gallery FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can read active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read visible FAQs"
  ON faq FOR SELECT
  USING (is_visible = true);

-- Admin full access (we'll add auth later)
-- For now, allow all operations with service role key
CREATE POLICY "Service role can do everything on events"
  ON events FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on gallery"
  ON gallery FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on team_members"
  ON team_members FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on faq"
  ON faq FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample Events
INSERT INTO events (title, description, short_description, event_date, event_time, event_type, status, is_featured) VALUES
  ('Orientation on Matlab', 'Comprehensive introduction to MATLAB programming and its applications in engineering projects', 'Learn MATLAB basics and advanced features', '2025-08-15', '14:00:00', 'workshop', 'published', true),
  ('Hackathon 2025', 'Annual 24-hour hackathon with exciting prizes and challenges', '24-hour coding marathon', '2025-08-28', '10:00:00', 'hackathon', 'published', true),
  ('ARM Architecture Workshop', 'Deep dive into ARM processor architecture and embedded systems', 'ARM processor fundamentals', '2025-09-10', '15:00:00', 'workshop', 'published', false),
  ('Empower Talk', 'Inspirational talk by industry experts on career development', 'Career guidance session', '2025-09-05', '16:00:00', 'meetup', 'published', false),
  ('Current Basics Workshop', 'Fundamentals of current, voltage, and basic electronics', 'Electronics fundamentals', '2025-09-12', '14:30:00', 'workshop', 'published', false);

-- Sample FAQ
INSERT INTO faq (question, answer, category, display_order, is_visible) VALUES
  ('What is SCOPE?', 'SCOPE (Society of Core Oriented Projects) is a student-led technical club focused on electronics and circuit design.', 'general', 1, true),
  ('How can I join SCOPE?', 'You can join SCOPE by attending our orientation sessions or contacting any team member. Membership is open to all students interested in electronics.', 'membership', 2, true),
  ('Do I need prior experience?', 'No prior experience is necessary! We welcome students of all skill levels and provide workshops to help beginners get started.', 'membership', 3, true),
  ('What kind of events does SCOPE organize?', 'We organize workshops, hackathons, webinars, competitions, and tech talks on various topics related to electronics and embedded systems.', 'events', 4, true);

-- =============================================
-- STORAGE BUCKETS (Run separately in Storage UI)
-- =============================================
-- Create these buckets in Supabase Dashboard > Storage:
-- 1. event-images (public)
-- 2. gallery-images (public)
-- 3. team-photos (public)
-- 
-- Or run via SQL if you have permissions:
-- insert into storage.buckets (id, name, public) values ('event-images', 'event-images', true);
-- insert into storage.buckets (id, name, public) values ('gallery-images', 'gallery-images', true);
-- insert into storage.buckets (id, name, public) values ('team-photos', 'team-photos', true);

-- =============================================
-- DONE! Your database is ready.
-- =============================================
