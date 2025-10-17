/**
 * Analytics API Route
 * Provides website analytics data for admin dashboard
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all data in parallel
    const [eventsRes, teamRes, galleryRes, groupPhotosRes, faqRes, userQuestionsRes, pastEventsRes] = await Promise.all([
      supabase.from('events').select('*'),
      supabase.from('team_members').select('*'),
      supabase.from('gallery').select('*'),
      supabase.from('group_photos').select('*'),
      supabase.from('faqs').select('*'),
      supabase.from('user_questions').select('*'),
      supabase.from('past_events').select('*')
    ])

    const events = eventsRes.data || []
    const teamMembers = teamRes.data || []
    const galleryImages = galleryRes.data || []
    const groupPhotos = groupPhotosRes.data || []
    const faqs = faqRes.data || []
    const userQuestions = userQuestionsRes.data || []
    const pastEvents = pastEventsRes.data || []

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0]
    const upcomingEvents = events.filter(e => e.event_date >= today && e.status === 'published').length
    const publishedEvents = events.filter(e => e.status === 'published').length
    const activeTeamMembers = teamMembers.filter(m => m.is_active).length
    const visibleGalleryImages = galleryImages.filter(i => i.is_visible !== false).length
    const visibleGroupPhotos = groupPhotos.filter(p => p.is_visible).length
    const publishedFaqs = faqs.filter(f => f.is_visible).length
    const publicUserQuestions = userQuestions.filter(q => q.is_public).length
    const visiblePastEvents = pastEvents.filter(e => e.is_visible).length

    // Get recent activity
    const recentActivity = [
      ...events.map(e => ({
        type: 'event',
        action: 'created',
        title: e.title,
        timestamp: e.created_at,
        status: e.status
      })),
      ...teamMembers.map(m => ({
        type: 'team',
        action: 'added',
        title: m.name,
        timestamp: m.created_at,
        role: m.role
      })),
      ...galleryImages.map(i => ({
        type: 'gallery',
        action: 'uploaded',
        title: i.title || i.folder_name,
        timestamp: i.created_at
      })),
      ...userQuestions.map(q => ({
        type: 'question',
        action: 'submitted',
        title: q.question.substring(0, 50) + '...',
        timestamp: q.created_at,
        status: q.is_answered ? 'answered' : 'pending'
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10) // Get latest 10 activities

    // Calculate trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()

    const recentEvents = events.filter(e => e.created_at >= thirtyDaysAgoStr).length
    const recentTeamMembers = teamMembers.filter(m => m.created_at >= thirtyDaysAgoStr).length
    const recentGalleryImages = galleryImages.filter(i => i.created_at >= thirtyDaysAgoStr).length
    const recentUserQuestions = userQuestions.filter(q => q.created_at >= thirtyDaysAgoStr).length

    // Mock page views data (in a real app, you'd track this with a service like Google Analytics)
    const pageViews = {
      total: 15847,
      today: 234,
      lastWeek: 1658,
      lastMonth: 7234,
      byPage: [
        { page: 'Home', views: 5234, percentage: 33 },
        { page: 'Events', views: 3421, percentage: 22 },
        { page: 'Gallery', views: 2843, percentage: 18 },
        { page: 'About Us', views: 2156, percentage: 14 },
        { page: 'Teams', views: 1543, percentage: 10 },
        { page: 'FAQ', views: 650, percentage: 3 }
      ]
    }

    const analytics = {
      stats: {
        totalEvents: events.length,
        publishedEvents,
        upcomingEvents,
        totalTeamMembers: teamMembers.length,
        activeTeamMembers,
        totalGalleryImages: galleryImages.length,
        visibleGalleryImages,
        totalGroupPhotos: groupPhotos.length,
        visibleGroupPhotos,
        totalFaqs: faqs.length,
        publishedFaqs,
        totalUserQuestions: userQuestions.length,
        publicUserQuestions,
        totalPastEvents: pastEvents.length,
        visiblePastEvents
      },
      trends: {
        newEventsLast30Days: recentEvents,
        newTeamMembersLast30Days: recentTeamMembers,
        newGalleryImagesLast30Days: recentGalleryImages,
        newQuestionsLast30Days: recentUserQuestions
      },
      pageViews,
      recentActivity
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
