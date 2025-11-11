/**
 * Admin Management Page
 * Allows super admins to add, view, and manage admin accounts
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Admin {
  id: string
  email: string
  password: string
  name: string
  role: string
  created_at: string
  last_login?: string
}

export default function AdminManagementPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'super_admin'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailError, setEmailError] = useState('')
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string | null>(null)
  const OWNER_EMAIL = 'rohanbaiju210@gmail.com'

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    // populate current admin email for permission checks
    const email = localStorage.getItem('admin_email')
    setCurrentAdminEmail(email)
    fetchAdmins()
  }, [router])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins')
      const data = await response.json()
      if (response.ok) {
        setAdmins(data.admins || [])
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEmailError('')

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Admin added successfully!')
        setFormData({ email: '', password: '', name: '', role: 'admin' })
        setShowAddModal(false)
        fetchAdmins()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        // If the error is a duplicate email, show inline error on the email field
        if (response.status === 400 && data?.error && String(data.error).toLowerCase().includes('already')) {
          setEmailError('An admin with this email already exists')
        } else {
          setError(data.error || 'Failed to add admin')
        }
      }
    } catch (err) {
      setError('Failed to add admin. Please try again.')
      console.error(err)
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        setError('Unauthorized. Please login again.')
        return
      }

      const response = await fetch(`/api/admin/admins?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccess('Admin deleted successfully!')
        fetchAdmins()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete admin')
      }
    } catch (err) {
      setError('Failed to delete admin. Please try again.')
      console.error(err)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setSuccess(`${type} copied to clipboard!`)
    setTimeout(() => setSuccess(''), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040a28]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
            Admin Management
          </h1>
          <p className="text-gray-400 mt-2">Manage club member admin accounts</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg border border-gray-500/30 transition-all"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-medium"
          >
            + Add New Admin
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Admins</p>
              <p className="text-3xl font-bold text-white mt-1">{admins.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Today</p>
              <p className="text-3xl font-bold text-white mt-1">
                {admins.filter(a => a.last_login && new Date(a.last_login).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">All Members</p>
              <p className="text-3xl font-bold text-white mt-1">
                {admins.length}
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </motion.div>
      </div>

      {/* Admins Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-gray-300 font-medium text-sm p-4">Name</th>
                <th className="text-left text-gray-300 font-medium text-sm p-4">Email</th>
                <th className="text-left text-gray-300 font-medium text-sm p-4">Created</th>
                <th className="text-left text-gray-300 font-medium text-sm p-4">Last Login</th>
                <th className="text-center text-gray-300 font-medium text-sm p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-3">👤</div>
                    <p>No admins found</p>
                    <p className="text-sm mt-2">Add your first admin to get started</p>
                  </td>
                </tr>
              ) : (
                admins.map((admin, index) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] flex items-center justify-center text-white font-bold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{admin.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">{admin.email}</span>
                        <button
                          onClick={() => copyToClipboard(admin.email, 'Email')}
                          className="text-gray-400 hover:text-[#2C97FF] transition-colors"
                          title="Copy email"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {formatDate(admin.created_at)}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {admin.last_login ? formatDate(admin.last_login) : 'Never'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {currentAdminEmail === OWNER_EMAIL ? (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all text-sm"
                          >
                            🗑️ Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d1b3d] border border-white/10 rounded-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Add New Admin</h2>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (emailError) setEmailError('')
                  }}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
                  placeholder="admin@scope.com"
                />
                {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C97FF]"
                  placeholder="Enter a strong password"
                />
                <p className="text-xs text-gray-500 mt-1">Remember this password — you will need it to log in.</p>
              </div>

              {/* Role is now always super_admin - hidden field */}
              <input type="hidden" value="super_admin" />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                  setFormData({ email: '', password: '', name: '', role: 'super_admin' })
                  setError('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg border border-gray-500/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white rounded-lg hover:opacity-90 transition-all font-medium"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
