/**
 * Admin Root Redirect
 * Redirects /admin to the appropriate destination using the request cookie.
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  redirect(token ? '/admin/dashboard' : '/admin/login')
}
