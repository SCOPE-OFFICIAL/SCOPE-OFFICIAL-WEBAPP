'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TeamMember } from '@/lib/types/database'

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchMembers()
  }, [router])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
      
      if (res.ok) {
        fetchMembers()
      } else {
        alert('Failed to delete member')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Error deleting member')
    }
  }

  const filteredMembers = members.filter(member => {
    if (filter === 'active') return member.is_active
    if (filter === 'inactive') return !member.is_active
    return true
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
            <h1 className="text-4xl font-bold text-white mb-2">Team Management</h1>
            <p className="text-gray-400">Manage individual team members and group photos</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link
            href="/admin/team/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition"
          >
            + Add Team Member
          </Link>
          <Link
            href="/admin/team/group-photos"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-semibold transition"
          >
            📸 Manage Group Photos
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({members.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'active'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active ({members.filter(m => m.is_active).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'inactive'
                ? 'bg-white text-purple-900 font-semibold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Inactive ({members.filter(m => !m.is_active).length})
          </button>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No team members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition"
              >
                {/* Member Photo */}
                {member.photo_url && (
                  <div className="h-64 bg-gray-700 overflow-hidden">
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Member Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-purple-400 font-semibold">{member.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.is_active
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {member.year && (
                    <p className="text-gray-400 text-sm mb-2">Year: {member.year}</p>
                  )}

                  {member.bio && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{member.bio}</p>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-2 mb-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 text-xs"
                      >
                        Instagram
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-gray-300 text-xs"
                      >
                        Email
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/team/edit/${member.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg text-sm font-semibold transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
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
    </div>
  )
}
