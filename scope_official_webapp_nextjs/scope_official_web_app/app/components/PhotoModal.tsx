'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GroupPhoto, PhotoTag } from '@/lib/types/database'

interface PhotoModalProps {
  photo: GroupPhoto
  tags: PhotoTag[]
  onClose: () => void
}

export default function PhotoModal({ photo, tags, onClose }: PhotoModalProps) {
  const [hoveredTag, setHoveredTag] = useState<PhotoTag | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Find if hovering over any tag (within 5% radius)
    const hoveredTag = tags.find(tag => {
      const distance = Math.sqrt(
        Math.pow(tag.position_x - x, 2) + Math.pow(tag.position_y - y, 2)
      )
      return distance < 8 // 8% radius for hover detection
    })

    setHoveredTag(hoveredTag || null)
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl font-bold transition backdrop-blur-sm"
        >
          ×
        </button>

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative max-w-6xl max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Photo Info Header */}
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{photo.title}</h2>
            {photo.description && (
              <p className="text-gray-400">{photo.description}</p>
            )}
            {tags.length > 0 && (
              <p className="text-purple-400 text-sm mt-2">
                👥 {tags.length} {tags.length === 1 ? 'member' : 'members'} tagged • Hover over faces to see names
              </p>
            )}
          </div>

          {/* Interactive Photo (responsive & scrollable on mobile) */}
          <div 
            className="relative bg-black rounded-lg overflow-auto shadow-2xl cursor-crosshair max-h-[65vh] sm:max-h-[70vh] touch-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredTag(null)}
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <div className="w-full flex items-center justify-center">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="max-w-full w-auto h-auto max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
              />
            </div>

            {/* Invisible Hotspots */}
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="absolute w-16 h-16 rounded-full"
                style={{
                  left: `${tag.position_x}%`,
                  top: `${tag.position_y}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>

          {/* Floating Tooltip */}
          {hoveredTag && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed pointer-events-none z-50"
              style={{
                left: mousePos.x + 15,
                top: mousePos.y - 10,
              }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-xl border-2 border-white/20">
                <p className="font-semibold text-sm whitespace-nowrap">
                  {hoveredTag.person_name}
                </p>
              </div>
              {/* Arrow */}
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-purple-600"></div>
            </motion.div>
          )}

          {/* Tagged Members List */}
          {tags.length > 0 && (
            <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">👥</span>
                Tagged Members:
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white text-sm rounded-full border border-purple-500/30"
                  >
                    {tag.person_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
