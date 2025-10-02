"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// This would typically be in a separate components file
const AnimatedButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => (
  <motion.button
    className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </motion.button>
);

export default function HomePage() {
  const pastEvents = [
    "/images/past-event-1.jpg",
    "/images/past-event-2-matlab.jpg",
    "/images/past-event-3-tech.jpg",
  ];
  
  // Data for upcoming events honeycomb layout
  const events = [
    { title: "Orientation on Matlab", date: "15th Aug 25" },
    { title: "Hackathon", date: "28th Aug 25" },
    { title: "ARM architecture workshop", date: "10th Sept 25" },
    { title: "Empower talk", date: "5th Sept 25" },
    { title: "Current Basics", date: "12th Sept 25" },
  ];

  // Fill up to 8 slots for 3–2–3 honeycomb
  const totalHexagons = 8;
  const paddedEvents = [
    ...events,
    ...Array(totalHexagons - events.length).fill({
      title: "Coming Soon",
      date: "",
    }),
  ];

  // State for Past Events Carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeThreshold = 50;
  
  // State for Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Effect for countdown timer - Updated target date to December 25th, 2025
  useEffect(() => {
    const targetDate = new Date("2025-12-25T00:00:00").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
         setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    // Update immediately on mount
    updateCountdown();
    
    // Then update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full opacity-5"
            style={{
              background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content Area - Use a relative z-index to place content above background */}
      <main className="relative z-10">
        {/* Upcoming Events Section */}
        <section className="py-16 px-6 bg-[#040A28] text-white relative">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: '"Orbitron", sans-serif' }}
          >
            UPCOMING EVENTS
          </h2>
          <br></br>
          <br></br>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center justify-center">
            {/* 🔷 Honeycomb Hexagon Layout */}
            <div className="flex flex-col items-center gap-6 -mt-10">
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
              {/* First Row (3) */}
              <div className="flex justify-center gap-1">
                {paddedEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="relative">
                    <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      {(index === 0 || index === 2) && (
                        <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        {index !== 1 && (
                          <>
                            <p className="font-semibold">{event.title}</p>
                            {event.date && (
                              <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                            )}
                            <a href="https://www.google.com/">
                              <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Row (2) */}
              <div className="flex justify-center gap-1 -mt-12">
                {paddedEvents.slice(0, 2).map((event, index) => (
                  <div key={index} className="relative">
                    <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                      <div className="flex flex-col items-center relative z-10">
                          <>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                            <a href="https://www.google.com/">
                              <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                            </a>
                          </>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Third Row (3) */}
              <div className="flex justify-center gap-1 -mt-12">
                {paddedEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="relative">
                    <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                    <div className="hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4 bg-[#1a1c3a] text-white relative m-[2px]">
                      {index === 1 && (
                        <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        {index === 1 && ( 
                          <>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                            <a href="https://www.google.com/">
                              <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 Countdown with Neon Circular Glow */}
            <div className="flex flex-col items-center justify-center mt-10 md:mt-0">
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center border-0 border-[#550231] shadow-[0_0_80px_30px_#560C4B,inset_0_0_50px_15px_#560C4B] opacity-90">
                    <div className="absolute w-[90%] h-[90%] rounded-full flex items-center justify-center border-2 border-[#560C4B]">
                        <div className="absolute w-[80%] h-[80%] rounded-full flex items-center justify-center border-4 border-[#39184D] shadow-[0_0_15px_rgba(57,24,77,0.5)]">
                            <div className="absolute w-[90%] h-[90%] rounded-full flex items-center justify-center border-4 border-[#FB4B8C] ring-4 ring-[#0072FF] shadow-[0_0_20px_rgba(251,75,140,0.8),_0_0_20px_rgba(0,114,255,0.8)]">
                                <div className="relative w-[90%] h-[90%] rounded-full flex items-center justify-center bg-transparent">
                                    <div className="text-center">
                                        <p className="text-[#FB4B8C] text-4xl font-bold">
                                            {timeLeft.days.toString().padStart(2, "0")}
                                        </p>
                                        <p className="text-white text-lg">DAYS</p>
                                        <p className="text-[#FB4B8C] text-4xl font-bold mt-2">
                                            {timeLeft.hours.toString().padStart(2, "0")}
                                        </p>
                                        <p className="text-white text-lg">HRS</p>
                                        <p className="text-[#FB4B8C] text-2xl font-bold mt-2">
                                            {timeLeft.mins.toString().padStart(2, "0")}
                                        </p>
                                        <p className="text-white text-lg">MINS</p>
                                        <p className="text-[#FB4B8C] text-sm font-bold mt-2">
                                            {timeLeft.secs.toString().padStart(2, "0")}
                                        </p>
                                        <p className="text-white text-xs">SECS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-lg text-gray-300" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    Next event: Holiday Event
                </p>
            </div>
          </div>
        </section>


        {/* Past Events Section */}
        <motion.section
          className="text-center py-24 px-4 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0072FF] to-transparent my-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
          />
          <motion.h2
            className="mb-12 text-center text-4xl md:text-5xl font-bold text-gray-100"
            style={{
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px',
              fontFamily: '"Orbitron", sans-serif'
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            PAST EVENTS
          </motion.h2>

          <motion.div
            className="relative w-full max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
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
            <div
              className="flex justify-center items-center relative h-[420px] overflow-hidden cursor-grab active:cursor-grabbing"
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
                  styleClass += (isHovered || isCenter ? "w-80 h-[420px] z-30 scale-100 opacity-100" : "w-72 h-[400px] z-20 scale-95 opacity-90");
                } else if (relativeIndex === 1) {
                  styleClass += (isHovered ? "translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]" : "translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass += (isHovered ? "-translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]" : "-translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
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
            </div>
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

          <AnimatedButton
            className="mt-12 bg-[#004c94] hover:bg-[#003E7A] border-[#004c94]"
          >
            KNOW MORE
          </AnimatedButton>
        </motion.section>
      </main>

      {/* Decorative Bottom-Right Circuit Image */}
      <motion.div
        className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0"
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 0.6, x: 0, y: 0 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <img 
          src="/images/circuit-deco.png"
          alt="Circuit Decoration"
          width={256}
          height={256}
        />
      </motion.div>
    </div>
  );
} 