'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FAQ, FAQFormData } from '@/lib/types/database'

export default function EditFAQPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FAQFormData>()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchFAQ()
  }, [router, id])

  const fetchFAQ = async () => {
    try {
      const res = await fetch('/api/faq')
      const data = await res.json()
      const faq = data.faqs?.find((f: FAQ) => f.id === id)

      if (faq) {
        setValue('question', faq.question)
        setValue('answer', faq.answer)
        setValue('category', faq.category || '')
        setValue('display_order', faq.display_order)
        setValue('is_visible', faq.is_visible)
      }
    } catch (error) {
      console.error('Error fetching FAQ:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FAQFormData) => {
    try {
      const res = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id }),
      })

      if (res.ok) {
        router.push('/admin/faq')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update FAQ')
      }
    } catch (error) {
      console.error('Error updating FAQ:', error)
      alert('Error updating FAQ')
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
          <h1 className="text-4xl font-bold text-white">Edit FAQ</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700">
          {/* Question */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Question *</label>
            <input
              {...register('question', { required: 'Question is required' })}
              placeholder="What is SCOPE?"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {errors.question && <p className="text-red-400 mt-1">{errors.question.message}</p>}
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Answer *</label>
            <textarea
              {...register('answer', { required: 'Answer is required' })}
              rows={6}
              placeholder="SCOPE is a student organization focused on..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            {errors.answer && <p className="text-red-400 mt-1">{errors.answer.message}</p>}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Category</label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="">General</option>
              <option value="events">Events</option>
              <option value="membership">Membership</option>
              <option value="technical">Technical</option>
              <option value="projects">Projects</option>
              <option value="other">Other</option>
            </select>
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

          {/* Is Visible */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                {...register('is_visible')}
                type="checkbox"
                className="mr-2"
              />
              <span className="text-white font-semibold">Visible on website</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Updating FAQ...' : 'Update FAQ'}
          </button>
        </form>
      </div>
    </div>
  )
}
