/**
 * Admin Dashboard Main Page
 * Shows overview statistics, analytics, and quick actions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Stats {
  totalEvents: number
  upcomingEvents: number
  galleryImages: number
  teamMembers: number
}

interface Analytics {
  stats: {
    totalEvents: number
    publishedEvents: number
    upcomingEvents: number
    totalTeamMembers: number
    activeTeamMembers: number
    totalGalleryImages: number
    visibleGalleryImages: number
    totalGroupPhotos: number
    visibleGroupPhotos: number
    totalFaqs: number
    publishedFaqs: number
    totalUserQuestions: number
    publicUserQuestions: number
  }
  trends: {
    newEventsLast30Days: number
    newTeamMembersLast30Days: number
    newGalleryImagesLast30Days: number
    newQuestionsLast30Days: number
  }
  pageViews: {
    total: number
    today: number
    lastWeek: number
    lastMonth: number
    uniqueSessions: number
    byPage: Array<{ page: string; views: number; percentage: number }>
  }
  apiRequests: {
    total: number
    today: number
    avgResponseTime: number
    byEndpoint: Array<{ 
      endpoint: string
      requests: number
      avgResponseTime: number
      errorRate: number
    }>
  }
  recentActivity: Array<{
    type: string
    action: string
    title: string
    timestamp: string
    status?: string
    role?: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminName, setAdminName] = useState<string>('')
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    galleryImages: 0,
    teamMembers: 0
  })
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to calculate time ago
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Get admin name from localStorage
    const name = localStorage.getItem('admin_name') || localStorage.getItem('admin_email')
    setAdminName(name || 'Admin')

    // Fetch dashboard stats
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      
      if (data.stats) {
        setStats({
          totalEvents: data.stats.totalEvents,
          upcomingEvents: data.stats.upcomingEvents,
          galleryImages: data.stats.visibleGalleryImages + data.stats.visibleGroupPhotos,
          teamMembers: data.stats.activeTeamMembers
        })
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
    localStorage.removeItem('admin_name')
    localStorage.removeItem('admin_role')
    router.push('/admin/login')
  }

  const statCards = [
    { title: 'Total Events', value: stats.totalEvents, icon: '📅', color: 'from-blue-500 to-cyan-500' },
    { title: 'Upcoming Events', value: stats.upcomingEvents, icon: '🚀', color: 'from-purple-500 to-pink-500' },
    { title: 'Gallery Images', value: stats.galleryImages, icon: '🖼️', color: 'from-green-500 to-teal-500' },
    { title: 'Team Members', value: stats.teamMembers, icon: '👥', color: 'from-orange-500 to-red-500' }
  ]

  const quickActions = [
    { title: 'Add New Event', href: '/admin/events/new', icon: '➕', color: 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]' },
    { title: 'Manage Events', href: '/admin/events', icon: '📋', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { title: 'Gallery', href: '/admin/gallery', icon: '🎨', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { title: 'Partners', href: '/admin/partners', icon: '🤝', color: 'bg-gradient-to-r from-pink-500 to-purple-500' },
    { title: 'Team', href: '/admin/team', icon: '👥', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'Group Photos', href: '/admin/team/group-photos', icon: '📸', color: 'bg-gradient-to-r from-teal-500 to-green-500' },
    { title: 'FAQ', href: '/admin/faq', icon: '❓', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { title: 'Manage Admins', href: '/admin/admins', icon: '🔐', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040a28]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, {adminName}! Manage your SCOPE website content here.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">{stat.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.08, delay: 0.05 + index * 0.02 }}
              // faster hover/unhover response so the card snaps back quickly when the cursor leaves
              whileHover={{ scale: 1.06, y: -6, transition: { duration: 0.4, ease: 'easeOut' } }}
              whileTap={{ scale: 0.975 }}
              className={`${action.color} rounded-xl p-6 text-white text-center cursor-pointer shadow-lg transition-transform duration-200 transform-gpu relative overflow-hidden group`}
            >
              {/* Subtle shine overlay that appears on hover */}
              <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/6 via-white/12 to-white/6 opacity-0 group-hover:opacity-30 transition-opacity duration-100 mix-blend-screen blur-sm" />

              {/* Floating icon with motion-like transform on hover */}
              <div className="text-4xl mb-3 transform transition-transform duration-100 group-hover:-translate-y-1 group-hover:rotate-2">
                {action.icon}
              </div>

              <h3 className="font-bold text-lg transition-colors duration-300 group-hover:underline">{action.title}</h3>

              {/* Glow/ring on hover */}
              <span className="absolute -inset-px rounded-xl ring-0 group-hover:ring-4 group-hover:ring-white/20 transition-all duration-100 pointer-events-none" />
              {/* Colored glow shadow that fades in on hover to give a stronger emphasis */}
              <span className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{ boxShadow: '0 18px 50px rgba(242,77,194,0.14), 0 6px 20px rgba(44,151,255,0.08)' }} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Website Analytics */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📊 Website Analytics</h2>
          
          {/* Page Views Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Total Page Views</h3>
                <span className="text-2xl">👁️</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.pageViews.total.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">All time views</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Today&apos;s Views</h3>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.pageViews.today}</p>
              <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">This Month</h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.pageViews.lastMonth.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Last 30 days</p>
            </div>
          </div>

          {/* Popular Pages & Recent Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Popular Pages */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🔥 Most Visited Pages</h3>
              <div className="space-y-3">
                {analytics.pageViews.byPage.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm font-medium">{page.page}</span>
                        <span className="text-gray-400 text-xs">{page.views.toLocaleString()} views</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${page.percentage}%` }}
                          transition={{ duration: 1, delay: 0.1 * idx }}
                          className="bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Trends */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📈 Activity Trends (Last 30 Days)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xl">📅</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">New Events</p>
                      <p className="text-xs text-gray-400">Events created</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">+{analytics.trends.newEventsLast30Days}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-xl">👥</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Team Members</p>
                      <p className="text-xs text-gray-400">Members added</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">+{analytics.trends.newTeamMembersLast30Days}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xl">🖼️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Gallery Images</p>
                      <p className="text-xs text-gray-400">Images uploaded</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-400">+{analytics.trends.newGalleryImagesLast30Days}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-xl">❓</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">User Questions</p>
                      <p className="text-xs text-gray-400">Questions received</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-orange-400">+{analytics.trends.newQuestionsLast30Days}</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Requests Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Total API Requests</h3>
                <span className="text-2xl">🔌</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.apiRequests.total.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">All time requests</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Today&apos;s Requests</h3>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.apiRequests.today.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-pink-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Avg Response Time</h3>
                <span className="text-2xl">⏱️</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.apiRequests.avgResponseTime}ms</p>
              <p className="text-xs text-gray-400 mt-2">Average latency</p>
            </div>
          </div>

          {/* API Endpoints Table */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🔌 API Request Window</h3>
            {analytics.apiRequests.byEndpoint.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium text-sm pb-3 px-2">Endpoint</th>
                      <th className="text-right text-gray-300 font-medium text-sm pb-3 px-2">Requests</th>
                      <th className="text-right text-gray-300 font-medium text-sm pb-3 px-2">Avg Time</th>
                      <th className="text-right text-gray-300 font-medium text-sm pb-3 px-2">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.apiRequests.byEndpoint.map((endpoint, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * idx }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <code className="text-cyan-400 text-xs font-mono bg-cyan-500/10 px-2 py-1 rounded">
                            {endpoint.endpoint}
                          </code>
                        </td>
                        <td className="text-right text-white font-medium py-3 px-2">
                          {endpoint.requests.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-2">
                          <span className={`text-sm font-medium ${
                            endpoint.avgResponseTime < 100 ? 'text-green-400' :
                            endpoint.avgResponseTime < 500 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {endpoint.avgResponseTime}ms
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">
                          <span className={`text-sm font-medium ${
                            endpoint.errorRate === 0 ? 'text-green-400' :
                            endpoint.errorRate < 5 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {endpoint.errorRate}%
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📊</p>
                <p>No API request data available yet</p>
                <p className="text-sm mt-2">Data will appear as users interact with the website</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">🕐 Recent Activity</h2>
        {analytics && analytics.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, idx) => {
              const getActivityIcon = (type: string) => {
                switch(type) {
                  case 'event': return '📅'
                  case 'team': return '👤'
                  case 'gallery': return '🖼️'
                  case 'question': return '❓'
                  default: return '📝'
                }
              }

              const getActivityColor = (type: string) => {
                switch(type) {
                  case 'event': 
                    return {
                      bg: 'bg-blue-500/5',
                      border: 'border-blue-500/20',
                      hover: 'hover:bg-blue-500/10',
                      iconBg: 'bg-blue-500/20'
                    }
                  case 'team': 
                    return {
                      bg: 'bg-purple-500/5',
                      border: 'border-purple-500/20',
                      hover: 'hover:bg-purple-500/10',
                      iconBg: 'bg-purple-500/20'
                    }
                  case 'gallery': 
                    return {
                      bg: 'bg-green-500/5',
                      border: 'border-green-500/20',
                      hover: 'hover:bg-green-500/10',
                      iconBg: 'bg-green-500/20'
                    }
                  case 'question': 
                    return {
                      bg: 'bg-orange-500/5',
                      border: 'border-orange-500/20',
                      hover: 'hover:bg-orange-500/10',
                      iconBg: 'bg-orange-500/20'
                    }
                  default: 
                    return {
                      bg: 'bg-gray-500/5',
                      border: 'border-gray-500/20',
                      hover: 'hover:bg-gray-500/10',
                      iconBg: 'bg-gray-500/20'
                    }
                }
              }

              const colorClasses = getActivityColor(activity.type)
              const timeAgo = getTimeAgo(activity.timestamp)

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex items-center gap-4 p-4 ${colorClasses.bg} border ${colorClasses.border} rounded-lg ${colorClasses.hover} transition-all`}
                >
                  <div className={`w-10 h-10 rounded-full ${colorClasses.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-gray-400">
                      {activity.action} • {timeAgo}
                      {activity.status && ` • ${activity.status}`}
                      {activity.role && ` • ${activity.role}`}
                    </p>
                  </div>
                  {activity.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'published' || activity.status === 'answered' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-400">No recent activity...</p>
        )}
      </motion.div>
    </div>
  )
}
