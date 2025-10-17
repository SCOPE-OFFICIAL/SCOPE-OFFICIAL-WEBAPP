# Past Events Integration Guide

## 🎉 What's New

The Past Events section has been fully integrated with the Admin Panel! You can now manage past event posters directly from the admin interface.

## 📁 Files Created/Modified

### New Files:
1. **`supabase-past-events-schema.sql`** - Database schema for past events table
2. **`app/api/past-events/route.ts`** - API endpoints for past events CRUD operations
3. **`app/admin/events/past/new/page.tsx`** - Form to add new past event posters
4. **`app/admin/events/past/edit/[id]/page.tsx`** - Form to edit existing past events

### Modified Files:
1. **`app/admin/events/page.tsx`** - Added tabs for Upcoming Events and Past Events
2. **`app/eventss/page.tsx`** - Updated to fetch past events from database

## 🗄️ Database Setup

### Step 1: Run the SQL Schema

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-past-events-schema.sql`
4. Click **Run**

This will create:
- ✅ `past_events` table
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update triggers
- ✅ Sample data (optional)

### Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `past-event-posters`
4. **Make it Public** ✅
5. Click **Create Bucket**

## 🎯 Features

### Admin Panel Features:

#### 1. **Two Tabs in Manage Events**
- **Upcoming Events Tab**: Manage regular events (existing functionality)
- **Past Events Tab**: Manage past event posters (new!)

#### 2. **Past Events Management**
- ➕ **Add Past Event**: Upload event name + poster image
- ✏️ **Edit Past Event**: Update name, poster, order, visibility
- 🗑️ **Delete Past Event**: Remove past event posters
- 👁️ **Toggle Visibility**: Show/hide events on the public page
- 🔢 **Display Order**: Control the order in the carousel

#### 3. **Simple Form Fields**
When adding/editing a past event:
- **Event Name** (required) - e.g., "MATLAB Workshop 2024"
- **Poster Image** (required) - Upload poster image
- **Display Order** (optional) - Lower numbers appear first (default: 0)
- **Visibility** (checkbox) - Show on events page (default: checked)

## 🖥️ Usage Guide

### Adding a New Past Event:

1. **Go to Admin Panel** → Manage Events
2. **Click "Past Events" tab**
3. **Click "➕ Add Past Event" button**
4. **Fill in the form**:
   - Enter event name
   - Upload poster image (JPG, PNG, etc.)
   - Set display order (optional)
   - Check "Make visible" if you want it to show immediately
5. **Click "➕ Add Past Event"**
6. ✅ Done! The poster will appear in the Past Events carousel on the events page

### Editing a Past Event:

1. **Go to Admin Panel** → Manage Events → **Past Events tab**
2. **Find the event** you want to edit
3. **Click "✏️ Edit" button**
4. **Update the fields** as needed
5. **Click "💾 Update Past Event"**
6. ✅ Changes saved!

### Managing Visibility:

- **Toggle Visibility**: Click the "👁️ Visible" / "🙈 Hidden" button
- Hidden events won't show on the public events page
- Useful for temporarily hiding events without deleting them

### Deleting a Past Event:

1. **Find the event** in the Past Events tab
2. **Click "🗑️" button**
3. **Confirm deletion**
4. ✅ Event removed permanently

## 🌐 Public Display

### Events Page (`/eventss`):
- **Past Events Carousel** automatically fetches visible past events from the database
- Events are displayed in order based on `display_order` field
- Smooth carousel animation with hover effects
- Falls back to default images if no past events are available

## 🔧 Technical Details

### API Endpoints:

#### GET `/api/past-events`
Fetch all past events
- Query params:
  - `?visible=true` - Get only visible events (for public page)

#### POST `/api/past-events`
Create new past event
- Body: `{ event_name, poster_image_url, display_order, is_visible }`

#### PUT `/api/past-events?id={id}`
Update existing past event
- Body: Any field to update

#### DELETE `/api/past-events?id={id}`
Delete past event

### Database Schema:

```sql
past_events (
  id UUID PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  poster_image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 📝 Notes

1. **Image Upload**: 
   - Uses the same upload API as other images (`/api/upload`)
   - Stored in `past-event-posters` bucket in Supabase Storage
   - Accepts: JPG, PNG, GIF, WebP

2. **Display Order**:
   - Lower numbers appear first (0, 1, 2, 3...)
   - Default is 0
   - Events with same order are sorted by creation date

3. **Fallback**:
   - If no past events in database, shows default images
   - Ensures the page never looks empty

4. **Performance**:
   - Indexed for fast queries
   - Cached on the frontend
   - Only visible events fetched on public page

## ✅ Testing Checklist

- [ ] Run SQL schema in Supabase
- [ ] Create `past-event-posters` storage bucket
- [ ] Navigate to Admin Panel → Manage Events
- [ ] See "Past Events" tab
- [ ] Click "Add Past Event"
- [ ] Upload a test poster
- [ ] Check if it appears in the manage section
- [ ] Visit `/eventss` page
- [ ] Verify poster shows in Past Events carousel
- [ ] Test edit functionality
- [ ] Test visibility toggle
- [ ] Test delete functionality

## 🎊 You're All Set!

The Past Events section is now fully integrated with your admin panel. You can manage all past event posters directly from the admin interface without touching any code!

**Happy Managing! 🚀**
