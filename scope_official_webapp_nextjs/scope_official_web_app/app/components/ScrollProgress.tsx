'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollProgressProps {
  sections?: string[];
}

export default function ScrollProgress({ sections = [] }: ScrollProgressProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Show progress indicator after scrolling starts
      setIsVisible(window.scrollY > 100);

      // Calculate current section based on scroll position
      if (sections.length > 0) {
        const sectionHeight = 100 / sections.length;
        const currentSectionIndex = Math.floor(progress / sectionHeight);
        setCurrentSection(Math.min(currentSectionIndex, sections.length - 1));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-4 right-4 z-50 bg-white/5 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/10"
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center space-y-2">
            {sections.length > 0 && (
              <motion.div 
                className="text-white text-xs font-medium min-w-max"
                key={currentSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {sections[currentSection]}
              </motion.div>
            )}
            
            <div className="relative w-2 h-20 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-gradient-to-t from-[#F24DC2] to-[#2C97FF] rounded-full origin-bottom"
                initial={{ height: "0%" }}
                animate={{ height: `${scrollProgress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
              
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#F24DC2]/50 to-[#2C97FF]/50 rounded-full"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ height: `${scrollProgress}%` }}
              />
            </div>
            
            <motion.div 
              className="text-white/60 text-xs"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={Math.round(scrollProgress)}
            >
              {Math.round(scrollProgress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
