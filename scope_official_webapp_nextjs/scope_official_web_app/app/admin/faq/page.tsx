'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FAQ, UserQuestion } from '@/lib/types/database'

type TabType = 'admin-faqs' | 'user-questions'

export default function AdminFAQPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('admin-faqs')
  const [adminFaqs, setAdminFaqs] = useState<FAQ[]>([])
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      // Fetch admin FAQs (from existing FAQ table)
      const faqRes = await fetch('/api/faq')
      const faqData = await faqRes.json()
      setAdminFaqs(faqData.faqs || [])

      // Fetch user questions
      const questionsRes = await fetch('/api/user-questions')
      const questionsData = await questionsRes.json()
      setUserQuestions(questionsData.questions || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return

    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Delete this question?')) return

    try {
      const res = await fetch(`/api/user-questions?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const handlePublishQuestion = async (question: UserQuestion, answer: string) => {
    if (!answer.trim()) {
      alert('Please provide an answer before publishing')
      return
    }

    if (!question.user_email) {
      const confirmed = confirm(
        'This user did not provide an email address. The answer will be published but no email notification will be sent. Continue?'
      )
      if (!confirmed) return
    }

    try {
      // Update question status
      const res = await fetch('/api/user-questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: question.id,
          answer,
          status: 'answered',
          is_public: true,
          answered_by: 'SCOPE Admin'
        }),
      })

      if (res.ok) {
        // Send email notification if user provided email
        if (question.user_email) {
          try {
            const emailRes = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: question.user_email,
                userName: question.user_name || 'User',
                question: question.question,
                answer: answer,
                answeredBy: 'SCOPE Admin'
              }),
            })

            if (emailRes.ok) {
              alert('✅ Answer published and email notification sent successfully!')
            } else {
              const errorData = await emailRes.json()
              console.error('Email error:', errorData)
              alert('✅ Answer published, but email notification failed. Please check SMTP configuration.')
            }
          } catch (emailError) {
            console.error('Email sending error:', emailError)
            alert('✅ Answer published, but email notification failed to send.')
          }
        } else {
          alert('✅ Answer published successfully!')
        }
        
        fetchData()
      } else {
        alert('Failed to publish answer. Please try again.')
      }
    } catch (error) {
      console.error('Error publishing question:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const filteredQuestions = userQuestions.filter(q => {
    if (filter === 'all') return true
    return q.status === filter
  })

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
            <h1 className="text-4xl font-bold text-white mb-2">FAQ Management</h1>
            <p className="text-gray-400">Manage admin FAQs and user-submitted questions</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('admin-faqs')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'admin-faqs'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📝 Admin FAQs ({adminFaqs.length})
          </button>
          <button
            onClick={() => setActiveTab('user-questions')}
            className={`px-6 py-3 rounded-lg font-semibold transition relative ${
              activeTab === 'user-questions'
                ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            💬 User Questions ({userQuestions.length})
            {userQuestions.filter(q => q.status === 'pending').length > 0 && (
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                {userQuestions.filter(q => q.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Admin FAQs Tab */}
        {activeTab === 'admin-faqs' && (
          <div>
            <div className="mb-6">
              <Link
                href="/admin/faq/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition"
              >
                + Add New FAQ
              </Link>
            </div>

            {adminFaqs.length === 0 ? (
              <div className="bg-gray-800/50 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg">No FAQs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                          {faq.category && (
                            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                              {faq.category}
                            </span>
                          )}
                          {!faq.is_visible && (
                            <span className="px-3 py-1 bg-red-900/50 text-red-300 text-xs rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/admin/faq/edit/${faq.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Questions Tab */}
        {activeTab === 'user-questions' && (
          <div>
            {/* Filter */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'all'
                    ? 'bg-white text-purple-900 font-semibold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({userQuestions.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'pending'
                    ? 'bg-white text-purple-900 font-semibold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Pending ({userQuestions.filter(q => q.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('answered')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'answered'
                    ? 'bg-white text-purple-900 font-semibold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Answered ({userQuestions.filter(q => q.status === 'answered').length})
              </button>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-gray-800/50 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-lg">No questions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <UserQuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onPublish={handlePublishQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// User Question Card Component
function UserQuestionCard({
  question,
  index,
  onPublish,
  onDelete,
}: {
  question: UserQuestion
  index: number
  onPublish: (question: UserQuestion, answer: string) => void
  onDelete: (id: string) => void
}) {
  const [isAnswering, setIsAnswering] = useState(false)
  const [answer, setAnswer] = useState(question.answer || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gradient-to-br rounded-lg p-6 border ${
        question.status === 'pending'
          ? 'from-orange-900/30 to-orange-800/30 border-orange-600'
          : 'from-gray-800 to-gray-900 border-gray-700'
      }`}
    >
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
              question.status === 'pending'
                ? 'bg-orange-900/50 text-orange-300'
                : question.status === 'answered'
                ? 'bg-green-900/50 text-green-300'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {question.status.toUpperCase()}
            </span>
            {question.is_public && (
              <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full font-semibold">
                Public
              </span>
            )}
            {question.category && (
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                {question.category}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{question.question}</h3>
          <p className="text-gray-400 text-sm">
            Asked by: <strong>{question.user_name}</strong>
            {question.user_email && ` (${question.user_email})`}
            {' • '}
            {new Date(question.submitted_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Answer Section */}
      {question.status === 'pending' ? (
        <div>
          {!isAnswering ? (
            <button
              onClick={() => setIsAnswering(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-semibold transition"
            >
              ✍️ Answer Question
            </button>
          ) : (
            <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="Write your answer here..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onPublish(question, answer)
                    setIsAnswering(false)
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  Publish Answer
                </button>
                <button
                  onClick={() => setIsAnswering(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDelete(question.id)}
                  className="ml-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
            <p className="text-white font-semibold mb-1">Answer:</p>
            <p className="text-gray-300">{question.answer}</p>
            {question.answered_at && (
              <p className="text-gray-500 text-sm mt-2">
                Answered on {new Date(question.answered_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!question.is_public && (
              <button
                onClick={() => onPublish(question, question.answer || '')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Make Public
              </button>
            )}
            <button
              onClick={() => onDelete(question.id)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
