-- =============================================
-- ADDITIONAL TABLES FOR ADVANCED FEATURES
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- =============================================
-- GROUP PHOTOS TABLE (Team photos with multiple people)
-- =============================================
CREATE TABLE IF NOT EXISTS group_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'team', -- team, social-relations, events, etc.
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- =============================================
-- PHOTO TAGS TABLE (Individual people tagged in group photos)
-- =============================================
CREATE TABLE IF NOT EXISTS photo_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES group_photos(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  person_name VARCHAR(255) NOT NULL,
  position_x DECIMAL(5,2) NOT NULL, -- X coordinate (0-100%)
  position_y DECIMAL(5,2) NOT NULL, -- Y coordinate (0-100%)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER SUBMITTED QUESTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  question TEXT NOT NULL,
  answer TEXT,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'archived')),
  is_public BOOLEAN DEFAULT FALSE, -- Show in public FAQ when answered
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  answered_by VARCHAR(255)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_group_photos_category ON group_photos(category);
CREATE INDEX idx_group_photos_visible ON group_photos(is_visible);
CREATE INDEX idx_photo_tags_photo ON photo_tags(photo_id);
CREATE INDEX idx_photo_tags_member ON photo_tags(team_member_id);
CREATE INDEX idx_user_questions_status ON user_questions(status);
CREATE INDEX idx_user_questions_public ON user_questions(is_public);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE group_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_questions ENABLE ROW LEVEL SECURITY;

-- Public can read visible group photos
CREATE POLICY "Public can read visible group photos"
  ON group_photos FOR SELECT
  USING (is_visible = true);

-- Public can read photo tags for visible photos
CREATE POLICY "Public can read photo tags"
  ON photo_tags FOR SELECT
  USING (true);

-- Public can submit questions
CREATE POLICY "Anyone can submit questions"
  ON user_questions FOR INSERT
  WITH CHECK (true);

-- Public can read answered public questions
CREATE POLICY "Public can read public FAQs"
  ON user_questions FOR SELECT
  USING (is_public = true AND status = 'answered');

-- Service role can do everything
CREATE POLICY "Service role can manage group photos"
  ON group_photos FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage photo tags"
  ON photo_tags FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage user questions"
  ON user_questions FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Sample user questions
INSERT INTO user_questions (user_name, user_email, question, status) VALUES
  ('John Doe', 'john@example.com', 'How can I join SCOPE club?', 'pending'),
  ('Jane Smith', 'jane@example.com', 'What are the membership fees?', 'pending'),
  ('Mike Johnson', 'mike@example.com', 'When is the next workshop?', 'pending');

-- =============================================
-- DONE!
-- =============================================
