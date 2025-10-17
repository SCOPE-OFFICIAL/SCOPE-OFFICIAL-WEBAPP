/**
 * Admin Gallery Management Page - Event-Based Interface
 * Manage gallery events and their images
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface GalleryImage {
  id: string
  image_url: string
  folder_name: string
  caption: string | null
  is_visible: boolean
  display_order: number
}

interface GalleryEvent {
  folder_name: string
  title: string
  subtitle: string
  description: string
  date: string
  duration: string
  participants: string
  gradient: string
  images: GalleryImage[]
  displayImage?: string
}

export default function AdminGalleryPage() {
  const router = useRouter()
  const [events, setEvents] = useState<GalleryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showAddImagesModal, setShowAddImagesModal] = useState(false)
  const [showEditEventModal, setShowEditEventModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  // New Event Form
  const [newEvent, setNewEvent] = useState({
    folder_name: '',
    title: '',
    subtitle: '',
    description: '',
    date: '',
    duration: '',
    participants: '',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600'
  })

  const gradientOptions = [
    { name: 'Blue Purple', value: 'from-blue-600 via-indigo-600 to-purple-600' },
    { name: 'Pink Blue', value: 'from-pink-600 via-purple-600 to-blue-600' },
    { name: 'Cyan Teal', value: 'from-cyan-600 via-blue-600 to-teal-600' },
    { name: 'Orange Red', value: 'from-orange-600 via-red-600 to-pink-600' },
    { name: 'Green Emerald', value: 'from-green-600 via-emerald-600 to-teal-600' },
    { name: 'Purple Fuchsia', value: 'from-purple-600 via-fuchsia-600 to-pink-600' },
  ]

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchGalleryEvents()
  }, [router])

  const fetchGalleryEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gallery')
      const data = await response.json()
      const images: GalleryImage[] = data.images || []

      // Group images by folder_name
      const eventGroups: { [key: string]: GalleryImage[] } = {}
      images.forEach(img => {
        if (!eventGroups[img.folder_name]) {
          eventGroups[img.folder_name] = []
        }
        eventGroups[img.folder_name].push(img)
      })

      // Create event objects with metadata
      const eventsData: GalleryEvent[] = Object.keys(eventGroups).map(folderName => {
        const sortedImages = eventGroups[folderName].sort((a, b) => a.display_order - b.display_order)
        
        // Try to get event metadata from localStorage or use defaults
        const savedMetadata = localStorage.getItem(`event_meta_${folderName}`)
        const metadata = savedMetadata ? JSON.parse(savedMetadata) : getDefaultMetadata(folderName)

        return {
          folder_name: folderName,
          title: metadata.title || folderName.toUpperCase(),
          subtitle: metadata.subtitle || `Explore ${folderName} gallery`,
          description: metadata.description || `Collection of photos from ${folderName} events and activities.`,
          date: metadata.date || 'Various dates',
          duration: metadata.duration || 'Multiple sessions',
          participants: metadata.participants || 'SCOPE Members',
          gradient: metadata.gradient || 'from-blue-600 via-indigo-600 to-purple-600',
          images: sortedImages,
          displayImage: metadata.displayImage || sortedImages[0]?.image_url
        }
      })

      setEvents(eventsData)
    } catch (error) {
      console.error('Failed to fetch gallery events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultMetadata = (folderName: string) => {
    const defaults: { [key: string]: any } = {
      'MATLAB': {
        title: 'MATLAB WORKSHOP',
        subtitle: 'Learn, Analyze, Innovate with MATLAB workshops',
        description: 'Our MATLAB workshop series is designed to empower students and professionals with comprehensive knowledge of MATLAB programming and its applications.',
        date: 'March 15-16, 2024',
        duration: '2 Days',
        participants: '50+ Students',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600'
      },
      'ATLASSIAN': {
        title: 'ATLASSIAN WORKSHOP',
        subtitle: 'Master project management and collaboration',
        description: 'The Atlassian workshop series introduces students to industry-standard project management tools.',
        date: 'April 20-21, 2024',
        duration: '2 Days',
        participants: '40+ Students',
        gradient: 'from-blue-700 via-indigo-700 to-cyan-700'
      }
    }
    return defaults[folderName] || {}
  }

  const handleCreateEvent = async () => {
    if (!newEvent.folder_name || !newEvent.title) {
      alert('Please fill in at least folder name and title')
      return
    }

    // Save metadata to localStorage (in real app, save to database)
    localStorage.setItem(`event_meta_${newEvent.folder_name}`, JSON.stringify(newEvent))

    // Create new event object
    const event: GalleryEvent = {
      ...newEvent,
      images: [],
      displayImage: undefined
    }

    setEvents([...events, event])
    setShowAddEventModal(false)
    setNewEvent({
      folder_name: '',
      title: '',
      subtitle: '',
      description: '',
      date: '',
      duration: '',
      participants: '',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600'
    })

    alert('Event created successfully! Now add images to this event.')
  }

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return

    // Update metadata
    localStorage.setItem(`event_meta_${selectedEvent.folder_name}`, JSON.stringify({
      title: selectedEvent.title,
      subtitle: selectedEvent.subtitle,
      description: selectedEvent.description,
      date: selectedEvent.date,
      duration: selectedEvent.duration,
      participants: selectedEvent.participants,
      gradient: selectedEvent.gradient,
      displayImage: selectedEvent.displayImage
    }))

    setEvents(events.map(e => e.folder_name === selectedEvent.folder_name ? selectedEvent : e))
    setShowEditEventModal(false)
    alert('Event updated successfully!')
  }

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedEvent) return
    
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadedImages: GalleryImage[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Upload image to storage
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'gallery-images')
        formData.append('folder', selectedEvent.folder_name.toLowerCase())

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()

        if (uploadResponse.ok) {
          // Add to gallery database
          const dbResponse = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: uploadData.url,
              folder_name: selectedEvent.folder_name,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              is_visible: true,
              display_order: selectedEvent.images.length + i
            })
          })

          if (dbResponse.ok) {
            const newImage = await dbResponse.json()
            uploadedImages.push(newImage.image)
          }
        }
      }

      // Update selected event
      const updatedEvent = {
        ...selectedEvent,
        images: [...selectedEvent.images, ...uploadedImages]
      }
      setSelectedEvent(updatedEvent)
      setEvents(events.map(e => e.folder_name === selectedEvent.folder_name ? updatedEvent : e))

      alert(`Successfully uploaded ${uploadedImages.length} images!`)
      setShowAddImagesModal(false)
      fetchGalleryEvents()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedEvent || !confirm('Delete this image?')) return

    try {
      const response = await fetch(`/api/gallery?id=${imageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const updatedEvent = {
          ...selectedEvent,
          images: selectedEvent.images.filter(img => img.id !== imageId)
        }
        setSelectedEvent(updatedEvent)
        setEvents(events.map(e => e.folder_name === selectedEvent.folder_name ? updatedEvent : e))
        alert('Image deleted successfully!')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting image')
    }
  }

  const toggleImageVisibility = async (image: GalleryImage) => {
    if (!selectedEvent) return

    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: image.id,
          is_visible: !image.is_visible
        })
      })

      if (response.ok) {
        const updatedEvent = {
          ...selectedEvent,
          images: selectedEvent.images.map(img => 
            img.id === image.id ? { ...img, is_visible: !img.is_visible } : img
          )
        }
        setSelectedEvent(updatedEvent)
        setEvents(events.map(e => e.folder_name === selectedEvent.folder_name ? updatedEvent : e))
      }
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  const setDisplayImage = (imageUrl: string) => {
    if (!selectedEvent) return

    const updatedEvent = { ...selectedEvent, displayImage: imageUrl }
    setSelectedEvent(updatedEvent)
    setEvents(events.map(e => e.folder_name === selectedEvent.folder_name ? updatedEvent : e))

    // Save to localStorage
    const metadata = {
      title: selectedEvent.title,
      subtitle: selectedEvent.subtitle,
      description: selectedEvent.description,
      date: selectedEvent.date,
      duration: selectedEvent.duration,
      participants: selectedEvent.participants,
      gradient: selectedEvent.gradient,
      displayImage: imageUrl
    }
    localStorage.setItem(`event_meta_${selectedEvent.folder_name}`, JSON.stringify(metadata))
    
    alert('Display image updated!')
  }

  const handleDeleteEvent = async (eventFolderName: string) => {
    if (!confirm('Delete this entire event and all its images? This cannot be undone!')) return

    try {
      const event = events.find(e => e.folder_name === eventFolderName)
      if (!event) return

      // Delete all images in this event
      for (const image of event.images) {
        await fetch(`/api/gallery?id=${image.id}`, { method: 'DELETE' })
      }

      // Remove metadata
      localStorage.removeItem(`event_meta_${eventFolderName}`)

      // Update state
      setEvents(events.filter(e => e.folder_name !== eventFolderName))
      alert('Event deleted successfully!')
    } catch (error) {
      console.error('Delete event error:', error)
      alert('Error deleting event')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
              Gallery Events Management
            </h1>
            <p className="text-gray-400 mt-2">Organize your gallery by events</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
            >
              ✨ Create New Event
            </button>
          </div>
        </div>

        {/* Back to Events List */}
        {selectedEvent && (
          <button
            onClick={() => setSelectedEvent(null)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all flex items-center gap-2"
          >
            <span>←</span> Back to Events
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-white py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading gallery events...</p>
        </div>
      ) : selectedEvent ? (
        /* Event Detail View */
        <EventDetailView
          event={selectedEvent}
          onBack={() => setSelectedEvent(null)}
          onEdit={() => setShowEditEventModal(true)}
          onAddImages={() => setShowAddImagesModal(true)}
          onDeleteImage={handleDeleteImage}
          onToggleVisibility={toggleImageVisibility}
          onSetDisplayImage={setDisplayImage}
        />
      ) : (
        /* Events Grid View */
        <div>
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-gray-400 text-lg mb-4">No gallery events yet</p>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.folder_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#F24DC2]/30 transition-all cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {event.displayImage || event.images[0]?.image_url ? (
                      <img
                        src={event.displayImage || event.images[0]?.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                        📁
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Image Count Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {event.images.length} photos
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F24DC2] group-hover:to-[#2C97FF] transition-all">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.subtitle}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📅 {event.date}</span>
                      <span>👥 {event.participants}</span>
                    </div>

                    {/* Delete Event Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteEvent(event.folder_name)
                      }}
                      className="mt-4 w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all border border-red-500/30"
                    >
                      🗑️ Delete Event
                    </button>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showAddEventModal && (
          <EventModal
            title="Create New Gallery Event"
            event={newEvent}
            gradientOptions={gradientOptions}
            onSave={handleCreateEvent}
            onClose={() => setShowAddEventModal(false)}
            onChange={setNewEvent}
          />
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditEventModal && selectedEvent && (
          <EventModal
            title="Edit Event Details"
            event={selectedEvent}
            gradientOptions={gradientOptions}
            onSave={handleUpdateEvent}
            onClose={() => setShowEditEventModal(false)}
            onChange={setSelectedEvent}
          />
        )}
      </AnimatePresence>

      {/* Add Images Modal */}
      <AnimatePresence>
        {showAddImagesModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddImagesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1b3d] border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add Images to {selectedEvent.title}</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Images (multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadImages}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#F24DC2] file:to-[#2C97FF] file:text-white file:cursor-pointer file:font-bold hover:file:opacity-90"
                />
                {uploading && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                    <span className="text-sm">Uploading images...</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAddImagesModal(false)}
                disabled={uploading}
                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all disabled:opacity-50"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Event Modal Component
function EventModal({ 
  title, 
  event, 
  gradientOptions, 
  onSave, 
  onClose, 
  onChange 
}: { 
  title: string
  event: any
  gradientOptions: { name: string; value: string }[]
  onSave: () => void
  onClose: () => void
  onChange: (event: any) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0d1b3d] border border-white/10 rounded-2xl p-8 max-w-2xl w-full my-8"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-6">
          {title}
        </h2>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Folder Name (Unique ID) *
            </label>
            <input
              type="text"
              value={event.folder_name}
              onChange={(e) => onChange({ ...event, folder_name: e.target.value })}
              placeholder="e.g., MATLAB, HACKATHON_2024"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => onChange({ ...event, title: e.target.value })}
              placeholder="e.g., MATLAB Workshop 2024"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={event.subtitle}
              onChange={(e) => onChange({ ...event, subtitle: e.target.value })}
              placeholder="Brief tagline for the event"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={event.description}
              onChange={(e) => onChange({ ...event, description: e.target.value })}
              placeholder="Detailed description of the event"
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                type="text"
                value={event.date}
                onChange={(e) => onChange({ ...event, date: e.target.value })}
                placeholder="e.g., March 15-16, 2024"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={event.duration}
                onChange={(e) => onChange({ ...event, duration: e.target.value })}
                placeholder="e.g., 2 Days"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Participants
              </label>
              <input
                type="text"
                value={event.participants}
                onChange={(e) => onChange({ ...event, participants: e.target.value })}
                placeholder="e.g., 50+ Students"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color Gradient
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gradientOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...event, gradient: option.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    event.gradient === option.value
                      ? 'border-white scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className={`h-8 rounded bg-gradient-to-r ${option.value} mb-2`}></div>
                  <p className="text-xs text-gray-400 text-center">{option.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
          >
            Save Event
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Event Detail View Component
function EventDetailView({
  event,
  onBack,
  onEdit,
  onAddImages,
  onDeleteImage,
  onToggleVisibility,
  onSetDisplayImage
}: {
  event: GalleryEvent
  onBack: () => void
  onEdit: () => void
  onAddImages: () => void
  onDeleteImage: (id: string) => void
  onToggleVisibility: (image: GalleryImage) => void
  onSetDisplayImage: (url: string) => void
}) {
  return (
    <div>
      {/* Event Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-2">
              {event.title}
            </h2>
            <p className="text-gray-400 text-lg mb-4">{event.subtitle}</p>
            <p className="text-gray-300 mb-4">{event.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-gray-300">📅 {event.date}</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-gray-300">⏱️ {event.duration}</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-gray-300">👥 {event.participants}</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-gray-300">📁 {event.folder_name}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
            >
              ✏️ Edit
            </button>
            <button
              onClick={onAddImages}
              className="px-4 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
            >
              📸 Add Images
            </button>
          </div>
        </div>

        {/* Gradient Preview */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Event Color Theme:</p>
          <div className={`h-16 rounded-xl bg-gradient-to-r ${event.gradient}`}></div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            Event Images ({event.images.length})
          </h3>
        </div>

        {event.images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-400 mb-4">No images yet</p>
            <button
              onClick={onAddImages}
              className="px-6 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold"
            >
              Upload First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {event.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#F24DC2]/30 transition-all"
              >
                {/* Display Image Star */}
                {event.displayImage === image.image_url && (
                  <div className="absolute top-2 left-2 z-20 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    ⭐ Display
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square bg-gray-800 overflow-hidden relative">
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Visibility Overlay */}
                  {!image.is_visible && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🙈 Hidden</span>
                    </div>
                  )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => onSetDisplayImage(image.image_url)}
                    className="w-full px-2 py-1 bg-yellow-500/80 hover:bg-yellow-500 text-white rounded text-xs font-bold transition-colors"
                  >
                    ⭐ Set as Display
                  </button>
                  <button
                    onClick={() => onToggleVisibility(image)}
                    className={`w-full px-2 py-1 rounded text-xs font-bold transition-colors ${
                      image.is_visible
                        ? 'bg-green-500/80 hover:bg-green-500 text-white'
                        : 'bg-gray-500/80 hover:bg-gray-500 text-white'
                    }`}
                  >
                    {image.is_visible ? '👁️ Visible' : '🙈 Hidden'}
                  </button>
                  <button
                    onClick={() => onDeleteImage(image.id)}
                    className="w-full px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Caption */}
                <div className="p-2 bg-black/40">
                  <p className="text-xs text-gray-300 truncate">{image.caption || 'No caption'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
