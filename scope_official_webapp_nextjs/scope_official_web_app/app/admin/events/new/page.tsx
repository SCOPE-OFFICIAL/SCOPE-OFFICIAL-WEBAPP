'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    event_date: '',
    event_time: '',
    location: '',
    image_url: '',
    banner_image_url: '',
    poster_image_url: '',
    registration_link: '',
    speaker: '',
    registration_fee: 'FREE',
    what_to_expect: '',
    what_you_get: '',
    event_type: 'workshop',
    status: 'published',
    is_featured: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const uploadImageToImgBB = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/events', {
      method: 'POST',
      body: fd
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.imageUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const url = await uploadImageToImgBB(file)
      setFormData(prev => ({ ...prev, image_url: url }))
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError((error as Error).message)
      alert('Error uploading image: ' + (error as Error).message)
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploadingBanner(true)
      const url = await uploadImageToImgBB(file)
      setFormData(prev => ({ ...prev, banner_image_url: url }))
      alert('Banner image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError((error as Error).message)
      alert('Error uploading banner image: ' + (error as Error).message)
      setBannerPreview(null)
    } finally {
      setUploadingBanner(false)
    }
  }

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPosterPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploadingPoster(true)
      const url = await uploadImageToImgBB(file)
      setFormData(prev => ({ ...prev, poster_image_url: url }))
      alert('Poster image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError((error as Error).message)
      alert('Error uploading poster image: ' + (error as Error).message)
      setPosterPreview(null)
    } finally {
      setUploadingPoster(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.event_date) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create event')
      }

      const data = await response.json()

      if (data.success) {
        alert('Event created successfully!')
        router.push('/admin/events')
      } else {
        alert('Failed to create event: ' + data.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Error creating event: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
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
          Create New Event
        </h1>
        <p className="text-gray-400 mt-2">Fill in the details to add a new event</p>
      </div>

      {uploadError && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          <strong>Upload Error:</strong> {uploadError}
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="e.g., Hackathon 2025"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description (for hexagon preview)
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              maxLength={100}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
              placeholder="Brief one-line description (max 100 chars)"
            />
          </div>

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
              placeholder="Detailed event description..."
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
              placeholder="e.g., Main Auditorium"
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
              placeholder="https://forms.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speaker / Host
            </label>
            <input
              type="text"
              name="speaker"
              value={formData.speaker}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
              placeholder="e.g., Dr. Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registration Fee
            </label>
            <input
              type="text"
              name="registration_fee"
              value={formData.registration_fee}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
              placeholder="e.g., FREE or $50 or ₹500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What to Expect
            </label>
            <textarea
              name="what_to_expect"
              value={formData.what_to_expect}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
              placeholder="Describe what attendees can expect from this event..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What You&apos;ll Get
            </label>
            <textarea
              name="what_you_get"
              value={formData.what_you_get}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
              placeholder="List benefits (e.g., certificate, swag, networking...)..."
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] [&>option]:bg-[#0d1b3d]"
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] [&>option]:bg-[#0d1b3d]"
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
              Event Image (Main)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2C97FF] file:text-white file:cursor-pointer hover:file:bg-[#1a7de0] disabled:opacity-50"
            />
            {uploading && <p className="text-yellow-400 text-sm mt-2">Uploading...</p>}
            {imagePreview && (
              <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Banner Image (for event card header)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F24DC2] file:text-white file:cursor-pointer hover:file:bg-[#d83da7] disabled:opacity-50"
            />
            {uploadingBanner && <p className="text-yellow-400 text-sm mt-2">Uploading banner...</p>}
            {bannerPreview && (
              <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                <img src={bannerPreview} alt="Banner Preview" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poster Image (slides in event card)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              disabled={uploadingPoster}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2C97FF] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#F24DC2] file:to-[#2C97FF] file:text-white file:cursor-pointer hover:file:opacity-90 disabled:opacity-50"
            />
            {uploadingPoster && <p className="text-yellow-400 text-sm mt-2">Uploading poster...</p>}
            {posterPreview && (
              <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                <img src={posterPreview} alt="Poster Preview" className="w-full h-64 object-cover" />
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
            disabled={loading || uploading || uploadingBanner || uploadingPoster}
            className="px-8 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-bold disabled:opacity-50"
          >
            {loading ? 'Creating...' : '✨ Create Event'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}