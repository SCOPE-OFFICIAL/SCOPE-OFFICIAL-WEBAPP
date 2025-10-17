'use client'

import { useState, useEffect } from 'react'
import { GroupPhoto, PhotoTag } from '@/lib/types/database'

interface MemberPhotoAppearancesProps {
  memberName: string
  memberId?: string
}

export default function MemberPhotoAppearances({ memberName }: MemberPhotoAppearancesProps) {
  const [appearances, setAppearances] = useState<GroupPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppearances()
  }, [memberName])

  const fetchAppearances = async () => {
    try {
      const res = await fetch('/api/group-photos?withTags=true')
      const data = await res.json()
      
      // Filter photos where this member is tagged
      const memberPhotos = (data.photos || []).filter((photo: GroupPhoto) => 
        photo.tags?.some((tag: PhotoTag) => 
          tag.person_name.toLowerCase() === memberName.toLowerCase()
        )
      )
      
      setAppearances(memberPhotos)
    } catch (error) {
      console.error('Error fetching appearances:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || appearances.length === 0) {
    return null
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-700">
      <p className="text-gray-400 text-xs mb-2">
        📸 Appears in {appearances.length} team {appearances.length === 1 ? 'photo' : 'photos'}:
      </p>
      <div className="flex flex-wrap gap-1">
        {appearances.map((photo) => (
          <span
            key={photo.id}
            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
            title={photo.description || ''}
          >
            {photo.title}
          </span>
        ))}
      </div>
    </div>
  )
}
