'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface GroupPhoto {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  is_visible: boolean
  display_order: number
}

export default function EditGroupPhotoPage() {
  const router = useRouter()
  const params = useParams()
  const photoId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photo, setPhoto] = useState<GroupPhoto | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'team',
    is_visible: true,
    display_order: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchPhoto()
  }, [photoId, router])

  const fetchPhoto = async () => {
    try {
      const res = await fetch('/api/group-photos')
      const data = await res.json()
      const foundPhoto = data.photos?.find((p: GroupPhoto) => p.id === photoId)
      
      if (foundPhoto) {
        setPhoto(foundPhoto)
        setFormData({
          title: foundPhoto.title,
          description: foundPhoto.description || '',
          category: foundPhoto.category,
          is_visible: foundPhoto.is_visible,
          display_order: foundPhoto.display_order
        })
      } else {
        alert('Photo not found')
        router.push('/admin/team/group-photos')
      }
    } catch (error) {
      console.error('Error fetching photo:', error)
      alert('Error loading photo')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/group-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: photoId,
          ...formData
        })
      })

      if (res.ok) {
        alert('Photo updated successfully!')
        router.push('/admin/team/group-photos')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update photo')
      }
    } catch (error) {
      console.error('Error updating photo:', error)
      alert('Error updating photo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Photo not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Edit Group Photo</h1>
            <p className="text-gray-400">Update photo details and settings</p>
          </div>
          <Link
            href="/admin/team/group-photos"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Photos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Current Photo</h2>
            <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Current Title:</span>
                <p className="text-white font-semibold">{photo.title}</p>
              </div>
              {photo.description && (
                <div>
                  <span className="text-gray-400 text-sm">Current Description:</span>
                  <p className="text-gray-300 text-sm">{photo.description}</p>
                </div>
              )}
              <div>
                <span className="text-gray-400 text-sm">Category:</span>
                <p className="text-purple-400 capitalize">{photo.category}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Status:</span>
                <p className={photo.is_visible ? 'text-green-400' : 'text-red-400'}>
                  {photo.is_visible ? 'Visible' : 'Hidden'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Edit Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g., Technical Team 2024"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of the photo..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                >
                  <option value="team">Team</option>
                  <option value="technical">Technical</option>
                  <option value="design">Design</option>
                  <option value="events">Events</option>
                  <option value="pr">Public Relations</option>
                  <option value="coordinators">Coordinators</option>
                  <option value="leads">Team Leads</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-400 text-xs mt-1">Lower numbers appear first</p>
              </div>

              {/* Visibility */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="w-5 h-5 text-purple-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-white font-semibold">
                    Visible on public website
                  </span>
                </label>
                <p className="text-gray-400 text-xs mt-1 ml-8">
                  Uncheck to hide this photo from public view
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/admin/team/group-photos"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/team/group-photos/tag/${photoId}`}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              🏷️ Tag People in This Photo
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete "${photo.title}"? This will also remove all tags.`)) {
                  fetch(`/api/group-photos?id=${photoId}`, { method: 'DELETE' })
                    .then(() => {
                      alert('Photo deleted successfully')
                      router.push('/admin/team/group-photos')
                    })
                    .catch(() => alert('Error deleting photo'))
                }
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              🗑️ Delete Photo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
