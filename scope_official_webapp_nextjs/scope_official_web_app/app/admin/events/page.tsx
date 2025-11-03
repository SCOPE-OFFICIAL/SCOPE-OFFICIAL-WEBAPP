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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming') // Tab state

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => router.push(activeTab === 'upcoming' ? '/admin/events/new' : '/admin/events/past/new')}
            className="px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
          >
            ➕ {activeTab === 'upcoming' ? 'Add New Event' : 'Add Past Event'}
          </button>
        </div>
      </div>

      {/* Tabs for Upcoming and Past Events */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          📅 Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'past'
              ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          📜 Past Events
        </button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'upcoming' ? (
        <>
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
              {events.map((event, index) => {
                // Determine if event datetime has already passed
                const expired = (() => {
                  try {
                    const dt = new Date(`${event.event_date}T${event.event_time || '00:00:00'}`)
                    return dt.getTime() < Date.now()
                  } catch {
                    return false
                  }
                })()

                return (
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
                        {/* Expired tag + quick delete action for passed events */}
                        {expired && (
                          <div className="flex items-center gap-2 ml-2">
                            <span
                              title="This event's date/time has passed and it will not appear in the public upcoming events. Consider deleting it."
                              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400"
                            >
                              Expired
                            </span>
                            <button
                              onClick={() => {
                                if (confirm('This event has passed. Delete it now?')) handleDelete(event.id)
                              }}
                              className="text-xs underline text-red-300 hover:text-red-200"
                            >
                              Delete expired
                            </button>
                          </div>
                        )}
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
              );
              })}
            </div>
          )}
        </>
      ) : (
        /* Past Events Management Component */
        <PastEventsManagement />
      )}
    </div>
  )
}

/* ============================================
   PAST EVENTS MANAGEMENT COMPONENT
   ============================================ */

interface PastEvent {
  id: string
  event_name: string
  poster_image_url: string
  display_order: number
  is_visible: boolean
  created_at: string
}

function PastEventsManagement() {
  const router = useRouter()
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPastEvents()
  }, [])

  const fetchPastEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/past-events')
      const data = await response.json()
      setPastEvents(data.pastEvents || [])
    } catch (error) {
      console.error('Failed to fetch past events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this past event?')) return

    try {
      const response = await fetch(`/api/past-events?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPastEvents(pastEvents.filter(e => e.id !== id))
        alert('Past event deleted successfully!')
      } else {
        alert('Failed to delete past event')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting past event')
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/past-events?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVisibility })
      })

      if (response.ok) {
        setPastEvents(pastEvents.map(e => 
          e.id === id ? { ...e, is_visible: !currentVisibility } : e
        ))
      } else {
        alert('Failed to update visibility')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Error updating visibility')
    }
  }

  return (
    <>
      {loading ? (
        <div className="text-center text-white py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading past events...</p>
        </div>
      ) : pastEvents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <p className="text-gray-400 text-lg">No past events found</p>
          <button
            onClick={() => router.push('/admin/events/past/new')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all"
          >
            Add Your First Past Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
            >
              {/* Event Poster */}
              <div className="h-64 bg-gray-800 overflow-hidden relative">
                <img
                  src={event.poster_image_url}
                  alt={event.event_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!event.is_visible && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold">👁️ Hidden</span>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                  {event.event_name}
                </h3>

                <div className="text-xs text-gray-400 mb-4">
                  Order: {event.display_order}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleVisibility(event.id, event.is_visible)}
                    className={`w-full px-4 py-2 rounded-lg border transition-all ${
                      event.is_visible
                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
                        : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {event.is_visible ? '👁️ Visible' : '🙈 Hidden'}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/events/past/edit/${event.id}`)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}
