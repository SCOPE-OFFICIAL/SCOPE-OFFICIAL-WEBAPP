/**
 * Admin Root Redirect
 * Redirects /admin to /admin/dashboard
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminToken } from '@/app/admin/utils/auth'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getAdminToken()
    if (token) {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040a28]">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  )
}
