/**
 * Admin Root Redirect
 * Redirects /admin to the appropriate destination using the request cookie.
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const token = (await cookies()).get('admin_token')?.value
  redirect(token ? '/admin/dashboard' : '/admin/login')
}
