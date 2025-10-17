"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

  // Fetch upcoming events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const response = await fetch('/api/events?upcoming=true&status=published')
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
        const data = await response.json()
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
        setLoading(false)
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
  useEffect(() => {
    if (upcomingEvents.length === 0) return

    // Switch slide after 6 seconds
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => prev === 0 ? 1 : 0)
    }, 6000) // 6 seconds

    return () => {
      clearInterval(slideInterval)
    }
  }, [upcomingEvents])

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

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

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
                  `}</style>
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
                    className={`relative ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                    onClick={() => {
                      if (hasEvent) {
                        setCurrentEventIndex(eventIndex)
                        setSelectedHexagonIndex(eventIndex)
                      }
                    }}
                  >
                    {/* Pink selection border */}
                    <div className={`hexagon w-25 h-50 absolute inset-0 transition-opacity duration-300 ${
                      isSelected ? 'bg-pink-500 opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      {hasEvent && (
                        <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        {hasEvent && (
                          <>
                            <p className="font-semibold">{event.title}</p>
                            {event.date && (
                              <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                            )}
                          </>
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
                    className={`relative ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                    onClick={() => {
                      if (hasEvent) {
                        setCurrentEventIndex(eventIndex)
                        setSelectedHexagonIndex(eventIndex)
                      }
                    }}
                  >
                    {/* Pink selection border */}
                    <div className={`hexagon w-25 h-50 absolute inset-0 transition-opacity duration-300 ${
                      isSelected ? 'bg-pink-500 opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      {hasEvent && <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />}
                      <div className="flex flex-col items-center relative z-10">
                        {hasEvent && (
                          <>
                            <p className="font-semibold">{event.title}</p>
                            {event.date && <p className="text-gray-300 text-xs mt-1">{event.date}</p>}
                          </>
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
                    className={`relative ${hasEvent ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                    onClick={() => {
                      if (hasEvent) {
                        setCurrentEventIndex(eventIndex)
                        setSelectedHexagonIndex(eventIndex)
                      }
                    }}
                  >
                    {/* Pink selection border */}
                    <div className={`hexagon w-25 h-50 absolute inset-0 transition-opacity duration-300 ${
                      isSelected ? 'bg-pink-500 opacity-100' : 'bg-pink-500 opacity-35'
                    }`} />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      {hasEvent && (
                        <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        {hasEvent && ( 
                          <>
                            <p className="font-semibold">{event.title}</p>
                            {event.date && <p className="text-gray-300 text-xs mt-1">{event.date}</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* RIGHT: Event Details Card */}
            {upcomingEvents.length > 0 && upcomingEvents[currentEventIndex] && (
              <div className="flex-1 max-w-4xl flex flex-col items-center justify-center gap-4">
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
                        className="w-full absolute inset-0"
                        initial={false}
                        animate={{ x: currentSlide === 0 ? 0 : '-100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {/* Event Banner Image */}
                        <div className="relative h-56 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] overflow-hidden">
                          {upcomingEvents[currentEventIndex].image_url ? (
                            <img
                              src={upcomingEvents[currentEventIndex].image_url}
                              alt="Event Banner"
                              className="w-full h-full object-cover opacity-90"
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
                        className="absolute inset-0 bg-[#1a1c3a]"
                        style={{ width: '100%', height: '600px' }}
                        initial={false}
                        animate={{ x: currentSlide === 1 ? 0 : '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {/* Poster Content - Full Container */}
                        <div className="overflow-hidden rounded-2xl" style={{ width: '100%', height: '1000px' }}>
                          {upcomingEvents[currentEventIndex].poster_image_url ? (
                            <img
                              src={upcomingEvents[currentEventIndex].poster_image_url}
                              alt="Event Poster"
                              className="object-cover"
                              style={{ width: '100%', height: '1000px' }}
                            />
                          ) : upcomingEvents[currentEventIndex].image_url ? (
                            <img
                              src={upcomingEvents[currentEventIndex].image_url}
                              alt="Event Poster"
                              className="object-cover"
                              style={{ width: '100%', height: '1000px' }}
                            />
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
            <motion.button
              onClick={handlePrev}
              className="absolute left-0 -translate-x-1/2 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4 hidden md:block"
              whileHover={{ scale: 1.2, x: -10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              &lt;
            </motion.button>
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

                let styleClass = "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover ";
                
                if (relativeIndex === 0) {
                  styleClass += (isHovered || isCenter ? "w-96 h-[700px] z-30 scale-100 opacity-100" : "w-80 h-[550px] z-20 scale-95 opacity-90");
                } else if (relativeIndex === 1) {
                  styleClass += (isHovered ? "translate-x-[230px] scale-100 z-30 opacity-100 w-96 h-[700px]" : "translate-x-[220px] scale-90 z-10 opacity-60 w-80 h-[550px]");
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass += (isHovered ? "-translate-x-[230px] scale-100 z-30 opacity-100 w-96 h-[700px]" : "-translate-x-[220px] scale-90 z-10 opacity-60 w-80 h-[550px]");
                } else {
                  styleClass += "opacity-0 pointer-events-none";
                }
                
                return (
                  <img
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
            <motion.button
              onClick={handleNext}
              className="absolute right-0 translate-x-1/2 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4 hidden md:block"
              whileHover={{ scale: 1.2, x: 10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              &gt;
            </motion.button>
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
      <div className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0">
        <img 
          src="/images/circuit-deco.png"
          alt="Circuit Decoration"
          width={256}
          height={256}
        />
      </div>
    </div>
  );
} 
