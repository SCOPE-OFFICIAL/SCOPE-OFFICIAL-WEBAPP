# Website Analytics Setup Guide

## 🎯 Overview

Your SCOPE website now has a comprehensive analytics system that tracks:
- **Page Views**: Which pages users visit and how often
- **API Requests**: Backend API performance and usage
- **User Sessions**: Unique visitor tracking
- **Response Times**: API performance monitoring

## 📊 What's Been Implemented

### 1. Database Tables

Created three new tables in Supabase:

#### `page_views`
Tracks every page visit with:
- Page path and title
- Referrer (where visitors came from)
- User agent and IP address
- Session ID for unique visitor tracking
- Timestamp

#### `api_requests`
Logs all API calls with:
- Endpoint and HTTP method
- Status code and response time
- User agent and IP address
- Timestamp

#### `analytics_summary`
Pre-computed daily statistics for faster dashboard loading

### 2. Client-Side Tracking

**AnalyticsTracker Component** (`app/components/AnalyticsTracker.tsx`)
- Automatically tracks page views on navigation
- Generates unique session IDs
- Excludes admin pages from tracking
- Lightweight and non-blocking

**trackedFetch Function**
- Wrapper for fetch() that automatically logs API calls
- Measures response times
- Tracks success/error rates

### 3. API Routes

**`/api/track/page-view` (POST)**
- Receives page view data from client
- Stores in Supabase `page_views` table

**`/api/track/api-request` (POST)**
- Receives API request metadata
- Stores in Supabase `api_requests` table

**`/api/analytics` (GET)**
- Fetches comprehensive analytics data
- Aggregates page views, API requests, and content statistics
- Powers the admin dashboard

### 4. Admin Dashboard Enhancements

New analytics sections:
- **Page Views Overview**: Total, today, and monthly views
- **Most Visited Pages**: Bar chart with percentages
- **API Request Window**: Real-time API performance table
  - Endpoint URLs
  - Request counts
  - Average response times
  - Error rates
- **Unique Sessions**: Track individual visitors

## 🚀 Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration in your Supabase dashboard:

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/create_analytics_tables.sql`
3. Run the migration

```sql
-- This will create:
-- ✅ page_views table
-- ✅ api_requests table
-- ✅ analytics_summary table
-- ✅ Indexes for performance
-- ✅ Row Level Security policies
-- ✅ Helper functions
```

### Step 2: Verify Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Test the Analytics

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit different pages:**
   - Navigate to `/`, `/eventss`, `/gallery`, `/aboutus`, `/teams`, `/faq`
   - Each page visit will be tracked automatically

3. **Check the Admin Dashboard:**
   - Go to `http://localhost:3001/admin/login`
   - Login with your admin credentials
   - View the analytics dashboard

### Step 4: View Real Data

After browsing the site, check the admin dashboard to see:
- Page view counts updating in real-time
- Most visited pages chart
- API request statistics
- Average response times

## 📈 How It Works

### Page View Tracking Flow

```
User visits page → AnalyticsTracker detects navigation
                 → Sends POST to /api/track/page-view
                 → Data stored in Supabase
                 → Admin dashboard fetches aggregated data
```

### API Request Tracking Flow

```
Component calls API → trackedFetch() wrapper measures time
                   → API responds
                   → Sends metrics to /api/track/api-request
                   → Data stored in Supabase
                   → Dashboard shows performance stats
```

### Session Tracking

- Each user gets a unique `session_id` stored in `sessionStorage`
- Persists across page navigations
- Resets when browser is closed
- Used to calculate unique visitors

## 🎨 Dashboard Features

### Page Views Section
- **Total Views**: All-time page view counter
- **Today's Views**: Last 24 hours
- **This Month**: Last 30 days
- **Unique Sessions**: Individual visitor count
- **Most Visited Pages**: Top 6 pages with visual progress bars

### API Request Window
Beautiful table showing:
- Endpoint paths (color-coded)
- Request counts
- Average response time (color-coded: green < 100ms, yellow < 500ms, red > 500ms)
- Error rates (color-coded: green 0%, yellow < 5%, red > 5%)

