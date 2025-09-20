"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedButton from '../components/AnimatedButton';

export default function HomePage() {
  const pastEvents = [
    "/images/past-event-1.jpg",
    "/images/past-event-2-matlab.jpg",
    "/images/past-event-3-tech.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const swipeThreshold = 50;

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300); // Reduced from 600ms
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300); // Reduced from 600ms
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePosterClick = (index: number) => {
    // Store the gallery folder selection in localStorage
    if (index === 0) { // Tech Innovation Workshop -> ATLASSIAN
      localStorage.setItem('galleryFolder', 'ATLASSIAN');
    } else if (index === 1) { // MATLAB Programming Session -> MATLAB
      localStorage.setItem('galleryFolder', 'MATLAB');
    }
    
    // Close the expanded view modal first
    setShowExpandedView(false);
    
    // Small delay to ensure modal closes, then navigate
    setTimeout(() => {
      // Navigate to gallery section on main page
      window.location.href = '/#Gallery';
    }, 100);
  };

  useEffect(() => {
    // Optimize browser performance
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .motion-container {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `;
    document.head.appendChild(style);

    const orbitronLink = document.createElement("link");
    orbitronLink.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
    orbitronLink.rel = "stylesheet";
    document.head.appendChild(orbitronLink);

    const dmSansLink = document.createElement("link");
    dmSansLink.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap";
    dmSansLink.rel = "stylesheet";
    document.head.appendChild(dmSansLink);

    // Handle ESC key to close expanded view
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showExpandedView) {
        setShowExpandedView(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.head.removeChild(orbitronLink);
      document.head.removeChild(dmSansLink);
      document.head.removeChild(style);
    };
  }, [showExpandedView]);

  useEffect(() => {
    const orbitronLink = document.createElement("link");
    orbitronLink.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
    orbitronLink.rel = "stylesheet";
    document.head.appendChild(orbitronLink);

    const dmSansLink = document.createElement("link");
    dmSansLink.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap";
    dmSansLink.rel = "stylesheet";
    document.head.appendChild(dmSansLink);

    return () => {
      document.head.removeChild(orbitronLink);
      document.head.removeChild(dmSansLink);
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-200 font-sans relative">
      {/* Main Content Area */}
      <main className="container mx-auto px-8 py-16 lg:py-24 relative z-10">
        {/* Upcoming Events Section */}
        <motion.section 
          className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="lg:w-1/2 pr-8 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="mb-6 lg:mb-8 text-center"
              style={{
                fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '3.2rem',
                fontWeight: 600,
                color: 'var(--text-light)',
                textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
                letterSpacing: '2px'
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              UPCOMING EVENTS
            </motion.h2>
            
            <motion.div 
              className="font-dm-sans text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="leading-relaxed mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                SCOPE at Reva University is hosting a IEEE Lab Orientation for
                2nd-semester ECE students. This session covers key concepts, lab
                equipment, safety, and hands-on experiments, guided by expert
                mentors to build a strong foundation in electronics.
              </motion.p>
              
              <motion.h3 
                className="text-xl font-semibold mb-3 text-blue-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Key Ambitions
              </motion.h3>
              
              <motion.ul 
                className="list-disc list-inside space-y-2 mb-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                {[
                  "Lab instruments: intro to essential equipment",
                  "Basic circuits: hands-on experience", 
                  "Safety practices: key guidelines",
                  "Practical skills: experiment confidently"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            
            <AnimatedButton 
              variant="secondary"
              size="lg"
              className="bg-[rgb(0,76,148)] hover:bg-[#003E7A] border-[rgb(0,76,148)]"
            >
              REGISTER NOW
            </AnimatedButton>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="/images/upcoming-event-poster.jpg"
              alt="Upcoming Event Poster: Current Basics"
              className="rounded-lg shadow-xl max-w-full h-[619px] w-[437.42px]"
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(242, 77, 194, 0.2)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>
        </motion.section>

        {/* Past Events Section */}
        <motion.section 
          className="text-center mb-32 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="w-full h-[1px] bg-gradient-to-r from-[#EC4DC2] via-[#0072FF] to-[#040A28] my-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
          />
          
          <motion.h2 
            className="mb-12 text-center"
            style={{
              fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '3.2rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px'
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4 cursor-pointer"
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{ willChange: 'transform' }}
            >
              ≪
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
                const relativeIndex =
                  (index + pastEvents.length - currentIndex) % pastEvents.length;

                const isHovered = hoverIndex === index;
                const isCenter = relativeIndex === 0 && hoverIndex === null;

                // Calculate positions and scales for smooth Framer Motion animations
                let x = 0;
                let scale = 0.9;
                let opacity = 0.6;
                let z = 10;
                let width = 288; // w-72
                let height = 400; // h-[400px]

                if (relativeIndex === 0) {
                  x = 0;
                  scale = isHovered || isCenter ? 1 : 0.95;
                  opacity = isHovered || isCenter ? 1 : 0.9;
                  z = isHovered || isCenter ? 30 : 20;
                  width = isHovered || isCenter ? 320 : 288;
                  height = isHovered || isCenter ? 420 : 400;
                } else if (relativeIndex === 1) {
                  x = 190;
                  scale = isHovered ? 1 : 0.9;
                  opacity = isHovered ? 1 : 0.6;
                  z = isHovered ? 30 : 10;
                  width = isHovered ? 320 : 288;
                  height = isHovered ? 420 : 400;
                } else if (relativeIndex === pastEvents.length - 1) {
                  x = -190;
                  scale = isHovered ? 1 : 0.9;
                  opacity = isHovered ? 1 : 0.6;
                  z = isHovered ? 30 : 10;
                  width = isHovered ? 320 : 288;
                  height = isHovered ? 420 : 400;
                } else {
                  opacity = 0;
                  scale = 0.8;
                }

                return (
                  <motion.div
                    key={index}
                    className="absolute"
                    initial={false}
                    animate={{
                      x: x,
                      scale: scale,
                      opacity: opacity,
                      zIndex: z,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8,
                    }}
                    style={{
                      willChange: 'transform, opacity',
                    }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={src}
                      alt={`Past Event ${index + 1}`}
                      width={width}
                      height={height}
                      className="rounded-xl shadow-xl object-cover cursor-pointer"
                      draggable={false}
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4 cursor-pointer"
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{ willChange: 'transform' }}
            >
              ≫
            </motion.button>
          </motion.div>

          <AnimatedButton 
            variant="secondary"
            size="lg"
            className="mt-12 bg-[rgb(0,76,148)] hover:bg-[#003E7A] border-[rgb(0,76,148)]"
            onClick={() => setShowExpandedView(true)}
          >
            KNOW MORE
          </AnimatedButton>
        </motion.section>
      </main>

      {/* Decorative Bottom-Right Circuit Image */}
      <motion.img
        src="/images/circuit-deco.png"
        alt="Circuit Decoration"
        className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0"
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 0.6, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Expanded Posters View */}
      {showExpandedView && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={() => setShowExpandedView(false)}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            className="relative w-full max-w-7xl mx-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              ease: "easeOut"
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Close button */}
            <motion.button
              onClick={() => setShowExpandedView(false)}
              className="absolute top-4 right-4 z-60 text-white text-4xl hover:text-gray-300 cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              style={{ willChange: 'transform' }}
            >
              ✕
            </motion.button>

            {/* Title */}
            <motion.h3
              className="text-center text-white text-3xl font-bold mb-8"
              style={{
                fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
                textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
                letterSpacing: '2px',
                willChange: 'transform, opacity'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              PAST EVENTS GALLERY
            </motion.h3>

            {/* Posters Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              style={{ willChange: 'transform, opacity' }}
            >
              {pastEvents.map((src, index) => (
                <motion.div
                  key={index}
                  className={`relative group ${(index === 0 || index === 1) ? 'cursor-pointer' : 'cursor-default'}`}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.3 + index * 0.05, // Reduced staggering
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: (index === 0 || index === 1) ? 1.05 : 1.03, // More scale for clickable posters
                    rotateY: 3,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  style={{ willChange: 'transform' }}
                  onClick={() => handlePosterClick(index)}
                >
                  <Image
                    src={src}
                    alt={`Past Event ${index + 1}`}
                    width={350}
                    height={460}
                    className="rounded-xl shadow-2xl object-cover w-full h-auto max-w-[350px]"
                    draggable={false}
                    style={{ willChange: 'transform' }}
                  />
                  
                  {/* Overlay with event info */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ willChange: 'opacity' }}
                  >
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-lg font-bold mb-2">
                        {index === 0 && "Atlassian 2025"}
                        {index === 1 && "MATLAB Programming Session"}
                        {index === 2 && "Advanced Technology Seminar"}
                      </h4>
                      <p className="text-sm opacity-90">
                        {index === 0 && "Interactive technical talk on cutting-edge technology trends"}
                        {index === 1 && "Comprehensive MATLAB training for engineering students"}
                        {index === 2 && "Deep dive into emerging technologies and their applications"}
                      </p>
                      {/* Subtle click hint for specific posters */}
                      {(index === 0 || index === 1) && (
                        <motion.div
                          className="mt-3 flex items-center justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="text-xs text-blue-300 opacity-80">
                            {index === 0 && "Click to open Atlassian Workshop gallery"}
                            {index === 1 && "Click to open MATLAB Workshop gallery"}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  ); 
}

// This is Team Zero testing
/* This code is part of the SCOPE official web app built with Next.js.

// This is Team Zero
/* This code is part of the SCOPE official web app built with Next.js.*/

