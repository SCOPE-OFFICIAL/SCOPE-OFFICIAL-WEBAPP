'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { GroupPhotoFormData } from '@/lib/types/database'

export default function NewGroupPhotoPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<GroupPhotoFormData>()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'team-photos')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setValue('image_url', url)
        setImagePreview(url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: GroupPhotoFormData) => {
    if (!data.image_url) {
      alert('Please upload an image first')
      return
    }

    try {
      const res = await fetch('/api/group-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const { photo } = await res.json()
        // Redirect to tagging page
        router.push(`/admin/team/group-photos/tag/${photo.id}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to upload photo')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Upload Group Photo</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Group Photo *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {uploading && <p className="text-blue-400 mt-2">Uploading...</p>}
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-contain rounded-lg bg-black" />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g., Core Team 2024, Social Relations Team"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {errors.title && <p className="text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief description of the photo"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 [&>option]:bg-gray-700 [&>option]:text-white"
            >
              <option value="team" className="bg-gray-700 text-white">Core Team</option>
              <option value="social-relations" className="bg-gray-700 text-white">Social Relations</option>
              <option value="technical" className="bg-gray-700 text-white">Technical Team</option>
              <option value="marketing" className="bg-gray-700 text-white">Marketing Team</option>
              <option value="design" className="bg-gray-700 text-white">Design Team</option>
              <option value="event" className="bg-gray-700 text-white">Event Team</option>
              <option value="other" className="bg-gray-700 text-white">Other</option>
            </select>
            {errors.category && <p className="text-red-400 mt-1">{errors.category.message}</p>}
          </div>

          {/* Display Order */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Display Order</label>
            <input
              {...register('display_order', { valueAsNumber: true })}
              type="number"
              defaultValue={0}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            <p className="text-gray-400 text-sm mt-1">Lower numbers appear first</p>
          </div>

          {/* Is Visible */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                {...register('is_visible')}
                type="checkbox"
                defaultChecked={true}
                className="mr-2"
              />
              <span className="text-white font-semibold">Visible on website</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading || !imagePreview}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading...' : 'Upload & Tag Members →'}
          </button>
          <p className="text-gray-400 text-sm mt-2 text-center">
            After uploading, you'll be able to tag people in the photo
          </p>
        </form>
      </div>
    </div>
  )
}