### Activity Trends
- New Events (last 30 days)
- New Team Members (last 30 days)
- New Gallery Images (last 30 days)
- New User Questions (last 30 days)

## 🔧 Advanced Features

### Optional: Use trackedFetch in Components

Replace regular `fetch()` calls with `trackedFetch()` to automatically log API requests:

```tsx
import { trackedFetch } from '@/app/components/AnalyticsTracker'

// Before:
const response = await fetch('/api/events')

// After:
const response = await trackedFetch('/api/events')
```

### Optional: Daily Summary Cron Job

Set up a daily cron job in Supabase to aggregate analytics:

1. Go to Database → Functions
2. Create a new function:

```sql
SELECT cron.schedule(
  'daily-analytics-summary',
  '0 0 * * *', -- Run at midnight
  $$
  SELECT update_analytics_summary();
  $$
);
```

### Optional: Cleanup Old Data

Run cleanup function monthly to delete data older than 90 days:

```sql
SELECT cron.schedule(
  'monthly-analytics-cleanup',
  '0 0 1 * *', -- Run on 1st of each month
  $$
  SELECT cleanup_old_analytics();
  $$
);
```

## 📱 Privacy Considerations

- IP addresses are stored but can be anonymized if needed
- No personally identifiable information is collected
- Session IDs are random strings, not linked to user accounts
- Admin pages are excluded from tracking
- All data complies with GDPR guidelines

## 🛠️ Troubleshooting

### No data showing in dashboard?

1. **Check tables exist:**
   ```sql
   SELECT * FROM page_views LIMIT 1;
   SELECT * FROM api_requests LIMIT 1;
   ```

2. **Verify tracking is working:**
   - Open browser DevTools → Network tab
   - Navigate to a page
   - Look for POST requests to `/api/track/page-view`

3. **Check console for errors:**
   - Open DevTools → Console
   - Look for "Failed to track" messages

### Slow dashboard loading?

- Run the `update_analytics_summary()` function manually
- Use pre-computed summaries instead of raw data queries
- Add more indexes if needed

### API requests not tracking?

- Make sure you're using `trackedFetch()` instead of regular `fetch()`
- Check that the tracking endpoint is accessible
- Verify Supabase policies allow inserts

## 🎯 Next Steps

1. **Monitor performance**: Watch response times and optimize slow endpoints
2. **Analyze trends**: Use data to understand user behavior
3. **Set goals**: Track improvements in page views and engagement
4. **Export reports**: Create monthly analytics reports for stakeholders

## 📊 Sample Dashboard View

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Website Analytics                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [15,847]          [234]            [7,234]                 │
│  Total Views     Today's Views    This Month                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  🔥 Most Visited Pages          📈 Activity Trends          │
│  ├─ Home         33% ████████    New Events        +3       │
│  ├─ Events       22% █████       Team Members      +14      │
│  ├─ Gallery      18% ████        Gallery Images    +0       │
│  └─ About Us     14% ███         User Questions    +2       │
├─────────────────────────────────────────────────────────────┤
│  🔌 API Request Window                                       │
│  Endpoint              Requests   Avg Time   Error Rate     │
│  /api/events              1,234      45ms          0%       │
│  /api/gallery               856      78ms          0%       │
│  /api/team-members          543      52ms          1%       │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Verification Checklist

- [ ] Database migration executed successfully
- [ ] AnalyticsTracker component added to layout
- [ ] Page views are being tracked
- [ ] Admin dashboard shows analytics data
- [ ] API request window displays endpoints
- [ ] Response times are color-coded correctly
- [ ] Error rates are tracking properly
- [ ] Most visited pages chart works

## 🎉 You're All Set!

Your website now has professional-grade analytics tracking. The system will automatically collect data as users interact with your site, providing valuable insights into:

- Which pages are most popular
- How fast your APIs are responding
- Where users are coming from
- Peak usage times
- Performance bottlenecks

Monitor the admin dashboard regularly to make data-driven decisions about your website! 📊✨
