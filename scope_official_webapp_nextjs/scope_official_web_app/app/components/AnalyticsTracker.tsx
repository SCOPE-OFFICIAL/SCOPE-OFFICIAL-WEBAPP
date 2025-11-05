/**
 * Client-side Analytics Tracker Component
 * Automatically tracks page views and provides API request tracking
 */

'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Track page view
async function trackPageView(path: string, title: string) {
  try {
    const sessionId = getSessionId()
    const referrer = document.referrer || 'direct'

    await fetch('/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: path,
        page_title: title,
        referrer,
        session_id: sessionId
      })
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

// Track API request
export async function trackApiRequest(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number
) {
  try {
    await fetch('/api/track/api-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint,
        method,
        status_code: statusCode,
        response_time_ms: responseTimeMs
      })
    })
  } catch (error) {
    console.error('Failed to track API request:', error)
  }
}

// Wrapper for fetch that automatically tracks API calls
export async function trackedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const startTime = performance.now()
  
  try {
    const response = await fetch(input, init)
    const endTime = performance.now()
    const responseTime = Math.round(endTime - startTime)
    
    // Extract endpoint from URL
    const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url
    const endpoint = url.split('?')[0] // Remove query params
    const method = init?.method || 'GET'
    
    // Track the API request (don't await to not slow down the response)
    trackApiRequest(endpoint, method, response.status, responseTime)
    
    return response
  } catch (error) {
    const endTime = performance.now()
    const responseTime = Math.round(endTime - startTime)
    
    // Track failed request
    const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url
    const endpoint = url.split('?')[0]
    const method = init?.method || 'GET'
    trackApiRequest(endpoint, method, 0, responseTime)
    
    throw error
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string>('')

  useEffect(() => {
    // Avoid tracking the same page twice
    if (pathname === lastTrackedPath.current) return
    
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return
    
    lastTrackedPath.current = pathname
    
    // Track page view
    const title = document.title || pathname
    trackPageView(pathname, title)
  }, [pathname])

  return null
}
