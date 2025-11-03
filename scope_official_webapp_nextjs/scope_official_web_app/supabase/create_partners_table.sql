-- Supabase SQL: create partners table
-- Run this in Supabase SQL editor or psql against your database

-- Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  link text,
  visible boolean NOT NULL DEFAULT TRUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.partners;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Optional: sample seed data
INSERT INTO public.partners (name, image_url, link, visible, sort_order) VALUES
('Example Partner A', '/images/partners/example-a.png', 'https://example.com/a', true, 10),
('Example Partner B', '/images/partners/example-b.png', 'https://example.com/b', true, 20),
('Hidden Sponsor', '/images/partners/hidden.png', 'https://sponsor.com', false, 30)
ON CONFLICT DO NOTHING;

-- Grant select to anon role for public reads (Supabase typically sets this in policies)
-- Note: Use RLS policies for fine-grained control instead of blanket grants in production

-- End of script
