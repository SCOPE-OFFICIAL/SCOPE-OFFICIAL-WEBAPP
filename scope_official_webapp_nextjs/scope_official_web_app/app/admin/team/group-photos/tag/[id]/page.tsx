'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GroupPhoto, PhotoTag, TeamMember } from '@/lib/types/database'

interface TagPosition {
  x: number // percentage
  y: number // percentage
}

export default function TagPhotoPage() {
  const router = useRouter()
  const params = useParams()
  const photoId = params.id as string  // Keep as string (UUID)
  
  const [photo, setPhoto] = useState<GroupPhoto | null>(null)
  const [tags, setTags] = useState<PhotoTag[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isTagging, setIsTagging] = useState(false)
  const [newTagPosition, setNewTagPosition] = useState<TagPosition | null>(null)
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [customName, setCustomName] = useState('')
  
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router, photoId])

  const fetchData = async () => {
    try {
      // Fetch photo with tags
      const photoRes = await fetch(`/api/group-photos?withTags=true`)
      const photoData = await photoRes.json()
      
      const foundPhoto = photoData.photos?.find((p: GroupPhoto) => p.id === photoId)
      
      if (foundPhoto) {
        setPhoto(foundPhoto)
        setTags(foundPhoto.tags || [])
      }

      // Fetch team members
      const membersRes = await fetch('/api/team')
      const membersData = await membersRes.json()
      setTeamMembers(membersData.members || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTagging || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNewTagPosition({ x, y })
  }

  const handleAddTag = async () => {
    if (!newTagPosition) return

    const name = selectedMember 
      ? teamMembers.find(m => m.id === selectedMember)?.name || customName
      : customName

    if (!name) {
      alert('Please select a team member or enter a custom name')
      return
    }

    try {
      const res = await fetch('/api/photo-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_id: photoId,
          team_member_id: selectedMember || null,
          person_name: name,
          position_x: newTagPosition.x,
          position_y: newTagPosition.y,
        }),
      })

      if (res.ok) {
        const { tag } = await res.json()
        setTags([...tags, tag])
        setNewTagPosition(null)
        setSelectedMember('')
        setCustomName('')
        setIsTagging(false)
      } else {
        alert('Failed to add tag')
      }
    } catch (error) {
      console.error('Error adding tag:', error)
      alert('Error adding tag')
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Remove this tag?')) return

    try {
      const res = await fetch(`/api/photo-tags?id=${tagId}`, { method: 'DELETE' })
      
      if (res.ok) {
        setTags(tags.filter(t => t.id !== tagId))
      } else {
        alert('Failed to delete tag')
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
      alert('Error deleting tag')
    }
  }

  const cancelTagging = () => {
    setIsTagging(false)
    setNewTagPosition(null)
    setSelectedMember('')
    setCustomName('')
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tag People in Photo</h1>
            <p className="text-gray-400">{photo.title}</p>
          </div>
          <button
            onClick={() => router.push('/admin/team/group-photos')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Photos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-white font-semibold text-lg">
                  {isTagging ? '👆 Click on a person to tag them' : '✨ Photo Tagging'}
                </h2>
                <button
                  onClick={() => isTagging ? cancelTagging() : setIsTagging(true)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isTagging
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white'
                  }`}
                >
                  {isTagging ? 'Cancel Tagging' : '+ Add New Tag'}
                </button>
              </div>

              {/* Interactive Photo */}
              <div
                ref={imageRef}
                onClick={handleImageClick}
                className={`relative bg-black rounded-lg overflow-hidden ${
                  isTagging ? 'cursor-crosshair' : 'cursor-default'
                }`}
                style={{ maxHeight: '600px' }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Image failed to load:', photo.image_url)
                    console.error('Error event:', e)
                  }}
                  onLoad={() => console.log('Image loaded successfully:', photo.image_url)}
                />

                {/* Existing Tags */}
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="absolute group"
                    style={{
                      left: `${tag.position_x}%`,
                      top: `${tag.position_y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Tag Marker */}
                    <div className="w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-500 transition">
                      <span className="text-white text-xs font-bold">👤</span>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                        {tag.person_name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                      </div>
                    </div>

                    {/* Delete Button (on hover) */}
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition text-xs font-bold hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* New Tag Preview */}
                {newTagPosition && (
                  <div
                    className="absolute"
                    style={{
                      left: `${newTagPosition.x}%`,
                      top: `${newTagPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="w-8 h-8 bg-green-600 border-4 border-white rounded-full shadow-lg animate-pulse flex items-center justify-center">
                      <span className="text-white text-xs font-bold">?</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-gray-400 text-sm">
                <p>💡 <strong>Tip:</strong> Click &quot;Add New Tag&quot; button, then click on a person&apos;s face in the photo to tag them.</p>
                <p className="mt-1">Current tags: <strong className="text-white">{tags.length}</strong></p>
              </div>
            </div>
          </div>

          {/* Tag Form & List */}
          <div className="space-y-6">
            {/* Tag Form */}
            {newTagPosition && (
              <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-6 border border-green-600">
                <h3 className="text-white font-semibold text-lg mb-4">🏷️ Name This Person</h3>
                
                {/* Select Existing Member */}
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Select Team Member</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => {
                      setSelectedMember(e.target.value)
                      setCustomName('')
                    }}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
                  >
                    <option value="">-- Or enter custom name below --</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Or Custom Name */}
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Or Custom Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value)
                      setSelectedMember('')
                    }}
                    placeholder="Enter name..."
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTag}
                    className="flex-1 px-4 py-2 bg-white text-green-900 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Save Tag
                  </button>
                  <button
                    onClick={cancelTagging}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tagged Members List */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold text-lg mb-4">
                👥 Tagged Members ({tags.length})
              </h3>
              
              {tags.length === 0 ? (
                <p className="text-gray-400 text-sm">No tags yet. Click &quot;Add New Tag&quot; to start tagging people!</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {tags.map((tag, index) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400 font-bold">{index + 1}.</span>
                        <div>
                          <p className="text-white font-semibold">{tag.person_name}</p>
                          <p className="text-gray-400 text-xs">
                            Position: {tag.position_x.toFixed(1)}%, {tag.position_y.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
