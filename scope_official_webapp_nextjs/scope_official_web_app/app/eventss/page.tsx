"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundBalls from "../components/BackgroundBalls";
import { useRouter } from 'next/navigation';

// Type for Event from database
interface Event {
  id: string
  title: string
  description: string
  short_description: string
  event_date: string
  event_time: string | null
  location: string | null
  image_url: string | null
  event_type: string
  status: string
  registration_link?: string | null
  speaker?: string | null
  registration_fee?: string | null
  banner_image_url?: string | null
  poster_image_url?: string | null
  what_to_expect?: string | null
  what_you_get?: string | null
}

// Type for Past Event from database
interface PastEvent {
  id: string
  event_name?: string
  title?: string
  description?: string | null
  poster_image_url: string
  display_order?: number
  is_visible?: boolean
  event_date?: string | null
  gallery_folder?: string | null
}

// Slide direction type
type Direction = 'left' | 'right'

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])
  const [loading, setLoading] = useState(true)

  // ── Upcoming Events Slider state ──────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('left')
  const [paused, setPaused] = useState(false)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const [progressPct, setProgressPct] = useState(0)
  const SLIDE_DURATION = 20000 // 20 seconds per slide

  // Fetch upcoming events
  useEffect(() => {
    async function fetchEvents() {
      const start = Date.now()
      try {
        setLoading(true)
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('')
        const preview = params.get('preview') === 'true'
        const url = preview ? '/api/events?preview=true' : '/api/events?upcoming=true&status=published'
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        console.debug('Events API response:', data)
        setUpcomingEvents(data.events || [])
      } catch (err) {
        console.error('Error fetching events:', err)
        setUpcomingEvents([])
      } finally {
        const elapsed = Date.now() - start
        setTimeout(() => setLoading(false), Math.max(0, 800 - elapsed))
      }
    }
    fetchEvents()
  }, [])

  // Fetch past events
  useEffect(() => {
    async function fetchPastEvents() {
      try {
        const response = await fetch('/api/past-events?visible=true')
        if (!response.ok) throw new Error('Failed to fetch past events')
        const data = await response.json()
        const raw = data.pastEvents || []
        const events: PastEvent[] = raw.map((e: any) => ({
          id: e.id ?? (e.event_name || Math.random().toString(36).slice(2, 8)),
          title: e.event_name || e.title || null,
          description: e.description || e.short_description || null,
          poster_image_url: e.poster_image_url || e.poster || e.image_url || '/images/past-event-1.jpg',
          display_order: e.display_order ?? null,
          is_visible: e.is_visible ?? true,
          event_date: e.event_date ?? null,
          gallery_folder: e.gallery_folder ?? e.gallery_album ?? null,
        }))
        setPastEvents(events.length > 0 ? events : [
          { id: 'fallback-1', poster_image_url: '/images/past-event-1.jpg', title: 'Fallback Event 1' },
          { id: 'fallback-2', poster_image_url: '/images/past-event-2-matlab.jpg', title: 'Fallback Event 2' },
          { id: 'fallback-3', poster_image_url: '/images/past-event-3-tech.jpg', title: 'Fallback Event 3' },
        ])
      } catch (err) {
        console.error('Error fetching past events:', err)
        setPastEvents([
          { id: 'fallback-1', poster_image_url: '/images/past-event-1.jpg', title: 'Fallback Event 1' },
          { id: 'fallback-2', poster_image_url: '/images/past-event-2-matlab.jpg', title: 'Fallback Event 2' },
          { id: 'fallback-3', poster_image_url: '/images/past-event-3-tech.jpg', title: 'Fallback Event 3' },
        ])
      }
    }
    fetchPastEvents()
  }, [])

  // ── Slide navigation helpers ──────────────────────────────────────────
  const goTo = useCallback((index: number, dir: Direction) => {
    setDirection(dir)
    setActiveIndex(index)
    setProgressPct(0)
  }, [])

  const goNext = useCallback(() => {
    if (upcomingEvents.length <= 1) return
    goTo((activeIndex + 1) % upcomingEvents.length, 'left')
  }, [activeIndex, upcomingEvents.length, goTo])

  const goPrev = useCallback(() => {
    if (upcomingEvents.length <= 1) return
    goTo((activeIndex - 1 + upcomingEvents.length) % upcomingEvents.length, 'right')
  }, [activeIndex, upcomingEvents.length, goTo])

  // Auto-advance with progress bar
  useEffect(() => {
    if (upcomingEvents.length <= 1 || paused || loading) return

    const step = 100 / (SLIDE_DURATION / 100)
    let pct = 0

    const tick = setInterval(() => {
      pct += step
      setProgressPct(Math.min(pct, 100))
      if (pct >= 100) {
        clearInterval(tick)
        goNext()
      }
    }, 100)

    progressRef.current = tick
    return () => clearInterval(tick)
  }, [activeIndex, paused, loading, upcomingEvents.length, goNext])

  // ── Past Events carousel state (unchanged) ────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const swipeThreshold = 50
  const [showPastModal, setShowPastModal] = useState(false)
  const [selectedPastIndex, setSelectedPastIndex] = useState<number | null>(null)
  const [pastModalClosing, setPastModalClosing] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const router = useRouter()

  const handleSeeGalleryClick = (path: string, folderName?: string) => {
    try {
      if (typeof window !== 'undefined' && folderName) {
        localStorage.setItem('galleryHighlightFolder', folderName)
      }
    } catch (err) {
      console.warn('Could not set galleryFolder in localStorage', err)
    }
    setPendingNavigation('/#gallery')
    setPastModalClosing(true)
  }

  useEffect(() => {
    const orbitronLink = document.createElement("link")
    orbitronLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
    orbitronLink.rel = "stylesheet"
    document.head.appendChild(orbitronLink)
    const dmSansLink = document.createElement("link")
    dmSansLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap"
    dmSansLink.rel = "stylesheet"
    document.head.appendChild(dmSansLink)
    return () => {
      if (document.head.contains(orbitronLink)) document.head.removeChild(orbitronLink)
      if (document.head.contains(dmSansLink)) document.head.removeChild(dmSansLink)
    }
  }, [])

  const handlePrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev === 0 ? pastEvents.length - 1 : prev - 1)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning, pastEvents.length])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev === pastEvents.length - 1 ? 0 : prev + 1)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning, pastEvents.length])

  const handleImageClick = (index: number) => {
    setCurrentIndex(index)
    setSelectedPastIndex(index)
    setShowPastModal(true)
  }

  useEffect(() => {
    if (!pastEvents || pastEvents.length <= 1) return
    const id = setInterval(() => {
      if (isTransitioning || hoverIndex !== null) return
      handleNext()
    }, 5000)
    return () => clearInterval(id)
  }, [pastEvents, pastEvents.length, isTransitioning, hoverIndex, handleNext])

  // ── Helpers ──────────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase()
    const year = date.getFullYear()
    const suffix = day === 1 || day === 21 || day === 31 ? 'st'
      : day === 2 || day === 22 ? 'nd'
      : day === 3 || day === 23 ? 'rd' : 'th'
    return { day: `${day}${suffix}`, dayNum: day.toString().padStart(2, '0'), month, year }
  }

  const categoryStyle: Record<string, { bg: string; text: string; glow: string }> = {
    WORKSHOP:    { bg: 'bg-[#F24DC2]/20 border border-[#F24DC2]/50', text: 'text-[#F24DC2]', glow: 'rgba(242,77,194,0.3)' },
    SEMINAR:     { bg: 'bg-[#2C97FF]/20 border border-[#2C97FF]/50', text: 'text-[#2C97FF]', glow: 'rgba(44,151,255,0.3)' },
    COMPETITION: { bg: 'bg-[#a78bfa]/20 border border-[#a78bfa]/50', text: 'text-[#a78bfa]', glow: 'rgba(167,139,250,0.3)' },
    TALK:        { bg: 'bg-yellow-500/20 border border-yellow-500/50', text: 'text-yellow-400', glow: 'rgba(234,179,8,0.3)' },
    OTHER:       { bg: 'bg-white/10 border border-white/20', text: 'text-gray-300', glow: 'rgba(255,255,255,0.1)' },
  }
  const getCat = (type: string) => categoryStyle[type?.toUpperCase()] || categoryStyle['OTHER']

  // Framer variants for slide in/out
  const slideVariants = {
    enterLeft:  { x: '100%', opacity: 0 },
    enterRight: { x: '-100%', opacity: 0 },
    center:     { x: 0, opacity: 1 },
    exitLeft:   { x: '-100%', opacity: 0 },
    exitRight:  { x: '100%', opacity: 0 },
  }

  // ── Countdown timer ───────────────────────────────────────────────────
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    if (!upcomingEvents[activeIndex]?.event_date) return
    const update = () => {
      const ev = upcomingEvents[activeIndex]
      const target = new Date(`${ev.event_date}T${ev.event_time || '00:00:00'}`).getTime()
      const now = Date.now()
      const dist = target - now
      if (dist > 0) {
        setCountdown({
          days: Math.floor(dist / 86400000),
          hours: Math.floor((dist % 86400000) / 3600000),
          mins: Math.floor((dist % 3600000) / 60000),
          secs: Math.floor((dist % 60000) / 1000),
        })
      } else {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 })
      }
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [activeIndex, upcomingEvents])

  // ── Countdown box component ───────────────────────────────────────────
  const CountBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-black/60 border border-red-500/40 rounded-lg px-3 py-2 min-w-[48px] text-center">
        <span className="text-red-400 font-mono font-bold text-xl leading-none"
          style={{ textShadow: '0 0 12px rgba(239,68,68,0.7)' }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] text-gray-200 font-sans relative overflow-hidden">
      <BackgroundBalls />

      <main className="relative z-10">

        {/* ══════════════════════════════════════════════════════════════════
            UPCOMING EVENTS — Single showcase box with sliding events
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full">
          <BackgroundBalls />
          <motion.section
            className="py-24 px-4 md:px-10 bg-[#040A28] text-white relative"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Section divider */}
            <motion.div
              className="w-full h-px bg-gradient-to-r from-transparent via-[#F24DC2] to-transparent mb-16"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />

            {/* Pill badge */}
            <motion.div className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}>
              <span className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-gray-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Upcoming Events
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="mb-3 text-center font-extrabold text-gray-100 leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', textShadow: '0 0 30px rgba(242,77,194,0.25)', letterSpacing: '1px' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Upcoming{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">Events</span>
            </motion.h2>

            <motion.p
              className="text-center text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Explore our upcoming events and be a part of innovation, learning and growth.
            </motion.p>

            {/* Decorative divider */}
            <motion.div className="flex items-center justify-center gap-2 mb-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#F24DC2] rounded-full" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#F24DC2] to-[#2C97FF]" />
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#2C97FF] rounded-full" />
            </motion.div>

            {/* ── Loading skeleton ── */}
            {loading && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-pulse">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 h-72 lg:h-[480px] bg-white/5" />
                    <div className="lg:w-1/2 p-8 space-y-5">
                      <div className="h-4 bg-white/10 rounded w-1/4" />
                      <div className="h-8 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                      <div className="h-20 bg-white/5 rounded-xl" />
                      <div className="h-12 bg-white/10 rounded-xl w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && upcomingEvents.length === 0 && (
              <motion.div className="flex flex-col items-center justify-center py-24 text-gray-500"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4 opacity-30">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p className="text-sm">No upcoming events at the moment.</p>
                <p className="text-xs mt-1 opacity-50">Check back soon!</p>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                THE SHOWCASE BOX — single card, events slide inside it
            ══════════════════════════════════════════════════════════════ */}
            {!loading && upcomingEvents.length > 0 && (
              <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                {/* Outer showcase box */}
                <div
                  className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1b3d 50%, #0a0f2e 100%)' }}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  {/* Progress bar at very top */}
                  {upcomingEvents.length > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]"
                        style={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    </div>
                  )}

                  {/* Sliding content area */}
                  <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                      {upcomingEvents[activeIndex] && (() => {
                        const ev = upcomingEvents[activeIndex]
                        const cat = getCat(ev.event_type)
                        const { dayNum, month, year } = formatDate(ev.event_date)

                        return (
                          <motion.div
                            key={ev.id}
                            custom={direction}
                            variants={slideVariants}
                            initial={direction === 'left' ? 'enterLeft' : 'enterRight'}
                            animate="center"
                            exit={direction === 'left' ? 'exitLeft' : 'exitRight'}
                            transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.55 }}
                            className="absolute inset-0 flex flex-col lg:flex-row"
                          >
                            {/* LEFT: image panel */}
                            <div className="relative lg:w-[45%] h-56 lg:h-full flex-shrink-0 overflow-hidden">
                              {ev.poster_image_url || ev.image_url ? (
                                <Image
                                  src={(ev.poster_image_url || ev.image_url) as string}
                                  alt={ev.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 45vw"
                                  priority
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c3a] via-[#0d1b3d] to-[#1a1c3a] flex items-center justify-center">
                                  <span className="text-7xl">🎪</span>
                                </div>
                              )}
                              {/* Gradient overlay — fades into right panel on desktop */}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0f2e]" />

                              {/* Category badge over image */}
                              <div className="absolute top-4 left-4 z-10">
                                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md ${cat.bg} ${cat.text}`}>
                                  {ev.event_type || 'EVENT'}
                                </span>
                              </div>

                              {/* Event number indicator */}
                              {upcomingEvents.length > 1 && (
                                <div className="absolute bottom-4 left-4 z-10 text-white/60 text-xs font-mono">
                                  {activeIndex + 1} / {upcomingEvents.length}
                                </div>
                              )}
                            </div>

                            {/* RIGHT: details panel */}
                            <div className="flex-1 flex flex-col justify-between p-6 lg:p-8 lg:pl-6 overflow-y-auto">

                              {/* Top section */}
                              <div className="space-y-4">

                                {/* Date row */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 text-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 min-w-[64px]">
                                    <p className="text-white font-extrabold text-2xl leading-none">{dayNum}</p>
                                    <p className={`font-bold text-xs mt-0.5 ${cat.text}`}>{month}</p>
                                    <p className="text-gray-500 text-[10px] mt-0.5">{year}</p>
                                  </div>
                                  <div className="space-y-1.5">
                                    {ev.event_time && (
                                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                        {ev.event_time}
                                      </div>
                                    )}
                                    {ev.location && (
                                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 flex-shrink-0">
                                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span className="line-clamp-1">{ev.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Title */}
                                <div>
                                  <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">
                                    {ev.title}
                                  </h3>
                                </div>

                                {/* Description */}
                                {(ev.short_description || ev.description) && (
                                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                    {ev.short_description || ev.description}
                                  </p>
                                )}

                                {/* Speaker + fee row */}
                                <div className="flex flex-wrap gap-3">
                                  {ev.speaker && (
                                    <div className="flex items-center gap-1.5 text-gray-300 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                      </svg>
                                      {ev.speaker}
                                    </div>
                                  )}
                                  {ev.registration_fee && (
                                    <div className="text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                                      {ev.registration_fee}
                                    </div>
                                  )}
                                  {!ev.registration_fee && (
                                    <div className="text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                                      FREE
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Bottom section */}
                              <div className="space-y-4 mt-4">
                                {/* Countdown */}
                                <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-3">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-2">
                                    Event Starts In
                                  </p>
                                  <div className="flex justify-center items-center gap-2">
                                    <CountBox value={countdown.days} label="Days" />
                                    <span className="text-red-400 font-bold text-lg mb-4">:</span>
                                    <CountBox value={countdown.hours} label="Hrs" />
                                    <span className="text-red-400 font-bold text-lg mb-4">:</span>
                                    <CountBox value={countdown.mins} label="Min" />
                                    <span className="text-red-400 font-bold text-lg mb-4">:</span>
                                    <CountBox value={countdown.secs} label="Sec" />
                                  </div>
                                </div>

                                {/* Register button */}
                                <a
                                  href={ev.registration_link || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-xl text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                                >
                                  CLICK HERE TO REGISTER
                                  <span className="text-base">👆</span>
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })()}
                    </AnimatePresence>
                  </div>

                  {/* Prev / Next arrow buttons */}
                  {upcomingEvents.length > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, rgba(242,77,194,0.15), rgba(44,151,255,0.15))',
                          border: '1px solid rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(8px)',
                        }}
                        aria-label="Previous event"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, rgba(242,77,194,0.15), rgba(44,151,255,0.15))',
                          border: '1px solid rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(8px)',
                        }}
                        aria-label="Next event"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Dot indicators */}
                {upcomingEvents.length > 1 && (
                  <div className="flex justify-center gap-2 mt-5">
                    {upcomingEvents.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i, i > activeIndex ? 'left' : 'right')}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === activeIndex ? '28px' : '8px',
                          height: '8px',
                          background: i === activeIndex
                            ? 'linear-gradient(90deg, #F24DC2, #2C97FF)'
                            : 'rgba(255,255,255,0.2)',
                        }}
                        aria-label={`Go to event ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Pause indicator */}
                {paused && upcomingEvents.length > 1 && (
                  <p className="text-center text-gray-600 text-xs mt-2">Auto-sliding paused</p>
                )}
              </motion.div>
            )}
          </motion.section>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PAST EVENTS SECTION — completely unchanged
        ══════════════════════════════════════════════════════════════════ */}
        <motion.section
          className="text-center py-24 px-4 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', type: 'tween' }}
          viewport={{ once: true, margin: '-150px' }}
        >
          <motion.div
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0072FF] to-transparent my-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          />
          <motion.h2
            className="mb-12 text-center text-4xl md:text-5xl font-bold text-gray-100"
            style={{ textShadow: '0 0 20px rgba(138, 64, 255, 0.4)', letterSpacing: '2px', fontFamily: '"Orbitron", sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, textShadow: '0 0 30px rgba(138, 64, 255, 0.6)', transition: { duration: 0.3 } }}
          >
            PAST EVENTS
          </motion.h2>

          <motion.div
            className="relative w-full max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <style jsx>{`
              .arrow-btn { position: absolute; top: 50%; z-index: 20; color: white; font-size: 1.6rem; padding: 0.25rem 0.5rem; display: block; background: rgba(0,0,0,0.25); border-radius: 8px; backdrop-filter: blur(6px); }
              .arrow-btn:focus { outline: none; }
              @media (min-width: 768px) { .arrow-btn { font-size: 2.2rem; padding: 0.5rem; background: transparent; } }
              .arrow-btn.left  { left: 0.5rem;  transform: translate(-25%, -50%); }
              .arrow-btn.right { right: 0.5rem; transform: translate(25%, -50%); }
              .arrow-btn:hover { color: #d1d5db; }
              .arrow-btn.left:hover  { transform: translate(-30%, -50%) scale(1.06); }
              .arrow-btn.right:hover { transform: translate(30%, -50%) scale(1.06); }
            `}</style>

            <button onClick={handlePrev} className="arrow-btn left" aria-label="Previous">&lt;</button>
            <motion.div
              className="flex justify-center items-center relative h-[650px] overflow-visible cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = touchStartX - e.changedTouches[0].clientX
                if (diff > swipeThreshold) handleNext()
                else if (diff < -swipeThreshold) handlePrev()
              }}
              onMouseDown={(e) => setTouchStartX(e.clientX)}
              onMouseUp={(e) => {
                const diff = touchStartX - e.clientX
                if (diff > swipeThreshold) handleNext()
                else if (diff < -swipeThreshold) handlePrev()
              }}
            >
              {pastEvents.map((evt, index) => {
                const src = evt.poster_image_url || '/images/past-event-1.jpg'
                const relativeIndex = (index + pastEvents.length - currentIndex) % pastEvents.length
                const isHovered = hoverIndex === index
                const isCenter = relativeIndex === 0 && hoverIndex === null
                let styleClass = "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover "

                if (relativeIndex === 0) {
                  styleClass += isHovered || isCenter
                    ? "w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px] z-30 scale-100 opacity-100"
                    : "w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px] z-20 scale-95 opacity-90"
                } else if (relativeIndex === 1) {
                  styleClass += isHovered
                    ? "sm:translate-x-[230px] translate-x-[170px] scale-100 z-30 opacity-100 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                    : "sm:translate-x-[220px] translate-x-[160px] scale-90 z-10 opacity-60 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass += isHovered
                    ? "sm:-translate-x-[230px] -translate-x-[170px] scale-100 z-30 opacity-100 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                    : "sm:-translate-x-[220px] -translate-x-[160px] scale-90 z-10 opacity-60 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                } else {
                  styleClass += "opacity-0 pointer-events-none"
                }

                return (
                  <Image
                    key={evt.id || index}
                    src={src}
                    alt={evt.title || `Past Event ${index + 1}`}
                    width={320} height={420}
                    className={styleClass}
                    draggable={false}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleImageClick(index)}
                  />
                )
              })}
            </motion.div>
            <button onClick={handleNext} className="arrow-btn right" aria-label="Next">&gt;</button>
          </motion.div>

          <Link href="/#gallery">
            <motion.button
              className="mt-12 bg-[#004c94] hover:bg-[#003E7A] border-[#004c94] px-6 py-3 rounded-full font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, backgroundColor: '#003E7A', transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              KNOW MORE
            </motion.button>
          </Link>
        </motion.section>
      </main>

      {/* Past Event Poster Modal — unchanged */}
      {showPastModal && selectedPastIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          role="dialog" aria-modal="true"
          initial={{ opacity: 0 }}
          animate={pastModalClosing ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.25 }}
          onClick={() => setPastModalClosing(true)}
          onAnimationComplete={() => {
            if (pastModalClosing) {
              setShowPastModal(false)
              setPastModalClosing(false)
              if (pendingNavigation) { router.push(pendingNavigation); setPendingNavigation(null) }
            }
          }}
        >
          <motion.div
            className="max-w-5xl mx-auto my-8 bg-gradient-to-br from-[#040A28] via-[#0d1b3d] to-[#040A28] rounded-2xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh]"
            initial={{ y: 40 }}
            animate={pastModalClosing ? { y: 40 } : { y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div className="flex justify-end p-3 border-b border-white/5">
              <button onClick={() => setPastModalClosing(true)} aria-label="Close"
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200">
                ✕
              </button>
            </div>
            <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-4 items-start overflow-auto" style={{ maxHeight: '80vh' }}>
              <div className="w-full lg:w-1/2">
                <div className="rounded-lg overflow-hidden">
                  <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center">
                    {selectedPastIndex !== null && (
                      <Image
                        src={pastEvents[selectedPastIndex].poster_image_url}
                        alt={pastEvents[selectedPastIndex].title || `Past Event ${selectedPastIndex + 1}`}
                        fill className="object-contain" style={{ objectPosition: 'center' }}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{pastEvents[selectedPastIndex].title || 'Past Event'}</h3>
                  <p className="text-sm text-gray-300">{pastEvents[selectedPastIndex].description || 'This is a preview of the selected past event poster. Use the button below to navigate to the gallery for this event.'}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (selectedPastIndex !== null && pastEvents[selectedPastIndex].gallery_folder) {
                        handleSeeGalleryClick(
                          `/#gallery?open=${encodeURIComponent(pastEvents[selectedPastIndex].gallery_folder!)}`,
                          pastEvents[selectedPastIndex].gallery_folder!
                        )
                      } else {
                        handleSeeGalleryClick('/#gallery')
                      }
                    }}
                    className="bg-[#004c94] hover:bg-[#003E7A] px-4 py-2 rounded text-white font-bold"
                  >
                    See Gallery Pics
                  </button>
                  <button onClick={() => setShowPastModal(false)} className="px-4 py-2 rounded border border-white/10 text-white">Close</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0">
        <Image src="/images/circuit-deco.png" alt="Circuit Decoration" width={256} height={256} />
      </div>
    </div>
  )
}