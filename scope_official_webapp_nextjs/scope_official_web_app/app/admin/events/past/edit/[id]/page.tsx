/**
 * Edit Past Event Page (Firebase + ImgBB Version)
 */

'use client'

import { useEffect, useState } from 'react'
import Typeahead from '../../../../../components/Typeahead'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function EditPastEventPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    event_name: '',
    poster_image_url: '',
    display_order: 0,
    is_visible: true,
    description: '',
    gallery_folder: ''
  })

  useEffect(() => {
    if (id) fetchPastEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchPastEvent = async () => {
    try {
      setFetching(true)
      const res = await fetch('/api/past-events')
      const data = await res.json()
      const event = data.pastEvents?.find((e: { id: string }) => e.id === id)

      if (event) {
        setFormData({
          event_name: event.event_name ?? '',
          poster_image_url: event.poster_image_url ?? '',
          display_order: event.display_order ?? 0,
          is_visible: event.is_visible ?? true,
          description: event.description ?? '',
          gallery_folder: event.gallery_folder ?? ''
        })
        setPosterPreview(event.poster_image_url ?? null)
      } else {
        alert('Past event not found')
        router.push('/admin/events')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      alert('Error loading past event')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setPosterPreview(reader.result as string)
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const upload = new FormData()
      upload.append('file', file)
      upload.append('bucket', 'past-event-posters') // compatibility param, unused by ImgBB

      const res = await fetch('/api/upload', { method: 'POST', body: upload })
      const data = await res.json()

      if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, poster_image_url: data.url }))
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading poster')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.event_name || !formData.poster_image_url) {
      alert('Please fill in event name and upload a poster image')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/past-events?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Past event updated successfully!')
        router.push('/admin/events')
      } else {
        const data = await res.json()
        alert('Failed to update past event: ' + data.error)
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Error updating past event')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
          <p className="mt-4">Loading past event...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
          Edit Past Event
        </h1>
        <p className="text-gray-400 mt-2">Update past event details</p>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
      >
        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              required
              placeholder="e.g., MATLAB Workshop 2024"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Poster <span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F24DC2] file:text-white file:cursor-pointer hover:file:bg-[#d83da7]"
            />
            {uploading && (
              <p className="text-yellow-400 text-sm mt-2">⏳ Uploading to ImgBB...</p>
            )}
            {!uploading && formData.poster_image_url && (
              <p className="text-green-400 text-sm mt-2">✅ Image ready</p>
            )}
            {posterPreview && (
              <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={posterPreview} alt="Poster Preview" className="w-full h-96 object-cover" />
              </div>
            )}
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
            <p className="text-gray-500 text-xs mt-1">Lower numbers appear first in the carousel</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short description for the past event"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
            />
          </div>

          {/* Gallery Folder */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gallery Folder (optional)
            </label>
            <Typeahead
              value={formData.gallery_folder}
              onChange={(v) => setFormData(prev => ({ ...prev, gallery_folder: v }))}
              placeholder="Type to search or enter a folder name"
            />
            <p className="text-gray-500 text-xs mt-1">Choose an existing gallery folder to link photos</p>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_visible"
              id="is_visible"
              checked={formData.is_visible}
              onChange={handleChange}
              className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:ring-2 focus:ring-[#2C97FF]"
            />
            <label htmlFor="is_visible" className="text-gray-300">
              👁️ Make visible on events page
            </label>
          </div>
        </div>

        {/* Actions */}
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
            disabled={loading || uploading || !formData.event_name || !formData.poster_image_url}
            className="px-8 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : '💾 Update Past Event'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
