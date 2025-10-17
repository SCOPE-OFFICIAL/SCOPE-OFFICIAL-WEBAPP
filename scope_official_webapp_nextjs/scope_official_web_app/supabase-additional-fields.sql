-- =============================================
-- ADD NEW FIELDS TO EVENTS TABLE
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- Add speaker column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS speaker VARCHAR(255);

-- Add registration_fee column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS registration_fee VARCHAR(100);

-- Add banner_image_url column (separate from main image)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Add poster_image_url column (for detailed poster)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS poster_image_url TEXT;

-- Add what_to_expect column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS what_to_expect TEXT;

-- Add what_you_get column  
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS what_you_get TEXT;

-- Create comment to document the changes
COMMENT ON COLUMN events.speaker IS 'Name of the event speaker/host';
COMMENT ON COLUMN events.registration_fee IS 'Registration fee (e.g., "FREE", "$10", "₹500")';
COMMENT ON COLUMN events.banner_image_url IS 'Small banner image for event card header';
COMMENT ON COLUMN events.poster_image_url IS 'Full poster image for detailed view';
COMMENT ON COLUMN events.what_to_expect IS 'Description of what attendees can expect';
COMMENT ON COLUMN events.what_you_get IS 'Benefits/takeaways from the event';

-- =============================================
-- DONE! New fields added to events table
-- =============================================
