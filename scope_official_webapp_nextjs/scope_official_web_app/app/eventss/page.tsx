"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
  event_name: string
  poster_image_url: string
  display_order: number
  is_visible: boolean
}

export default function HomePage() {
  // State for fetched events
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  // Event Card Carousel State
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [eventCountdown, setEventCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [currentSlide, setCurrentSlide] = useState(0) // 0 = Event Details, 1 = Poster
  const [selectedHexagonIndex, setSelectedHexagonIndex] = useState<number | null>(null)
  const [lastManualSlideChange, setLastManualSlideChange] = useState<number>(0) // Track manual navigation

  // Fetch upcoming events from API
  useEffect(() => {
    async function fetchEvents() {
      const start = Date.now()
      try {
        setLoading(true)
  // Allow a quick dev/admin preview mode if ?preview=true is present in the URL
  const params = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : new URLSearchParams('')
  const preview = params.get('preview') === 'true'
  // If preview mode is enabled, request the API with preview=true so the server
  // returns events regardless of status/upcoming filters (admin/dev only)
  const url = preview ? '/api/events?preview=true' : '/api/events?upcoming=true&status=published'
  const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
  const data = await response.json()
  // Debug: log the raw API response to help diagnose why no events are shown
  console.debug('Events API response:', data)
  if (preview) console.info('Events preview mode: showing events regardless of status (preview=true)')
        setUpcomingEvents(data.events || [])
        
        // Select a random event on initial load
        if (data.events && data.events.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.events.length)
          setCurrentEventIndex(randomIndex)
          setSelectedHexagonIndex(randomIndex)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        // Fallback to empty array
        setUpcomingEvents([])
      } finally {
        // Ensure the loading spinner is visible for at least 800ms so users notice it
        const elapsed = Date.now() - start
        const minDelay = 800
        const remaining = Math.max(0, minDelay - elapsed)
        setTimeout(() => setLoading(false), remaining)
      }
    }

    fetchEvents()
  }, [])

  // Fetch past events from API
  useEffect(() => {
    async function fetchPastEvents() {
      try {
        const response = await fetch('/api/past-events?visible=true')
        
        if (!response.ok) {
          throw new Error('Failed to fetch past events')
        }
        
        const data = await response.json()
        // Extract poster URLs from past events
        const posterUrls = (data.pastEvents || []).map((event: PastEvent) => event.poster_image_url)
        setPastEvents(posterUrls.length > 0 ? posterUrls : [
          "/images/past-event-1.jpg",
          "/images/past-event-2-matlab.jpg",
          "/images/past-event-3-tech.jpg"
        ])
      } catch (err) {
        console.error('Error fetching past events:', err)
        // Fallback to default images
        setPastEvents([
          "/images/past-event-1.jpg",
          "/images/past-event-2-matlab.jpg",
          "/images/past-event-3-tech.jpg"
        ])
      }
    }

    fetchPastEvents()
  }, [])

  // Smart Countdown Timer Effect - Calculates time to current event
  useEffect(() => {
    if (upcomingEvents.length === 0 || !upcomingEvents[currentEventIndex]) return

    const updateCountdown = () => {
      const currentEvent = upcomingEvents[currentEventIndex]
      if (!currentEvent || !currentEvent.event_date) return

      const eventDateTime = new Date(`${currentEvent.event_date}T${currentEvent.event_time || '00:00:00'}`).getTime()
      const now = new Date().getTime()
      const distance = eventDateTime - now

      if (distance > 0) {
        setEventCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setEventCountdown({ days: 0, hours: 0, mins: 0, secs: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [upcomingEvents, currentEventIndex])

  // Auto-carousel effect - Slides between Event Details (0) and Poster (1) every 6 seconds
  // Pauses for 6 seconds after manual navigation to prevent bad UX
  useEffect(() => {
    if (upcomingEvents.length === 0) return

    // Switch slide after 6 seconds, but reset timer if user manually navigated recently
    const slideInterval = setInterval(() => {
      const timeSinceManualChange = Date.now() - lastManualSlideChange
      // Only auto-advance if at least 6 seconds passed since last manual change
      if (timeSinceManualChange > 6000) {
        setCurrentSlide((prev) => prev === 0 ? 1 : 0)
      }
    }, 6000) // Check every 6 seconds

    return () => {
      clearInterval(slideInterval)
    }
  }, [upcomingEvents, lastManualSlideChange])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear().toString().slice(-2)
    
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' 
                 : day === 2 || day === 22 ? 'nd'
                 : day === 3 || day === 23 ? 'rd'
                 : 'th'
    
    return `${day}${suffix} ${month} ${year}`
  }

  // Transform events for honeycomb display
  const totalHexagons = 8
  const paddedEvents = loading 
    ? Array(totalHexagons).fill({ title: "Loading...", date: "" })
    : [
        ...upcomingEvents.slice(0, totalHexagons).map(event => ({
          title: event.title,
          date: formatDate(event.event_date),
          image: event.image_url,
          description: event.short_description || event.description
        })),
        ...Array(Math.max(0, totalHexagons - upcomingEvents.length)).fill({
          title: "Coming Soon",
          date: "",
        }),
      ]

  // State for Past Events Carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeThreshold = 50;

  // Effect for loading fonts
  useEffect(() => {
    // Dynamically load Google Fonts
    const orbitronLink = document.createElement("link");
    orbitronLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
    orbitronLink.rel = "stylesheet";
    document.head.appendChild(orbitronLink);
    
    const dmSansLink = document.createElement("link");
    dmSansLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap";
    dmSansLink.rel = "stylesheet";
    document.head.appendChild(dmSansLink);

    return () => {
      // Cleanup fonts on component unmount
      if (document.head.contains(orbitronLink)) {
        document.head.removeChild(orbitronLink);
      }
      if (document.head.contains(dmSansLink)) {
        document.head.removeChild(dmSansLink);
      }
    };
  }, []);

  const handlePrev = React.useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, pastEvents.length]);

  const handleNext = React.useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, pastEvents.length]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance Past Events every 5 seconds.
  // Pause while the user is hovering or while a transition is in progress.
  useEffect(() => {
    if (!pastEvents || pastEvents.length <= 1) return;

    const AUTO_MS = 5000;
    const id = setInterval(() => {
      // Respect user interactions
      if (isTransitioning) return;
      if (hoverIndex !== null) return;

      handleNext();
    }, AUTO_MS);

    return () => clearInterval(id);
  }, [pastEvents, pastEvents.length, isTransitioning, hoverIndex, handleNext]);

  // Mobile detection and modal state
  const [isMobile, setIsMobile] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [useModalMode, setUseModalMode] = useState(false) // For screens too small for side-by-side

  useEffect(() => {
    function update() {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      setIsMobile(width <= 425)
      // Use modal mode for mobile and tablets/small laptops (up to 1280px)
      // Above 1280px, there's enough space for proper side-by-side layout
      setUseModalMode(width <= 1280)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showModal])

  // Centralized hexagon click handler (opens modal on mobile/tablet)
  const handleHexagonClick = (index: number) => {
    if (index >= 0 && index < upcomingEvents.length) {
      setCurrentEventIndex(index)
      setSelectedHexagonIndex(index)
      if (useModalMode) setShowModal(true)
    }
  }

  const mobilePrev = () => {
    if (upcomingEvents.length === 0) return
    setCurrentEventIndex((prev) => (prev === 0 ? upcomingEvents.length - 1 : prev - 1))
    setSelectedHexagonIndex((prev) => (prev === null ? 0 : (prev === 0 ? upcomingEvents.length - 1 : prev - 1)))
  }

  const mobileNext = () => {
    if (upcomingEvents.length === 0) return
    setCurrentEventIndex((prev) => (prev === upcomingEvents.length - 1 ? 0 : prev + 1))
    setSelectedHexagonIndex((prev) => (prev === null ? 0 : (prev === upcomingEvents.length - 1 ? 0 : prev + 1)))
  }

  // Handle manual slide navigation with timer reset
  const handleManualSlideChange = () => {
    setCurrentSlide((prev) => prev === 0 ? 1 : 0)
    setLastManualSlideChange(Date.now()) // Reset auto-carousel timer
  }

  // Reusable event card renderer so we can show the same content in a modal on mobile
  const renderEventCard = () => {
    if (!upcomingEvents || upcomingEvents.length === 0) return null
    const ev = upcomingEvents[currentEventIndex]
    if (!ev) return null

    return (
      <div className="w-full">
        {/* Mobile/Modal-optimized card with sliding carousel (details <-> poster) */}
        <div className="relative w-full overflow-hidden">
          <div className="relative w-full bg-gradient-to-br from-[#1a1c3a] via-[#0d1b3d] to-[#1a1c3a] rounded-2xl shadow-2xl border border-white/10">
            {/* Carousel Container - responsive height: smaller on mobile, taller on tablets */}
            <div className="relative overflow-hidden rounded-2xl h-[550px] sm:h-[600px]">
              
              {/* Slide 0: Event Details */}
              <motion.div
                className="absolute inset-0 bg-[#1a1c3a] h-[550px] sm:h-[600px] will-change-transform"
                style={{ width: '100%', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                initial={false}
                animate={{ x: currentSlide === 0 ? '0%' : '-100%' }}
                transition={{ 
                  type: "tween",
                  ease: [0.25, 0.46, 0.45, 0.94],
                  duration: 0.4
                }}
              >
                {/* Banner Image - responsive height */}
                <div className="relative h-24 sm:h-32 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] overflow-hidden">
                  {ev.image_url ? (
                    <Image src={ev.image_url} alt="Event Banner" fill className="object-cover opacity-90" sizes="100vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-2xl sm:text-4xl font-bold text-white/20">EVENTS</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c3a] via-transparent to-transparent" />
                </div>

                {/* Content - single column on mobile, two columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 overflow-y-auto h-[454px] sm:h-[504px]">
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Event Name:</p>
                      <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">{ev.title}</h3>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Date & Time:</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">{formatDate(ev.event_date)}{ev.event_time && ` at ${ev.event_time}`}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Speaker:</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">{ev.speaker || 'To be announced'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Venue:</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">{ev.location || 'To be announced'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Registration Fee:</p>
                      <p className="text-lg sm:text-xl font-bold text-green-400">{ev.registration_fee || 'FREE'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">What to Expect:</p>
                      <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed">{ev.short_description || ev.description?.substring(0,120) + '...' || 'An exciting event with valuable insights.'}</p>
                    </div>

                    {/* Countdown Timer - compact */}
                    <div>
                      <div className="relative bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-500/50 rounded-lg p-2 sm:p-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <p className="text-center text-[10px] text-gray-400 uppercase tracking-wider mb-1">Event Starts In:</p>
                        <div className="flex justify-center items-center gap-1">
                          <div className="text-center">
                            <div className="bg-black/50 rounded p-1 sm:p-1.5 min-w-[35px] sm:min-w-[40px] border border-red-500/50">
                              <p className="text-base sm:text-lg font-bold text-red-500 font-mono leading-none">{eventCountdown.days.toString().padStart(2,'0')}</p>
                            </div>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Days</p>
                          </div>
                          <span className="text-sm sm:text-base text-red-500 font-bold">:</span>
                          <div className="text-center">
                            <div className="bg-black/50 rounded p-1 sm:p-1.5 min-w-[35px] sm:min-w-[40px] border border-red-500/50">
                              <p className="text-base sm:text-lg font-bold text-red-500 font-mono leading-none">{eventCountdown.hours.toString().padStart(2,'0')}</p>
                            </div>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Hrs</p>
                          </div>
                          <span className="text-sm sm:text-base text-red-500 font-bold">:</span>
                          <div className="text-center">
                            <div className="bg-black/50 rounded p-1 sm:p-1.5 min-w-[35px] sm:min-w-[40px] border border-red-500/50">
                              <p className="text-base sm:text-lg font-bold text-red-500 font-mono leading-none">{eventCountdown.mins.toString().padStart(2,'0')}</p>
                            </div>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Min</p>
                          </div>
                          <span className="text-sm sm:text-base text-red-500 font-bold">:</span>
                          <div className="text-center">
                            <div className="bg-black/50 rounded p-1 sm:p-1.5 min-w-[35px] sm:min-w-[40px] border border-red-500/50">
                              <p className="text-base sm:text-lg font-bold text-red-500 font-mono leading-none">{eventCountdown.secs.toString().padStart(2,'0')}</p>
                            </div>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">Sec</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Register Button */}
                    <a href={ev.registration_link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <div className="bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-lg p-2.5 sm:p-3 text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">CLICK HERE TO REGISTER</span>
                          <span className="text-base sm:text-lg">👆</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Slide 1: Event Poster */}
              <motion.div
                className="absolute inset-0 bg-[#1a1c3a] h-[550px] sm:h-[600px] will-change-transform"
                style={{ width: '100%', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                initial={false}
                animate={{ x: currentSlide === 1 ? '0%' : '100%' }}
                transition={{ 
                  type: "tween",
                  ease: [0.25, 0.46, 0.45, 0.94],
                  duration: 0.4
                }}
              >
                <div className="overflow-hidden rounded-2xl h-full">
                  {ev.poster_image_url ? (
                    <div className="relative w-full h-full">
                      <Image src={ev.poster_image_url} alt="Event Poster" fill className="object-cover" sizes="100vw" />
                    </div>
                  ) : ev.image_url ? (
                    <div className="relative w-full h-full">
                      <Image src={ev.image_url} alt="Event Poster" fill className="object-cover" sizes="100vw" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] h-full">
                      <div className="text-center">
                        <div className="text-6xl sm:text-8xl mb-4">🎪</div>
                        <p className="text-white text-2xl sm:text-3xl font-bold">POSTER</p>
                        <p className="text-white/70 mt-2 text-sm sm:text-base">Event poster will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Modern Sleek Navigation Arrow - switches sides with gradient glow */}
            <motion.button
              onClick={handleManualSlideChange}
              className="group absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(242, 77, 194, 0.15), rgba(44, 151, 255, 0.15))',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              animate={{ 
                left: currentSlide === 0 ? 'auto' : '0.75rem',
                right: currentSlide === 0 ? '0.75rem' : 'auto'
              }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ 
                boxShadow: '0 12px 40px rgba(242, 77, 194, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(242, 77, 194, 0.3), rgba(44, 151, 255, 0.3))'
              }}
              aria-label={currentSlide === 0 ? "View Poster" : "View Details"}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F24DC2]/0 to-[#2C97FF]/0 group-hover:from-[#F24DC2]/20 group-hover:to-[#2C97FF]/20 transition-all duration-300" />
              
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10"
                animate={{ rotate: currentSlide === 0 ? 0 : 180 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <motion.path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="url(#arrowGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="arrowGradient" x1="5" y1="12" x2="19" y2="12">
                    <stop offset="0%" stopColor="#F24DC2" />
                    <stop offset="100%" stopColor="#2C97FF" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] text-gray-200 font-sans relative overflow-hidden">
      {/* DISABLED: All background animations removed */}

      {/* Main Content Area - Use a relative z-index to place content above background */}
      <main className="relative z-10">
        {/* Upcoming Events Section - WITH SMOOTH ANIMATIONS */}
        <motion.section 
          className="py-[200px] px-[30px] bg-[#040A28] text-white relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "tween"
          }}
        >
          {/* Smooth Section Divider */}
          <motion.div
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F24DC2] to-transparent mb-16"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
          
          {/* Updated Typography to Match Past Events */}
          <motion.h2
            className="mb-12 text-center text-4xl md:text-5xl font-bold text-gray-100"
            style={{
              textShadow: '0 0 20px rgba(242, 77, 194, 0.4)',
              letterSpacing: '2px',
              fontFamily: '"Orbitron", sans-serif'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            UPCOMING EVENTS
          </motion.h2>
          {/* Helpful debug notice when there are no upcoming events */}
          {!loading && upcomingEvents.length === 0 && (
            <p className="text-center text-sm text-white-300 mb-6">No upcoming events found</p>
          )}
          
          {/* Main Container: Hexagon + Event Card Side by Side */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-[200px] items-start justify-center w-full px-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* LEFT: 🔷 Honeycomb Hexagon Layout with Smooth Animations */}
            <div className="flex flex-col items-center gap-6 mt-10 lg:mt-0 flex-shrink-0">
               <style jsx>{`
                    .hexagon {
                      clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
                      transition: all 0.3s ease;
                    }
                    .hexagon:hover {
                      background: #ff007f;
                      transform: scale(1.05);
                    }

                    /* Wrapper for each hexagon so we can hide/show entire cells responsively */
                    .hex-wrap { display: inline-block; }

                    /* Mobile: hide the entire honeycomb grid and show only a single centered hexagon */
                    @media (max-width: 425px) {
                      .honeycomb-grid { display: none !important; }
                      .mobile-single-hexagon { display: flex !important; }
                    }

                    /* Desktop: show honeycomb, hide mobile single */
                    @media (min-width: 426px) {
                      .honeycomb-grid { display: flex !important; }
                      .mobile-single-hexagon { display: none !important; }
                    }
                  `}</style>
              
              {/* Desktop: Honeycomb 3-2-3 Grid */}
              <div className="honeycomb-grid flex-col items-center gap-6">
              {/* First Row (3) with Staggered Animation */}
              <motion.div 
                className="flex justify-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {paddedEvents.slice(0, 3).map((event, index) => {
                  const eventIndex = index
                  const hasEvent = index < upcomingEvents.length
                  const isSelected = selectedHexagonIndex === eventIndex
                  
                  return (
                  <motion.div 
                    key={index} 
                    className={`relative hex-wrap ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'selected' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.0 + (index * 0.1),
                      ease: "easeOut"
                    }}
                    whileHover={hasEvent ? { 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    } : {}}
                    onClick={() => handleHexagonClick(eventIndex)}
                  >
                    {/* Pink selection border (slightly larger, behind the clipped hexagon) */}
                    <div className={`hexagon w-25 h-50 absolute sm:-inset-[6px] -inset-[10px] transition-opacity duration-300 z-0 ${
                      isSelected ? 'bg-gradient-to-br from-[#F24DC2] to-[#2C97FF] opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />

                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-0 bg-[#1a1c3a] text-white relative m-0 overflow-hidden z-10">
                      {/* Background image if event has one */}
                      {hasEvent && event.image && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="absolute inset-0 object-cover object-center sm:scale-110 scale-125 transform origin-center"
                            style={{ objectPosition: '50% 35%' }}
                            sizes="180px"
                          />
                          {/* Dark overlay for text readability - lighter on mobile */}
                          <div className="absolute inset-0 sm:bg-black/50 bg-black/20 z-20" />
                        </div>
                      )}
                      
                      {/* Fallback background when no image */}
                      {hasEvent && !event.image && (
                        <div className="hexagon w-full h-full bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] absolute inset-0" />
                      )}

                      {/* Loading spinner shown while fetching data */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center relative z-30 p-4">
                        {hasEvent && (
                          <>
                            <p className="font-semibold drop-shadow-lg">{event.title}</p>
                            {event.date && (
                              <p className="text-gray-200 text-xs mt-1 drop-shadow-md">{event.date}</p>
                            )}
                          </>
                        )}

                        {/* Fallback for empty hexagon when not loading */}
                        {!hasEvent && !loading && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 text-xs opacity-90 animate-pulse">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
              </motion.div>

              {/* Second Row (2) with Animation */}
              <motion.div 
                className="flex justify-center gap-1 -mt-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                {paddedEvents.slice(3, 5).map((event, index) => {
                  const eventIndex = index + 3
                  const hasEvent = eventIndex < upcomingEvents.length
                  const isSelected = selectedHexagonIndex === eventIndex
                  
                  return (
                  <motion.div 
                    key={index} 
                    className={`relative hex-wrap ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'selected' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.5 + (index * 0.1),
                      ease: "easeOut"
                    }}
                    whileHover={hasEvent ? { 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    } : {}}
                    onClick={() => handleHexagonClick(eventIndex)}
                  >
                    {/* Pink selection border */}
                    <div className={`hexagon w-25 h-50 absolute sm:-inset-[6px] -inset-[10px] transition-opacity duration-300 z-0 ${
                      isSelected ? 'bg-gradient-to-br from-[#F24DC2] to-[#2C97FF] opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />

                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-0 bg-[#1a1c3a] text-white relative m-0 overflow-hidden z-10">
                      {/* Background image if event has one */}
                      {hasEvent && event.image && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="absolute inset-0 object-cover object-center sm:scale-110 scale-125 transform origin-center"
                            style={{ objectPosition: '50% 35%' }}
                            sizes="180px"
                          />
                          <div className="absolute inset-0 sm:bg-black/40 bg-black/20 z-20" />
                        </div>
                      )}
                      
                      {hasEvent && !event.image && (
                        <div className="hexagon w-full h-full bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] absolute inset-0" />
                      )}

                      {/* Loading spinner shown while fetching data */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center relative z-30 p-4">
                        {hasEvent && (
                          <>
                            <p className="font-semibold drop-shadow-lg">{event.title}</p>
                            {event.date && <p className="text-gray-200 text-xs mt-1 drop-shadow-md">{event.date}</p>}
                          </>
                        )}

                        {/* Fallback for empty hexagon when not loading */}
                        {!hasEvent && !loading && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 text-xs opacity-90 animate-pulse">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
              </motion.div>

              {/* Third Row (3) with Animation */}
              <motion.div 
                className="flex justify-center gap-1 -mt-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.7 }}
              >
                {paddedEvents.slice(5, 8).map((event, index) => {
                  const eventIndex = index + 5
                  const hasEvent = eventIndex < upcomingEvents.length
                  const isSelected = selectedHexagonIndex === eventIndex
                  
                  return (
                  <motion.div 
                    key={index} 
                    className={`relative hex-wrap ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'selected' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.9 + (index * 0.1),
                      ease: "easeOut"
                    }}
                    whileHover={hasEvent ? { 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    } : {}}
                    onClick={() => handleHexagonClick(eventIndex)}
                  >
                    {/* Pink selection border */}
                    <div className={`hexagon w-25 h-50 absolute sm:-inset-[6px] -inset-[10px] transition-opacity duration-300 z-0 ${
                      isSelected ? 'bg-gradient-to-br from-[#F24DC2] to-[#2C97FF] opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />

                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-0 bg-[#1a1c3a] text-white relative m-0 overflow-hidden z-10">
                      {/* Background image if event has one */}
                      {hasEvent && event.image && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="absolute inset-0 object-cover object-center sm:scale-110 scale-125 transform origin-center"
                            style={{ objectPosition: '50% 35%' }}
                            sizes="180px"
                          />
                          <div className="absolute inset-0 sm:bg-black/40 bg-black/20 z-20" />
                        </div>
                      )}
                      
                      {hasEvent && !event.image && (
                        <div className="hexagon w-full h-full bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] absolute inset-0" />
                      )}

                      {/* Loading spinner shown while fetching data */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center relative z-30 p-4">
                        {hasEvent && ( 
                          <>
                            <p className="font-semibold drop-shadow-lg">{event.title}</p>
                            {event.date && <p className="text-gray-200 text-xs mt-1 drop-shadow-md">{event.date}</p>}
                          </>
                        )}

                        {/* Fallback for empty hexagon when not loading */}
                        {!hasEvent && !loading && (
                          <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 text-xs opacity-90 animate-pulse">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
              </motion.div>
              </div>

              {/* Mobile: Single Centered Hexagon with Background Image */}
              <div className="mobile-single-hexagon flex-col items-center justify-center w-full">
                {!loading && upcomingEvents.length > 0 && selectedHexagonIndex !== null && selectedHexagonIndex < upcomingEvents.length && (
                  <motion.div
                    key={selectedHexagonIndex}
                    className="relative cursor-pointer mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleHexagonClick(selectedHexagonIndex)}
                  >
                    {/* Pink selection border - larger for mobile (behind the clipped hexagon) */}
                    {/*<div className="hexagon w-48 h-56 absolute sm:-inset-[8px] -inset-[10px] bg-gradient-to-br from-[#F24DC2] to-[#2C97FF] opacity-100 z-0" />*/}
                    
                    {/* Main hexagon with background image */}
                    <div className="hexagon w-44 h-52 flex items-center justify-center text-center bg-[#1a1c3a] text-white relative m-0 overflow-hidden z-10">
                      {/* Background image inside hexagon */}
                      {upcomingEvents[selectedHexagonIndex].image_url && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                          <Image
                            src={upcomingEvents[selectedHexagonIndex].image_url}
                            alt={upcomingEvents[selectedHexagonIndex].title}
                            fill
                            className="absolute inset-0 object-cover object-center sm:scale-110 scale-125 transform origin-center"
                            style={{ objectPosition: '50% 15%' }}
                            sizes="(max-width: 425px) 200px, 180px"
                          />
                          {/* Dark overlay for text readability - lighter on mobile */}
                          <div className="absolute inset-0 sm:bg-black/50 bg-black/20 z-20" />
                        </div>
                      )}
                      
                      {/* No image fallback */}
                      {!upcomingEvents[selectedHexagonIndex].image_url && (
                        <div className="hexagon w-full h-full bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d] absolute inset-0" />
                      )}
                      
                      {/* Text content overlay */}
                      <div className="flex flex-col items-center justify-center relative z-10 px-4">
                        <p className="font-bold text-base text-white drop-shadow-lg">{upcomingEvents[selectedHexagonIndex].title}</p>
                        <p className="text-gray-200 text-xs mt-2 drop-shadow-md">{formatDate(upcomingEvents[selectedHexagonIndex].event_date)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {loading && (
                  <div className="relative mx-auto">
                    <div className="hexagon w-48 h-56 absolute inset-0 bg-pink-500 opacity-35" />
                    <div className="hexagon w-44 h-52 flex items-center justify-center text-center bg-[#1a1c3a] text-white relative m-0">
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-10 h-10 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Carousel Controls - shown only on mobile beneath the single hexagon */}
              {isMobile && upcomingEvents.length > 1 && !loading && (
                <motion.div 
                  className="flex items-center justify-center gap-6 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <button
                    onClick={mobilePrev}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    aria-label="Previous Event"
                  >
                    ‹
                  </button>
                  <div className="text-white text-sm font-semibold bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                    {selectedHexagonIndex !== null ? selectedHexagonIndex + 1 : 1} / {upcomingEvents.length}
                  </div>
                  <button
                    onClick={mobileNext}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    aria-label="Next Event"
                  >
                    ›
                  </button>
                </motion.div>
              )}
            </div>

            {/* RIGHT: Event Details Card or Loading Placeholder - HIDDEN when not enough width (<=1280px) */}
            {loading ? (
              <div className="hidden xl:flex flex-1 max-w-4xl items-center justify-center">
                <div className="w-full max-w-2xl bg-gradient-to-br from-[#1a1c3a] via-[#0d1b3d] to-[#1a1c3a] rounded-2xl shadow-2xl border border-white/10 p-12 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                  <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-white/8 rounded animate-pulse" />
                  <div className="w-2/3 h-4 bg-white/8 rounded animate-pulse" />
                </div>
              </div>
            ) : upcomingEvents.length > 0 && upcomingEvents[currentEventIndex] && (
              <div className="hidden xl:flex flex-1 max-w-4xl flex-col items-center justify-center gap-4">
                {/* Event Card Container with Horizontal Sliding */}
                <div className="relative w-full overflow-hidden">
                  
                  {/* Main Event Card - Horizontal Carousel */}
                  <motion.div
                    className="relative w-full bg-gradient-to-br from-[#1a1c3a] via-[#0d1b3d] to-[#1a1c3a] rounded-2xl shadow-2xl border border-white/10"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {/* Carousel Container - Slides Horizontally */}
                    <div className="relative overflow-hidden rounded-2xl min-h-[680px]">
                      {/* Event Details Slide */}
                      <motion.div
                        className="w-full absolute inset-0 will-change-transform"
                        style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                        initial={false}
                        animate={{ x: currentSlide === 0 ? '0%' : '-100%' }}
                        transition={{ 
                          type: "tween",
                          ease: [0.25, 0.46, 0.45, 0.94],
                          duration: 0.4
                        }}
                      >
                        {/* Event Banner Image */}
                        <div className="relative h-56 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] overflow-hidden">
                          {upcomingEvents[currentEventIndex].image_url ? (
                            <Image
                              src={upcomingEvents[currentEventIndex].image_url}
                              alt="Event Banner"
                              fill
                              className="object-cover opacity-90"
                              sizes="100vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-5xl font-bold text-white/20">EVENTS</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c3a] via-transparent to-transparent"></div>
                        </div>

                        {/* Content Grid - 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                      
                          {/* LEFT COLUMN - Event Details */}
                          <div className="space-y-3">
                        {/* Event Name */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Event Name:</p>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]">
                            {upcomingEvents[currentEventIndex].title}
                          </h3>
                        </div>

                        {/* Date & Time */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time:</p>
                          <p className="text-white font-semibold">
                            {formatDate(upcomingEvents[currentEventIndex].event_date)}
                            {upcomingEvents[currentEventIndex].event_time && 
                              ` at ${upcomingEvents[currentEventIndex].event_time}`
                            }
                          </p>
                        </div>

                        {/* Speaker */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Speaker:</p>
                          <p className="text-white font-semibold">
                            {upcomingEvents[currentEventIndex].speaker || 'To be announced'}
                          </p>
                        </div>

                        {/* Venue */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Venue:</p>
                          <p className="text-white font-semibold">
                            {upcomingEvents[currentEventIndex].location || 'To be announced'}
                          </p>
                        </div>

                        {/* Registration Fee */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Registration Fee:</p>
                          <p className="text-2xl font-bold text-green-400">
                            {upcomingEvents[currentEventIndex].registration_fee || 'FREE'}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT COLUMN - Countdown & What to Expect */}
                      <div className="space-y-4">
                        
                        {/* What to Expect */}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">What to Expect:</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {upcomingEvents[currentEventIndex].short_description || 
                             upcomingEvents[currentEventIndex].description?.substring(0, 150) + '...' ||
                             'An exciting event with valuable insights.'}
                          </p>
                        </div>

                        {/* Countdown Timer */}
                        <div>
                          <motion.div 
                            className="relative bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-500/50 rounded-lg p-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                            whileHover={{ 
                              boxShadow: "0 0 30px rgba(59,130,246,0.5)",
                              scale: 1.01 
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-2">Event Starts In:</p>
                            <div className="flex justify-center items-center gap-2">
                              {/* Days */}
                              <div className="text-center">
                                <div className="bg-black/50 rounded p-2 min-w-[50px] border border-red-500/50">
                                  <p className="text-2xl font-bold text-red-500 font-mono leading-none" style={{ 
                                    textShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                                    fontFamily: 'monospace'
                                  }}>
                                    {eventCountdown.days.toString().padStart(2, '0')}
                                  </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Days</p>
                              </div>
                              <span className="text-xl text-red-500 font-bold">:</span>
                              {/* Hours */}
                              <div className="text-center">
                                <div className="bg-black/50 rounded p-2 min-w-[50px] border border-red-500/50">
                                  <p className="text-2xl font-bold text-red-500 font-mono leading-none" style={{ 
                                    textShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                                    fontFamily: 'monospace'
                                  }}>
                                    {eventCountdown.hours.toString().padStart(2, '0')}
                                  </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Hrs</p>
                              </div>
                              <span className="text-xl text-red-500 font-bold">:</span>
                              {/* Minutes */}
                              <div className="text-center">
                                <div className="bg-black/50 rounded p-2 min-w-[50px] border border-red-500/50">
                                  <p className="text-2xl font-bold text-red-500 font-mono leading-none" style={{ 
                                    textShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                                    fontFamily: 'monospace'
                                  }}>
                                    {eventCountdown.mins.toString().padStart(2, '0')}
                                  </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Min</p>
                              </div>
                              <span className="text-xl text-red-500 font-bold">:</span>
                              {/* Seconds */}
                              <div className="text-center">
                                <div className="bg-black/50 rounded p-2 min-w-[50px] border border-red-500/50">
                                  <p className="text-2xl font-bold text-red-500 font-mono leading-none" style={{ 
                                    textShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                                    fontFamily: 'monospace'
                                  }}>
                                    {eventCountdown.secs.toString().padStart(2, '0')}
                                  </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Sec</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Register Button */}
                        <motion.a
                          href={upcomingEvents[currentEventIndex].registration_link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-lg p-4 text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-base font-bold text-white">CLICK HERE TO REGISTER</span>
                              <motion.span
                                className="text-xl"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                👆
                              </motion.span>
                            </div>
                          </div>
                        </motion.a>
                      </div>
                    </div>
                      </motion.div>

                      {/* Poster Slide */}
                      <motion.div
                        className="absolute inset-0 bg-[#1a1c3a] will-change-transform"
                        style={{ width: '100%', height: '600px', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                        initial={false}
                        animate={{ x: currentSlide === 1 ? '0%' : '100%' }}
                        transition={{ 
                          type: "tween",
                          ease: [0.25, 0.46, 0.45, 0.94],
                          duration: 0.4
                        }}
                      >
                        {/* Poster Content - Full Container */}
                        <div className="overflow-hidden rounded-2xl" style={{ width: '100%', height: '1000px' }}>
                              {upcomingEvents[currentEventIndex].poster_image_url ? (
                                <div className="relative" style={{ width: '100%', height: '1000px' }}>
                                  <Image src={upcomingEvents[currentEventIndex].poster_image_url as string} alt="Event Poster" fill className="object-cover" sizes="100vw" />
                                </div>
                              ) : upcomingEvents[currentEventIndex].image_url ? (
                                <div className="relative" style={{ width: '100%', height: '1000px' }}>
                                  <Image src={upcomingEvents[currentEventIndex].image_url as string} alt="Event Poster" fill className="object-cover" sizes="100vw" />
                                </div>
                              ) : (
                            <div className="flex items-center justify-center bg-gradient-to-br from-[#1a1c3a] to-[#0d1b3d]" style={{ width: '100%', height: '600px' }}>
                              <div className="text-center">
                                <div className="text-8xl mb-4">🎪</div>
                                <p className="text-white text-3xl font-bold">POSTER</p>
                                <p className="text-white/70 mt-2 text-lg">Event poster will appear here</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Modern Sleek Navigation Arrow - desktop version with gradient glow */}
                    <motion.button
                      onClick={handleManualSlideChange}
                      className="group absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(242, 77, 194, 0.15), rgba(44, 151, 255, 0.15))',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                      animate={{ 
                        left: currentSlide === 0 ? 'auto' : '1.5rem',
                        right: currentSlide === 0 ? '1.5rem' : 'auto'
                      }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      whileHover={{ 
                        boxShadow: '0 12px 40px rgba(242, 77, 194, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        background: 'linear-gradient(135deg, rgba(242, 77, 194, 0.3), rgba(44, 151, 255, 0.3))'
                      }}
                      aria-label={currentSlide === 0 ? "View Poster" : "View Details"}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F24DC2]/0 to-[#2C97FF]/0 group-hover:from-[#F24DC2]/20 group-hover:to-[#2C97FF]/20 transition-all duration-300" />
                      
                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="relative z-10"
                        animate={{ rotate: currentSlide === 0 ? 0 : 180 }}
                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <motion.path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="url(#arrowGradientDesktop)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="arrowGradientDesktop" x1="5" y1="12" x2="19" y2="12">
                            <stop offset="0%" stopColor="#F24DC2" />
                            <stop offset="100%" stopColor="#2C97FF" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    </motion.button>
                  </motion.div>
              </div>
            </div>
            )}
          </motion.div>
        </motion.section>


        {/* Past Events Section - WITH SMOOTH ANIMATIONS */}
        <motion.section 
          className="text-center py-24 px-4 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut",
            type: "tween"
          }}
          viewport={{ once: true, margin: "-150px" }}
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
            style={{
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px',
              fontFamily: '"Orbitron", sans-serif'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 30px rgba(138, 64, 255, 0.6)",
              transition: { duration: 0.3 }
            }}
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
            {/* Stable arrow buttons: CSS handles hover transform while preserving initial translate to avoid layout jumps */}
            <style jsx>{`
              /* Make arrows available on all screen sizes, but smaller / subtler on mobile */
              .arrow-btn { position: absolute; top: 50%; z-index: 20; color: white; font-size: 1.6rem; padding: 0.25rem 0.5rem; display: block; background: rgba(0,0,0,0.25); border-radius: 8px; backdrop-filter: blur(6px); }
              .arrow-btn:focus { outline: none; }
              /* Desktop: larger and more offset */
              @media (min-width: 768px) {
                .arrow-btn { font-size: 2.2rem; padding: 0.5rem; background: transparent; }
              }
              /* Keep the centering translate in the same rule that also applies scale on hover so transforms don't get overwritten */
              .arrow-btn.left { left: 0.5rem; transform: translate(-25%, -50%); }
              .arrow-btn.right { right: 0.5rem; transform: translate(25%, -50%); }
              .arrow-btn:hover { color: #d1d5db; }
              .arrow-btn.left:hover { transform: translate(-30%, -50%) scale(1.06); }
              .arrow-btn.right:hover { transform: translate(30%, -50%) scale(1.06); }
            `}</style>

            <button
              onClick={handlePrev}
              className="arrow-btn left"
              aria-label="Previous"
            >
              &lt;
            </button>
            <motion.div
              className="flex justify-center items-center relative h-[650px] overflow-visible cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (diff > swipeThreshold) handleNext();
                else if (diff < -swipeThreshold) handlePrev();
              }}
              onMouseDown={(e) => setTouchStartX(e.clientX)}
              onMouseUp={(e) => {
                const diff = touchStartX - e.clientX;
                if (diff > swipeThreshold) handleNext();
                else if (diff < -swipeThreshold) handlePrev();
              }}
            >
              {pastEvents.map((src, index) => {
                const relativeIndex = (index + pastEvents.length - currentIndex) % pastEvents.length;
                const isHovered = hoverIndex === index;
                const isCenter = relativeIndex === 0 && hoverIndex === null;

                // Responsive poster sizes: smaller on mobile, medium on small screens, large on desktop
                // Base (mobile): w-64 h-[420px]; sm: w-80 h-[550px]; lg: w-96 h-[700px]
                let styleClass = "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover ";

                if (relativeIndex === 0) {
                  styleClass += (isHovered || isCenter
                    ? "w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px] z-30 scale-100 opacity-100"
                    : "w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px] z-20 scale-95 opacity-90");
                } else if (relativeIndex === 1) {
                  // Right-side poster (translate positive). Use smaller translate on mobile and larger on sm+
                  styleClass += (isHovered
                    ? "sm:translate-x-[230px] translate-x-[170px] scale-100 z-30 opacity-100 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                    : "sm:translate-x-[220px] translate-x-[160px] scale-90 z-10 opacity-60 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]");
                } else if (relativeIndex === pastEvents.length - 1) {
                  // Left-side poster (translate negative)
                  styleClass += (isHovered
                    ? "sm:-translate-x-[230px] -translate-x-[170px] scale-100 z-30 opacity-100 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]"
                    : "sm:-translate-x-[220px] -translate-x-[160px] scale-90 z-10 opacity-60 w-64 h-[420px] sm:w-80 sm:h-[550px] lg:w-96 lg:h-[700px]");
                } else {
                  styleClass += "opacity-0 pointer-events-none";
                }
                
                return (
                  <Image
                    key={index}
                    src={src}
                    alt={`Past Event ${index + 1}`}
                    width={320}
                    height={420}
                    className={styleClass}
                    draggable={false}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleImageClick(index)}
                  />
                );
              })}
            </motion.div>
            <button
              onClick={handleNext}
              className="arrow-btn right"
              aria-label="Next"
            >
              &gt;
            </button>
          </motion.div>

          <Link href="/#gallery">
            <motion.button 
              className="mt-12 bg-[#004c94] hover:bg-[#003E7A] border-[#004c94] px-6 py-3 rounded-full font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#003E7A",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              KNOW MORE
            </motion.button>
          </Link>
        </motion.section>
      </main>

  {/* Decorative Bottom-Right Circuit Image - STATIC */}
      {/* Modal / Drawer - shows when a hexagon is clicked on mobile/tablet (useModalMode: <=1280px) */}
      {useModalMode && showModal && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" 
          role="dialog" 
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-br from-[#040A28] via-[#0d1b3d] to-[#040A28] rounded-t-3xl shadow-2xl border-t border-white/20 max-h-[95vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="sticky top-0 z-10 bg-[#040A28]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Event Details</h3>
              <button 
                onClick={() => setShowModal(false)} 
                aria-label="Close" 
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              >
                ✕
              </button>
            </div>
            
            {/* Event card content - optimized for mobile with extra bottom padding */}
            <div className="p-4 pb-20">
              {renderEventCard()}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0">
        <Image
          src="/images/circuit-deco.png"
          alt="Circuit Decoration"
          width={256}
          height={256}
        />
      </div>
    </div>
  );
} 
