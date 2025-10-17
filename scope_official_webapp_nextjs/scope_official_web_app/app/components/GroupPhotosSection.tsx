'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GroupPhoto, PhotoTag } from '@/lib/types/database'
import PhotoModal from './PhotoModal'

export default function GroupPhotosSection() {
  const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<GroupPhoto | null>(null)
  const [selectedPhotoTags, setSelectedPhotoTags] = useState<PhotoTag[]>([])

  useEffect(() => {
    fetchGroupPhotos()
  }, [])

  const fetchGroupPhotos = async () => {
    try {
      const res = await fetch('/api/group-photos?withTags=true')
      const data = await res.json()
      const visiblePhotos = (data.photos || []).filter((p: GroupPhoto) => p.is_visible)
      setGroupPhotos(visiblePhotos)
    } catch (error) {
      console.error('Error fetching group photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (photo: GroupPhoto) => {
    setSelectedPhoto(photo)
    setSelectedPhotoTags(photo.tags || [])
  }

  const closeModal = () => {
    setSelectedPhoto(null)
    setSelectedPhotoTags([])
  }

  // Group photos by category
  const photosByCategory = groupPhotos.reduce((acc, photo) => {
    if (!acc[photo.category]) {
      acc[photo.category] = []
    }
    acc[photo.category].push(photo)
    return acc
  }, {} as Record<string, GroupPhoto[]>)

  const categories = Object.keys(photosByCategory).sort()

  // Category display names
  const categoryNames: Record<string, string> = {
    'team': 'Core Team',
    'social-relations': 'Social Relations Team',
    'technical': 'Technical Team',
    'marketing': 'Marketing Team',
    'design': 'Design Team',
    'event': 'Events Team',
    'other': 'Other Teams'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">Loading team photos...</div>
      </div>
    )
  }

  if (groupPhotos.length === 0) {
    return null // Don't show section if no photos
  }

  return (
    <>
      <motion.section
        className="group-photos-section py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              TEAM PHOTOS
            </h2>
            <p className="text-gray-400 text-lg">
              Our teams in action • Click any photo to view tagged members
            </p>
          </motion.div>

          {/* Photos by Category */}
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              className="mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category Title */}
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
                {categoryNames[category] || category}
              </h3>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photosByCategory[category].map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-700 hover:border-purple-500 transition-all shadow-lg hover:shadow-2xl"
                    onClick={() => openModal(photo)}
                  >
                    {/* Photo */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Tag Count Badge */}
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full flex items-center gap-1">
                          <span>👥</span>
                          <span>{photo.tags.length}</span>
                        </div>
                      )}

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-bold text-lg mb-1">
                          {photo.title}
                        </h4>
                        {photo.description && (
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                      </div>

                      {/* Hover Hint */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                        <div className="text-center">
                          <div className="text-white text-lg font-semibold mb-1">
                            Click to View
                          </div>
                          <div className="text-purple-400 text-sm">
                            👆 Hover over faces to see names
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tagged Members Preview (Bottom) */}
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="p-4 bg-gray-900/50">
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded"
                            >
                              {tag.person_name}
                            </span>
                          ))}
                          {photo.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                              +{photo.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          tags={selectedPhotoTags}
          onClose={closeModal}
        />
      )}
    </>
  )
}
