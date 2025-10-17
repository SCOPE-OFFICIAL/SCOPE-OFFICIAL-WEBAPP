/**
 * Edit Event Page
 * Update existing event with all fields
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    event_date: '',
    event_time: '',
    location: '',
    image_url: '',
    registration_link: '',
    event_type: 'workshop',
    status: 'published',
    is_featured: false
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchEvent()
  }, [eventId, router])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      const data = await response.json()
      
      const event = data.events?.find((e: any) => e.id === eventId)
      
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          short_description: event.short_description || '',
          event_date: event.event_date || '',
          event_time: event.event_time || '',
          location: event.location || '',
          image_url: event.image_url || '',
          registration_link: event.registration_link || '',
          event_type: event.event_type || 'workshop',
          status: event.status || 'published',
          is_featured: event.is_featured || false
        })
        
        if (event.image_url) {
          setImagePreview(event.image_url)
        }
      } else {
        alert('Event not found')
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
      alert('Error loading event')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('bucket', 'event-images')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, image_url: data.url }))
        alert('Image uploaded successfully!')
      } else {
        alert('Failed to upload image: ' + data.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.event_date) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, ...formData })
      })

      if (response.ok) {
        alert('Event updated successfully!')
        router.push('/admin/events')
      } else {
        const data = await response.json()
        alert('Failed to update event: ' + data.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Error updating event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040a28]">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
          Edit Event
        </h1>
        <p className="text-gray-400 mt-2">Update event details</p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              maxLength={100}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Time
            </label>
            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registration Link
            </label>
            <input
              type="url"
              name="registration_link"
              value={formData.registration_link}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Type
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            >
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="webinar">Webinar</option>
              <option value="competition">Competition</option>
              <option value="meetup">Meetup</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:ring-2 focus:ring-[#2C97FF]"
            />
            <label htmlFor="is_featured" className="text-gray-300">
              ⭐ Mark as Featured Event
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2C97FF] file:text-white file:cursor-pointer hover:file:bg-[#1a7de0]"
            />
            {uploading && <p className="text-yellow-400 text-sm mt-2">Uploading...</p>}
            {imagePreview && (
              <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
