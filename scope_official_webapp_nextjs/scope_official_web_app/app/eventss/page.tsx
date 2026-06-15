"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundBalls from "../components/BackgroundBalls";
import { useRouter } from 'next/navigation';

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

type Direction = 'left' | 'right'

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])
  const [loading, setLoading] = useState(true)

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('left')
  const [paused, setPaused] = useState(false)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const [progressPct, setProgressPct] = useState(0)
  const SLIDE_DURATION = 20000

  const [tickerPaused, setTickerPaused] = useState(false)
  const [showPastModal, setShowPastModal] = useState(false)
  const [selectedPastIndex, setSelectedPastIndex] = useState<number | null>(null)
  const [pastModalClosing, setPastModalClosing] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const router = useRouter()

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

  useEffect(() => {
    if (upcomingEvents.length <= 1 || paused || loading) return
    const step = 100 / (SLIDE_DURATION / 100)
    let pct = 0
    const tick = setInterval(() => {
      pct += step
      setProgressPct(Math.min(pct, 100))
      if (pct >= 100) { clearInterval(tick); goNext() }
    }, 100)
    progressRef.current = tick
    return () => clearInterval(tick)
  }, [activeIndex, paused, loading, upcomingEvents.length, goNext])

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

  const handlePastCardClick = (realIndex: number) => {
    setSelectedPastIndex(realIndex)
    setShowPastModal(true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return { dayNum: '--', month: '---', year: '----' }
    const date = new Date(dateString)
    const day = date.getDate()
    return {
      dayNum: day.toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      year: date.getFullYear().toString(),
    }
  }

  const categoryStyle: Record<string, { bg: string; text: string }> = {
    WORKSHOP:    { bg: 'bg-[#F24DC2]/20 border border-[#F24DC2]/50', text: 'text-[#F24DC2]' },
    SEMINAR:     { bg: 'bg-[#2C97FF]/20 border border-[#2C97FF]/50', text: 'text-[#2C97FF]' },
    COMPETITION: { bg: 'bg-[#a78bfa]/20 border border-[#a78bfa]/50', text: 'text-[#a78bfa]' },
    TALK:        { bg: 'bg-yellow-500/20 border border-yellow-500/50', text: 'text-yellow-400' },
    OTHER:       { bg: 'bg-white/10 border border-white/20', text: 'text-gray-300' },
  }
  const getCat = (type?: string) => categoryStyle[(type || '').toUpperCase()] || categoryStyle['OTHER']

  const slideVariants = {
    enterLeft:  { x: '100%', opacity: 0 },
    enterRight: { x: '-100%', opacity: 0 },
    center:     { x: 0, opacity: 1 },
    exitLeft:   { x: '-100%', opacity: 0 },
    exitRight:  { x: '100%', opacity: 0 },
  }

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    if (!upcomingEvents[activeIndex]?.event_date) return
    const update = () => {
      const ev = upcomingEvents[activeIndex]
      const target = new Date(`${ev.event_date}T${ev.event_time || '00:00:00'}`).getTime()
      const dist = target - Date.now()
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

  const PastEventCard = ({ evt, realIndex }: { evt: PastEvent; realIndex: number }) => {
    const { dayNum, month, year } = formatDate(evt.event_date || '')
    return (
      <div
        className="flex-shrink-0 w-[272px] flex flex-col bg-[#0a0f2e] border border-white/10 rounded-2xl overflow-hidden cursor-pointer select-none
                   transition-all duration-300 hover:border-[#F24DC2]/50 hover:shadow-[0_0_32px_rgba(242,77,194,0.18)] hover:-translate-y-1"
        onClick={() => handlePastCardClick(realIndex)}
      >
        <div className="relative h-44 bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] overflow-hidden flex-shrink-0">
          <Image
            src={evt.poster_image_url}
            alt={evt.title || 'Past Event'}
            fill
            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
            sizes="272px"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e] via-[#0a0f2e]/10 to-transparent" />
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 backdrop-blur-md">
              Past Event
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-white font-extrabold text-sm leading-snug line-clamp-2">
              {evt.title || 'Past Event'}
            </h3>
          </div>
        </div>
        <div className="p-3 flex items-start gap-3 flex-1">
          {evt.event_date ? (
            <div className="flex-shrink-0 text-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 min-w-[50px]">
              <p className="text-white font-extrabold text-base leading-none">{dayNum}</p>
              <p className="font-bold text-[10px] mt-0.5 text-[#2C97FF]">{month}</p>
              <p className="text-gray-500 text-[9px] mt-0.5">{year}</p>
            </div>
          ) : (
            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 min-w-[50px] flex items-center justify-center">
              <p className="text-gray-600 text-[9px] text-center">No date</p>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {evt.description ? (
              <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-3">{evt.description}</p>
            ) : (
              <p className="text-gray-600 text-[11px] italic">Click to view poster</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const minSets = pastEvents.length > 0 ? Math.max(3, Math.ceil(6 / pastEvents.length)) : 3
  const tickerItems: Array<{ evt: PastEvent; realIndex: number }> = []
  for (let s = 0; s < minSets * 2; s++) {
    pastEvents.forEach((evt, i) => tickerItems.push({ evt, realIndex: i }))
  }

  // Shared heading style used by BOTH section titles
  const sectionHeadingStyle: React.CSSProperties = {
    fontFamily: '"Orbitron", sans-serif',
    fontSize: 'var(--page-title-size)',
    fontWeight: 700,
    letterSpacing: '2px',
    textShadow: '0 0 20px rgba(138,64,255,0.4)',
    color: '#ffffff',
  }

  return (
    <div className="min-h-screen bg-[#040a28] text-gray-200 font-sans relative overflow-hidden">
      <BackgroundBalls />

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <main className="relative z-10">

        {/* ══════════════════════════════════════════════════════════════════
            UPCOMING EVENTS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full">
          <BackgroundBalls />
          <motion.section
            className="py-24 px-4 md:px-10 bg-[#040A28] text-white relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0072FF] to-transparent mb-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          // transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        />

            <motion.div className="flex justify-center mb-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

            {/* ── Unified heading ── */}
            <motion.h2
              className="mb-3 text-center uppercase text-white"
              style={sectionHeadingStyle}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            //   whileHover={{ scale: 1.03, textShadow: '0 0 30px rgba(242,77,194,0.6)', transition: { duration: 0.3 } }}
            >
              UPCOMING EVENTS
            </motion.h2>

            <motion.p
              className="text-center text-gray-400 text-sm md:text-base mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              
            </motion.p>

            {/* Loading skeleton */}
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

            {/* Empty state */}
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

            {/* Showcase box */}
            {!loading && upcomingEvents.length > 0 && (
              <motion.div className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}>

                <div
                  className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1b3d 50%, #0a0f2e 100%)' }}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  {upcomingEvents.length > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]"
                        style={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    </div>
                  )}

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
                              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0f2e]" />
                              <div className="absolute top-4 left-4 z-10">
                                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md ${cat.bg} ${cat.text}`}>
                                  {ev.event_type || 'EVENT'}
                                </span>
                              </div>
                              {upcomingEvents.length > 1 && (
                                <div className="absolute bottom-4 left-4 z-10 text-white/60 text-xs font-mono">
                                  {activeIndex + 1} / {upcomingEvents.length}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between p-6 lg:p-8 lg:pl-6 overflow-y-auto">
                              <div className="space-y-4">
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

                                <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">
                                  {ev.title}
                                </h3>

                                {(ev.short_description || ev.description) && (
                                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                    {ev.short_description || ev.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-3">
                                  {ev.speaker && (
                                    <div className="flex items-center gap-1.5 text-gray-300 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                      </svg>
                                      {ev.speaker}
                                    </div>
                                  )}
                                  <div className="text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                                    {ev.registration_fee || 'FREE'}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 mt-4">
                                <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-3">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-2">Event Starts In</p>
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

                                <a
                                  href={ev.registration_link || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-xl text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                                >
                                  CLICK HERE TO REGISTER <span className="text-base">👆</span>
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })()}
                    </AnimatePresence>
                  </div>

                  {upcomingEvents.length > 1 && (
                    <>
                      <button onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200"
                        style={{ background: 'linear-gradient(135deg, rgba(242,77,194,0.15), rgba(44,151,255,0.15))', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                        aria-label="Previous event">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </button>
                      <button onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200"
                        style={{ background: 'linear-gradient(135deg, rgba(242,77,194,0.15), rgba(44,151,255,0.15))', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                        aria-label="Next event">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {upcomingEvents.length > 1 && (
                  <div className="flex justify-center gap-2 mt-5">
                    {upcomingEvents.map((_, i) => (
                      <button key={i}
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

                {paused && upcomingEvents.length > 1 && (
                  <p className="text-center text-gray-600 text-xs mt-2">Auto-sliding paused</p>
                )}
              </motion.div>
            )}
          </motion.section>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PAST EVENTS
        ══════════════════════════════════════════════════════════════════ */}
        <motion.section
        className="py-24 px-0 relative overflow-hidden"
        initial={{ opacity: 0 }}            // removed y offset
        whileInView={{ opacity: 1 }}
        // transition={{ duration: 0.5, ease: 'easeOut', type: 'tween' }}
        viewport={{ once: true, margin: "-150px" }}
      >
        <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0072FF] to-transparent mb-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          // transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        />

        {/* ── Unified heading ── */}
           <h2
             className="mb-3 text-center uppercase text-white px-4"
             style={sectionHeadingStyle}
           >
             PAST EVENTS
           </h2>

        <p className="text-center text-gray-400 text-sm mb-10 px-4">
          A look back at what we&apos;ve built — hover to pause, click to explore
        </p>

          {pastEvents.length > 0 && (
            <div
              className="relative w-full overflow-hidden py-4"
              onMouseEnter={() => setTickerPaused(true)}
              onMouseLeave={() => setTickerPaused(false)}
              onTouchStart={() => setTickerPaused(true)}
              onTouchEnd={() => setTickerPaused(false)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #040a28 0%, transparent 100%)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #040a28 0%, transparent 100%)' }} />

              <div
                className={`ticker-track${tickerPaused ? ' paused' : ''}`}
                style={{ paddingLeft: '20px' }}
              >
                {tickerItems.map(({ evt, realIndex }, i) => (
                  <PastEventCard key={`ticker-${i}`} evt={evt} realIndex={realIndex} />
                ))}
              </div>

              {tickerPaused && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <span className="text-[10px] text-gray-400 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                    ⏸ Paused — click a card to view
                  </span>
                </div>
              )}
            </div>
          )}

          {pastEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4 opacity-30">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="text-sm">No past events yet.</p>
            </div>
          )}

          <div className="flex justify-center mt-10 px-4">
            <Link href="/#gallery">
              <motion.button
                className="bg-[#004c94] hover:bg-[#003E7A] px-6 py-3 rounded-full font-bold text-white"
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
          </div>
        </motion.section>
      </main>

      {/* Past Event Detail Modal */}
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
                    <Image
                      src={pastEvents[selectedPastIndex].poster_image_url}
                      alt={pastEvents[selectedPastIndex].title || `Past Event ${selectedPastIndex + 1}`}
                      fill className="object-contain" style={{ objectPosition: 'center' }}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {pastEvents[selectedPastIndex].title || 'Past Event'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {pastEvents[selectedPastIndex].description || 'This is a preview of the selected past event poster. Use the button below to navigate to the gallery for this event.'}
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      const pe = pastEvents[selectedPastIndex!]
                      if (pe?.gallery_folder) {
                        handleSeeGalleryClick(
                          `/#gallery?open=${encodeURIComponent(pe.gallery_folder)}`,
                          pe.gallery_folder
                        )
                      } else {
                        handleSeeGalleryClick('/#gallery')
                      }
                    }}
                    className="bg-[#004c94] hover:bg-[#003E7A] px-4 py-2 rounded text-white font-bold transition-colors"
                  >
                    See Gallery Pics
                  </button>
                  <button
                    onClick={() => setShowPastModal(false)}
                    className="px-4 py-2 rounded border border-white/10 text-white hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
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
