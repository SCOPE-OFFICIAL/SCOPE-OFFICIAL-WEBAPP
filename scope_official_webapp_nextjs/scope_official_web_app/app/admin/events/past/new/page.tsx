'use client'

import { useState } from 'react'
import Typeahead from '../../../../components/Typeahead'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NewPastEventPage() {
const router = useRouter()

const [loading, setLoading] = useState(false)
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

const handleChange = (e: any) => {
const { name, value, type, checked } = e.target

setFormData(prev => ({
  ...prev,
  [name]:
    type === 'checkbox'
      ? checked
      : type === 'number'
      ? parseInt(value) || 0
      : value
}))


}

const handlePosterUpload = async (e: any) => {
const file = e.target.files?.[0]
if (!file) return


const reader = new FileReader()
reader.onloadend = () => setPosterPreview(reader.result as string)
reader.readAsDataURL(file)

try {
  setUploading(true)

  const upload = new FormData()
  upload.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: upload
  })

  const data = await res.json()

  if (res.ok && data.url) {
    setFormData(prev => ({
      ...prev,
      poster_image_url: data.url
    }))
  } else {
    alert('Upload failed')
  }
} catch (err) {
  console.error(err)
  alert('Upload error')
} finally {
  setUploading(false)
}


}

const handleSubmit = async (e: any) => {
e.preventDefault()


if (!formData.event_name || !formData.poster_image_url) {
  alert('Fill all required fields')
  return
}

try {
  setLoading(true)

  const res = await fetch('/api/past-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.error)
    return
  }

  alert('✅ Event added successfully!')
  router.push('/admin/events')

} catch (err) {
  console.error(err)
  alert('Error')
} finally {
  setLoading(false)
}


}

return ( <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8 text-white">


  {/* Header */}
  <div className="mb-10">
    <button
      onClick={() => router.back()}
      className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition"
    >
      ← Back
    </button>

    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] bg-clip-text text-transparent">
      Add Past Event
    </h1>

    <p className="text-gray-400 mt-2">
      Upload and manage past event posters
    </p>
  </div>

  {/* Form */}
  <motion.form
    onSubmit={handleSubmit}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 space-y-6"
  >

    {/* Event Name */}
    <div>
      <label className="block mb-2 text-gray-300">Event Name *</label>
      <input
        name="event_name"
        placeholder="Enter event name"
        onChange={handleChange}
        value={formData.event_name}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
      />
    </div>

    {/* Upload */}
    <div>
      <label className="block mb-2 text-gray-300">Poster *</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePosterUpload}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg file:bg-[#F24DC2] file:border-0 file:px-4 file:py-2 file:text-white file:rounded-lg"
      />

      {uploading && (
        <p className="text-yellow-400 mt-2">Uploading...</p>
      )}

      {posterPreview && (
        <img
          src={posterPreview}
          className="mt-4 w-full h-72 object-cover rounded-lg border border-white/10"
        />
      )}
    </div>

    {/* Display Order */}
    <div>
      <label className="block mb-2 text-gray-300">Display Order</label>
      <input
        type="number"
        name="display_order"
        onChange={handleChange}
        value={formData.display_order}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block mb-2 text-gray-300">Description</label>
      <textarea
        name="description"
        onChange={handleChange}
        value={formData.description}
        rows={4}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
      />
    </div>

    {/* Folder */}
    <div>
      <label className="block mb-2 text-gray-300">Gallery Folder</label>
      <Typeahead
        value={formData.gallery_folder}
        onChange={(v) =>
          setFormData(prev => ({ ...prev, gallery_folder: v }))
        }
      />
    </div>

    {/* Visibility */}
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        name="is_visible"
        checked={formData.is_visible}
        onChange={handleChange}
      />
      <span>Visible</span>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="px-6 py-3 bg-white/10 rounded-lg"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading || uploading}
        className="px-8 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-lg"
      >
        {loading ? 'Saving...' : 'Add Event'}
      </button>
    </div>

  </motion.form>
</div>


)
}
