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
  const swipeThreshold = 50;

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
              className="mb-12 lg:mb-20 text-center"
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
              whileHover={{ scale: 1.2, x: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
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

                let styleClass =
                  "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover ";

                if (relativeIndex === 0) {
                  styleClass +=
                    (isHovered || isCenter
                      ? "w-80 h-[420px] z-30 scale-100 opacity-100"
                      : "w-72 h-[400px] z-20 scale-95 opacity-90");
                } else if (relativeIndex === 1) {
                  styleClass +=
                    (isHovered
                      ? "translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                      : "translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass +=
                    (isHovered
                      ? "-translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                      : "-translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
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
            </div>

            <motion.button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
              whileHover={{ scale: 1.2, x: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ≫
            </motion.button>
          </motion.div>

          <AnimatedButton 
            variant="secondary"
            size="lg"
            className="mt-12 bg-[rgb(0,76,148)] hover:bg-[#003E7A] border-[rgb(0,76,148)]"
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
        transition={{ duration: 1.5, delay: 1 }}
      />
    </div>
  ); 
}

// This is Team Zero testing
/* This code is part of the SCOPE official web app built with Next.js.

// This is Team Zero
/* This code is part of the SCOPE official web app built with Next.js.*/

