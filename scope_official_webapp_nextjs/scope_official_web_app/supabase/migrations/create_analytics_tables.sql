-- Create page_views table for tracking website analytics
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);

-- Create API requests table for tracking API usage
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for API requests
CREATE INDEX IF NOT EXISTS idx_api_requests_created_at ON api_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_requests_endpoint ON api_requests(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_requests_status ON api_requests(status_code);

-- Create analytics_summary table for pre-computed statistics
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_page_views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  total_api_requests INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  top_pages JSONB,
  top_api_endpoints JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics_summary
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON analytics_summary(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

-- Create policies for page_views (anyone can insert, only service role can read)
CREATE POLICY "Allow public insert on page_views"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow service role to read page_views"
  ON page_views
  FOR SELECT
  TO service_role
  USING (true);

-- Create policies for api_requests (anyone can insert, only service role can read)
CREATE POLICY "Allow public insert on api_requests"
  ON api_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow service role to read api_requests"
  ON api_requests
  FOR SELECT
  TO service_role
  USING (true);

-- Create policies for analytics_summary (only service role can access)
CREATE POLICY "Allow service role full access to analytics_summary"
  ON analytics_summary
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to clean old analytics data (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM api_requests WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM analytics_summary WHERE date < CURRENT_DATE - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update analytics summary (run this daily via cron)
CREATE OR REPLACE FUNCTION update_analytics_summary()
RETURNS void AS $$
DECLARE
  summary_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  INSERT INTO analytics_summary (date, total_page_views, unique_sessions, total_api_requests, avg_response_time_ms, top_pages, top_api_endpoints)
  SELECT 
    summary_date,
    (SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = summary_date),
    (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE DATE(created_at) = summary_date),
    (SELECT COUNT(*) FROM api_requests WHERE DATE(created_at) = summary_date),
    (SELECT COALESCE(AVG(response_time_ms)::INTEGER, 0) FROM api_requests WHERE DATE(created_at) = summary_date),
    (SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
     FROM (
       SELECT page_path, COUNT(*) as views 
       FROM page_views 
       WHERE DATE(created_at) = summary_date 
       GROUP BY page_path 
       ORDER BY views DESC 
       LIMIT 10
     ) t),
    (SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
     FROM (
       SELECT endpoint, COUNT(*) as requests 
       FROM api_requests 
       WHERE DATE(created_at) = summary_date 
       GROUP BY endpoint 
       ORDER BY requests DESC 
       LIMIT 10
     ) t)
  ON CONFLICT (date) 
  DO UPDATE SET
    total_page_views = EXCLUDED.total_page_views,
    unique_sessions = EXCLUDED.unique_sessions,
    total_api_requests = EXCLUDED.total_api_requests,
    avg_response_time_ms = EXCLUDED.avg_response_time_ms,
    top_pages = EXCLUDED.top_pages,
    top_api_endpoints = EXCLUDED.top_api_endpoints,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
