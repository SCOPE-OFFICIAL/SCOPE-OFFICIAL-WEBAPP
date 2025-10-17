'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Don't show navigation on admin pages
  const isAdminPage = pathname?.startsWith('/admin')
  
  if (isAdminPage) {
    return null
  }
  
  return <Navigation />
}
