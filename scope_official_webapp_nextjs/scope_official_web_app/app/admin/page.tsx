/**
 * Admin Root Redirect
 * Redirects /admin to /admin/dashboard
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040a28]">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  )
}
