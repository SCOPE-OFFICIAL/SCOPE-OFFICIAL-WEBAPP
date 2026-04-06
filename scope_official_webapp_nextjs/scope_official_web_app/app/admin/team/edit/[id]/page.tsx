'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { TeamMember, TeamMemberFormData } from '@/lib/types/database'
import { getAdminToken } from '@/app/admin/utils/auth'

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TeamMemberFormData>()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchMember()
  }, [router, id])

  const fetchMember = async () => {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      const member = data.members?.find((m: TeamMember) => m.id === id)

      if (member) {
        setValue('name', member.name)
        setValue('role', member.role)
        setValue('year', member.year || '')
        setValue('bio', member.bio || '')
        setValue('personality', member.personality || '')
        setValue('email', member.email || '')
        setValue('linkedin_url', member.linkedin_url || '')
        setValue('github_url', member.github_url || '')
        setValue('instagram_url', member.instagram_url || '')
        setValue('photo_url', member.photo_url || '')
        setValue('display_order', member.display_order)
        setValue('is_active', member.is_active)
        
        if (member.photo_url) {
          setImagePreview(member.photo_url)
        }
      }
    } catch (error) {
      console.error('Error fetching member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const token = getAdminToken()
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const res = await fetch('/api/admin/team/upload', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setValue('photo_url', url)
        setImagePreview(url)
      } else {
        const body = await res.json().catch(() => null)
        alert(body?.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      const message = error instanceof Error ? error.message : 'Error uploading image'
      alert(message)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id }),
      })

      if (res.ok) {
        router.push('/admin/team')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      alert('Error updating team member')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Edit Team Member</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Photo</label>
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
                <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {errors.name && <p className="text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Role *</label>
            <input
              {...register('role', { required: 'Role is required' })}
              placeholder="e.g., President, Technical Lead"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {errors.role && <p className="text-red-400 mt-1">{errors.role.message}</p>}
          </div>

          {/* Year */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Year</label>
            <input
              {...register('year')}
              placeholder="e.g., 2nd Year, 3rd Year"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder="Brief description about the member"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="member@example.com"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* LinkedIn */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">LinkedIn URL</label>
            <input
              {...register('linkedin_url')}
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Instagram */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Instagram URL</label>
            <input
              {...register('instagram_url')}
              type="url"
              placeholder="https://instagram.com/username"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Personality / More Info */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Personality / More Info</label>
            <textarea
              {...register('personality')}
              rows={4}
              placeholder="Add a short paragraph describing personality, strengths, interests..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* GitHub */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">GitHub URL</label>
            <input
              {...register('github_url')}
              type="url"
              placeholder="https://github.com/username"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          {/* Display Order */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Display Order</label>
            <input
              {...register('display_order', { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            <p className="text-gray-400 text-sm mt-1">Lower numbers appear first</p>
          </div>

          {/* Is Active */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                {...register('is_active')}
                type="checkbox"
                className="mr-2"
              />
              <span className="text-white font-semibold">Active Member</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Updating Member...' : 'Update Team Member'}
          </button>
        </form>
      </div>
    </div>
  )
}
