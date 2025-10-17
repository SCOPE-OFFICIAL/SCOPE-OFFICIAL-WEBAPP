"use client";

import { useViewMode } from "./components/ViewModeContext";
import { useEffect } from "react";  
import { motion } from "framer-motion";
// import ScrollAnimation from "./components/ScrollAnimationFixed"; // DISABLED
// import ScrollProgress from "./components/ScrollProgress"; // DISABLED
import OriginalHomePage from "./components/OriginalHomePage";
import AboutUsPage from "./aboutus/page";
import TeamsPage from "./teams/page";
import EventsPage from "./eventss/page";
import FaqPage from "./faq/page";
import Gallery from "./components/Gallery";
import TeamMembers from "./components/TeamMembers";
// import SectionTransition from "./components/SectionTransition"; // DISABLED
// import AnimatedButton from "./components/AnimatedButton"; // DISABLED

// SMOOTH ANIMATED Home Page
function OriginalHome() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      {/* Animated Circuit Board Video Background */}
      <motion.div 
        className="absolute inset-0 opacity-60"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/videos/circuitvid2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
      
      {/* Subtle dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      <motion.div 
        className="text-center space-y-6 px-4 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* ANIMATED: SCOPE Title */}
        <motion.div 
          className="group cursor-pointer relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]"
            whileHover={{
              scale: 1.05,
              filter: "drop-shadow(0 0 20px rgba(242, 77, 194, 0.5))",
              transition: { duration: 0.3 }
            }}
          >
            SCOPE
          </motion.h1>
          <motion.p 
            className="text-sm md:text-base text-gray-300 opacity-0 group-hover:opacity-100 absolute top-full -mt-1 text-center left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Society of Core Oriented Projects
          </motion.p>
        </motion.div>
        
        {/* ANIMATED: Tagline */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Wired for Innovation, Powered by Passion
        </motion.p>
        
        {/* ANIMATED: Description */}
        <motion.div 
          className="text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Exploring the frontiers of electronics and circuit design
        </motion.div>

        {/* ANIMATED: CTA Button */}
        <motion.div 
          className="pt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.6, type: "spring", stiffness: 200 }}
        >
          <motion.button 
            className="px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] opacity-80 hover:opacity-100"
            whileHover={{ 
              scale: 1.05,
              opacity: 1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Projects
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ANIMATED: Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div 
          className="flex flex-col items-center text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs mb-2">Scroll to explore</span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white/40 rounded-full mt-1"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// SMOOTH ANIMATED Unified Scroll
function UnifiedScroll() {
  return (
    <div className="unified-scroll-container">
      {/* Animated Background Container for all sections except FAQ */}
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* All sections with smooth scroll animations */}
        <div className="relative z-10">
          {/* Section 1: Home */}
          <motion.div 
            id="home"
            className="min-h-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <OriginalHomePage />
          </motion.div>

          {/* Section 2: Events */}
          <motion.div 
            id="events"
            className="min-h-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <EventsPage />
          </motion.div>

          {/* Section 3: About Us */}
          <motion.div 
            id="about-us"
            className="min-h-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <AboutUsPage />
          </motion.div>

          {/* Section 4: Teams */}
          <motion.div 
            id="team"
            className="min-h-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <TeamsPage />
          </motion.div>

          {/* Section 5: Team Members */}
          <motion.div 
            className="min-h-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <TeamMembers />
          </motion.div>

          {/* Section 6: Gallery */}
          <motion.div 
            id="gallery"
            className="min-h-screen"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
          >
            <Gallery />
          </motion.div>
        </div>
      </motion.div>

      {/* Section 7: FAQ - Smooth Animation */}
      <motion.div 
        id="faq"
        className="min-h-screen"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
      >
        <FaqPage />
      </motion.div>
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