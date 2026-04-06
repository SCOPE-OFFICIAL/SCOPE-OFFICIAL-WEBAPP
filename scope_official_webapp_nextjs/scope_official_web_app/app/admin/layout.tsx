'use client'

import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    // Ensure admin pages are always scrollable, even if homepage scroll lock leaked.
    document.body.classList.remove('unified-scroll-active')
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [])

  return <div className="min-h-screen overflow-y-auto">{children}</div>
}
