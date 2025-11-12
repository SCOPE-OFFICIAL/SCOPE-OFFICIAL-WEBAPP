/**
 * Analytics API Route
 * Provides real website analytics data for admin dashboard
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get date ranges
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all data in parallel
    const [
      eventsRes, 
      teamRes, 
      galleryRes, 
      groupPhotosRes, 
      faqRes, 
      userQuestionsRes, 
      pastEventsRes,
      pageViewsRes,
      pageViewsTodayRes,
      pageViewsWeekRes,
      pageViewsMonthRes,
      uniqueSessionsRes,
      apiRequestsRes,
      apiRequestsTodayRes
    ] = await Promise.all([
      supabase.from('events').select('*'),
      supabase.from('team_members').select('*'),
      supabase.from('gallery').select('*'),
      supabase.from('group_photos').select('*'),
      supabase.from('faqs').select('*'),
      supabase.from('user_questions').select('*'),
      supabase.from('past_events').select('*'),
      // Page views analytics
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('page_views').select('session_id').gte('created_at', thirtyDaysAgo),
      // API requests analytics
      supabase.from('api_requests').select('*'),
      supabase.from('api_requests').select('*').gte('created_at', todayStart)
    ])

    const events = eventsRes.data || []
    const teamMembers = teamRes.data || []
    const galleryImages = galleryRes.data || []
    const groupPhotos = groupPhotosRes.data || []
    const faqs = faqRes.data || []
    const userQuestions = userQuestionsRes.data || []
    const pastEvents = pastEventsRes.data || []

    // Calculate content statistics
    const today = new Date().toISOString().split('T')[0]
    const upcomingEvents = events.filter(e => e.event_date >= today && e.status === 'published').length
    const publishedEvents = events.filter(e => e.status === 'published').length
    const activeTeamMembers = teamMembers.filter(m => m.is_active).length
    const visibleGalleryImages = galleryImages.filter(i => i.is_visible !== false).length
    const visibleGroupPhotos = groupPhotos.filter(p => p.is_visible).length
    const publishedFaqs = faqs.filter(f => f.is_visible).length
    const publicUserQuestions = userQuestions.filter(q => q.is_public).length
    const visiblePastEvents = pastEvents.filter(e => e.is_visible).length

    // Calculate page views statistics
    const totalPageViews = pageViewsRes.count || 0
    const todayPageViews = pageViewsTodayRes.count || 0
    const weekPageViews = pageViewsWeekRes.count || 0
    const monthPageViews = pageViewsMonthRes.count || 0
    
    // Calculate unique sessions
    const uniqueSessions = new Set(
      (uniqueSessionsRes.data || []).map(pv => pv.session_id)
    ).size

    // Get page views by page
    const pageViewsData = await supabase
      .from('page_views')
      .select('page_path')
      .gte('created_at', thirtyDaysAgo)
    
    const pageViewsByPath = (pageViewsData.data || []).reduce((acc: Record<string, number>, pv: { page_path: string }) => {
      const path = pv.page_path
      acc[path] = (acc[path] || 0) + 1
      return acc
    }, {})

    const sortedPages = Object.entries(pageViewsByPath)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 6)
      .map(([page, views]) => {
        // Clean up page names
        let pageName = page
        if (page === '/') pageName = 'Home'
        else if (page === '/eventss') pageName = 'Events'
        else if (page === '/gallery') pageName = 'Gallery'
        else if (page === '/aboutus') pageName = 'About Us'
        else if (page === '/teams') pageName = 'Teams'
        else if (page === '/faq') pageName = 'FAQ'
        else pageName = page.replace('/', '')

        const percentage = totalPageViews > 0 ? Math.round((views / totalPageViews) * 100) : 0
        return { page: pageName, views, percentage }
      })

    // Calculate API request statistics
    const apiRequests = apiRequestsRes.data || []
    const apiRequestsToday = apiRequestsTodayRes.data || []
    
    const totalApiRequests = apiRequests.length
    const todayApiRequests = apiRequestsToday.length
    
    const avgResponseTime = apiRequests.length > 0
      ? Math.round(apiRequests.reduce((sum, req) => sum + (req.response_time_ms || 0), 0) / apiRequests.length)
      : 0

    // Get API requests by endpoint
    interface EndpointStats {
      count: number
      totalTime: number
      errors: number
    }
    
    const apiRequestsByEndpoint = apiRequests.reduce((acc: Record<string, EndpointStats>, req: { endpoint: string, response_time_ms: number, status_code: number }) => {
      const endpoint = req.endpoint
      if (!acc[endpoint]) {
        acc[endpoint] = { count: 0, totalTime: 0, errors: 0 }
      }
      acc[endpoint].count++
      acc[endpoint].totalTime += req.response_time_ms || 0
      if (req.status_code >= 400) acc[endpoint].errors++
      return acc
    }, {})

    // Type the entries so `stats` is recognized as EndpointStats (avoids 'unknown' type error)
    // Build top API endpoints list using Object.keys to preserve typing of stats
    const topApiEndpoints = Object.keys(apiRequestsByEndpoint)
      .map((endpoint) => {
        const stats: EndpointStats = apiRequestsByEndpoint[endpoint]
        return {
          endpoint,
          requests: stats.count,
          avgResponseTime: stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0,
          errorRate: stats.count > 0 ? Math.round((stats.errors / stats.count) * 100) : 0
        }
      })
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)

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
    .slice(0, 10)

    // Calculate trends (last 30 days)
    const recentEvents = events.filter(e => e.created_at >= thirtyDaysAgo).length
    const recentTeamMembers = teamMembers.filter(m => m.created_at >= thirtyDaysAgo).length
    const recentGalleryImages = galleryImages.filter(i => i.created_at >= thirtyDaysAgo).length
    const recentUserQuestions = userQuestions.filter(q => q.created_at >= thirtyDaysAgo).length

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
      pageViews: {
        total: totalPageViews,
        today: todayPageViews,
        lastWeek: weekPageViews,
        lastMonth: monthPageViews,
        uniqueSessions,
        byPage: sortedPages
      },
      apiRequests: {
        total: totalApiRequests,
        today: todayApiRequests,
        avgResponseTime,
        byEndpoint: topApiEndpoints
      },
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
