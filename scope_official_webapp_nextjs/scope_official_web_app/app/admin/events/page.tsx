/**
 * Admin Events Management Page
 * List, edit, delete events
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string | null
  location: string | null
  image_url: string | null
  event_type: string
  status: string
  is_featured: boolean
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, published, draft, upcoming

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchEvents()
  }, [filter, router])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const url = filter === 'upcoming' 
        ? '/api/events?upcoming=true'
        : filter !== 'all'
        ? `/api/events?status=${filter}`
        : '/api/events'
        
      const response = await fetch(url)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEvents(events.filter(e => e.id !== id))
        alert('Event deleted successfully!')
      } else {
        alert('Failed to delete event')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting event')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
            Manage Events
          </h1>
          <p className="text-gray-400 mt-2">Create, edit, and manage all events</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
          >
            ← Dashboard
          </button>
          <button
            onClick={() => router.push('/admin/events/new')}
            className="px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
          >
            ➕ Add New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'published', 'draft', 'upcoming'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center text-white py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <p className="text-gray-400 text-lg">No events found</p>
          <button
            onClick={() => router.push('/admin/events/new')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
            >
              {/* Event Image */}
              {event.image_url ? (
                <div className="h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#F24DC2]/20 to-[#2C97FF]/20 flex items-center justify-center">
                  <span className="text-6xl">📅</span>
                </div>
              )}

              {/* Event Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">
                    {event.title}
                  </h3>
                  {event.is_featured && (
                    <span className="ml-2 text-yellow-400 text-xl">⭐</span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(event.event_date)}
                    {event.event_time && ` at ${event.event_time}`}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                      {event.event_type}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/events/edit/${event.id}`)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
