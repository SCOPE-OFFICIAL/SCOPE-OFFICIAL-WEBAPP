"use client";

import { useViewMode } from "./components/ViewModeContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ScrollAnimation from "./components/ScrollAnimationFixed";
import ScrollProgress from "./components/ScrollProgress";
import OriginalHomePage from "./components/OriginalHomePage";
import AboutUsPage from "./aboutus/page";
import TeamsPage from "./teams/page";
import EventsPage from "./eventss/page";
import FaqPage from "./faq/page";
import Gallery from "./components/Gallery";
import TeamMembers from "./components/TeamMembers";
import SectionTransition from "./components/SectionTransition";
import AnimatedButton from "./components/AnimatedButton";

// Original Home Page Component with Enhanced Animations
function OriginalHome() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      {/* High Quality Circuit Board Video Background */}
      <motion.div 
        className="absolute inset-0 opacity-70"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/circuitvid2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
      
      {/* Subtle dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Floating Particles Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          // Static positions for particles
          const particlePositions = [
            { left: '10%', top: '20%' }, { left: '30%', top: '15%' }, { left: '50%', top: '25%' },
            { left: '70%', top: '10%' }, { left: '90%', top: '30%' }, { left: '20%', top: '60%' },
            { left: '40%', top: '70%' }, { left: '80%', top: '65%' }
          ];
          const particleDurations = [4, 5, 6, 5.5, 4.5, 6.5, 4.2, 5.8];
          const particleDelays = [0, 0.5, 1, 1.5, 2, 0.3, 0.8, 1.3];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full"
              style={{
                left: particlePositions[i].left,
                top: particlePositions[i].top,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particleDurations[i],
                repeat: Infinity,
                delay: particleDelays[i],
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
      
      <ScrollAnimation>
        <div className="text-center space-y-6 px-4 relative z-10">
          {/* Enhanced SCOPE Title Animation */}
          <motion.div 
            className="group cursor-pointer relative"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] transition-transform duration-500 ease-out group-hover:-translate-y-3"
              whileHover={{ 
                scale: 1.05,
                filter: "drop-shadow(0 0 20px rgba(242, 77, 194, 0.5))"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              SCOPE
            </motion.h1>
            <motion.p 
              className="text-sm md:text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out absolute top-full -mt-1 text-center left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap group-hover:translate-y-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              Society of Core Oriented Projects
            </motion.p>
          </motion.div>
          
          {/* Animated Tagline */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.7,
              ease: "easeOut"
            }}
          >
            Wired for Innovation, Powered by Passion
          </motion.p>
          
          {/* Animated Description */}
          <motion.div 
            className="text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.0,
              ease: "easeOut"
            }}
          >
            Exploring the frontiers of electronics and circuit design
          </motion.div>

          {/* Optional CTA Button with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.3,
              type: "spring",
              stiffness: 200
            }}
            className="pt-8"
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              className="px-8 py-3 opacity-80 hover:opacity-100"
            >
              Explore Our Projects
            </AnimatedButton>
          </motion.div>
        </div>
      </ScrollAnimation>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/50"
        >
          <span className="text-xs mb-2">Scroll to explore</span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-white/40 rounded-full mt-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Unified Scroll Component with Section Transitions
function UnifiedScroll() {
  const sections = ["Home", "Events", "About Us", "Teams", "Team Members", "Gallery", "FAQ"];
  
  return (
    <div className="unified-scroll-container">
      <ScrollProgress sections={sections} />
      
      {/* Section 1: Home */}
      <SectionTransition id="Home" variant="fade-bottom">
        <OriginalHomePage />
      </SectionTransition>

      {/* Section 2: Events */}
      <SectionTransition id="Events" variant="fade-both">
        <EventsPage />
      </SectionTransition>

      {/* Section 3: About Us */}
      <SectionTransition id="About Us" variant="fade-both">
        <AboutUsPage />
      </SectionTransition>

      {/* Section 4: Teams */}
      <SectionTransition id="Teams" variant="fade-both">
        <TeamsPage />
      </SectionTransition>

      {/* Section 5: Team Members */}
      <SectionTransition id="Team Members" variant="fade-both">
        <TeamMembers />
      </SectionTransition>

      {/* Section 6: Gallery */}
      <SectionTransition id="Gallery" variant="fade-both">
        <Gallery />
      </SectionTransition>

      {/* Section 7: FAQ */}
      <SectionTransition id="FAQ" variant="fade-top">
        <FaqPage />
      </SectionTransition>
    </div>
  );
}

export default function HomePage() {
  const { viewMode } = useViewMode();

  // Manage body class based on view mode
  useEffect(() => {
    if (viewMode === 'scroll') {
      document.body.classList.add('unified-scroll-active');
    } else {
      document.body.classList.remove('unified-scroll-active');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('unified-scroll-active');
    };
  }, [viewMode]);

  return viewMode === 'scroll' ? <UnifiedScroll /> : <OriginalHome />;
}