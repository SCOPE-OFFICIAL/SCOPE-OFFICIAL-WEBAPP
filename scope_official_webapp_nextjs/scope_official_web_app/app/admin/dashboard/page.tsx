/**
 * Admin Dashboard Main Page
 * Shows overview statistics and quick actions
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

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    galleryImages: 0,
    teamMembers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Fetch dashboard stats
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      
      const today = new Date().toISOString().split('T')[0]
      const upcoming = data.events?.filter((e: any) => 
        e.event_date >= today && e.status === 'published'
      ).length || 0

      setStats({
        totalEvents: data.events?.length || 0,
        upcomingEvents: upcoming,
        galleryImages: 0, // Will implement later
        teamMembers: 0 // Will implement later
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
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
    { title: 'Team', href: '/admin/team', icon: '👥', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'Group Photos', href: '/admin/team/group-photos', icon: '📸', color: 'bg-gradient-to-r from-teal-500 to-green-500' },
    { title: 'FAQ', href: '/admin/faq', icon: '❓', color: 'bg-gradient-to-r from-orange-500 to-red-500' }
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
          <p className="text-gray-400 mt-2">Welcome back! Manage your SCOPE website content here.</p>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} rounded-xl p-6 text-white text-center cursor-pointer shadow-lg hover:shadow-2xl transition-all`}
            >
              <div className="text-4xl mb-3">{action.icon}</div>
              <h3 className="font-bold text-lg">{action.title}</h3>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <p className="text-gray-400">Activity tracking coming soon...</p>
      </div>
    </div>
  )
}
