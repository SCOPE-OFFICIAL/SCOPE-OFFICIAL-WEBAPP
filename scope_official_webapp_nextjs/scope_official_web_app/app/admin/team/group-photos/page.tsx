'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GroupPhoto } from '@/lib/types/database'

export default function GroupPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<GroupPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchPhotos()
  }, [router])

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/group-photos?withTags=true')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also remove all tags.`)) return

    try {
      const res = await fetch(`/api/group-photos?id=${id}`, { method: 'DELETE' })
      
      if (res.ok) {
        fetchPhotos()
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
      alert('Error deleting photo')
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const res = await fetch('/api/group-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_visible: !currentVisibility }),
      })

      if (res.ok) {
        fetchPhotos()
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const filteredPhotos = photos.filter(photo => {
    if (filter === 'all') return true
    return photo.category === filter
  })

  const categories = ['all', ...new Set(photos.map(p => p.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Group Photo Management</h1>
            <p className="text-gray-400">Upload team photos and tag members interactively</p>
          </div>
          <Link
            href="/admin/team"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Team
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link
            href="/admin/team/group-photos/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition"
          >
            + Upload Group Photo
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                filter === cat
                  ? 'bg-white text-purple-900 font-semibold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat} ({cat === 'all' ? photos.length : photos.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No group photos found</p>
            <p className="text-gray-500 mt-2">Upload your first team photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition"
              >
                {/* Photo */}
                <div className="relative h-64 bg-gray-700 overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  {!photo.is_visible && (
                    <div className="absolute top-2 right-2 px-3 py-1 bg-red-900/80 text-red-200 text-xs font-semibold rounded-full">
                      Hidden
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-3 py-1 bg-blue-900/80 text-blue-200 text-xs font-semibold rounded-full">
                    {photo.tags?.length || 0} tags
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{photo.title}</h3>
                      <span className="text-purple-400 text-sm capitalize">{photo.category}</span>
                    </div>
                  </div>

                  {photo.description && (
                    <p className="text-gray-300 text-sm mb-4">{photo.description}</p>
                  )}

                  {/* Tagged Members */}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-2">Tagged:</p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 5).map(tag => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded"
                          >
                            {tag.person_name}
                          </span>
                        ))}
                        {photo.tags.length > 5 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                            +{photo.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/team/group-photos/tag/${photo.id}`}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg text-sm font-semibold transition"
                      >
                        Tag People
                      </Link>
                      <Link
                        href={`/admin/team/group-photos/edit/${photo.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg text-sm font-semibold transition"
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVisibility(photo.id, photo.is_visible)}
                        className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-semibold transition ${
                          photo.is_visible
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {photo.is_visible ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id, photo.title)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
