'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrollIndicator from './ScrollIndicator';

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionName: string;
  nextSection?: string;
  className?: string;
}

export default function SectionWrapper({ 
  children, 
  sectionName, 
  nextSection, 
  className = '' 
}: SectionWrapperProps) {
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(sectionName);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementBottom = rect.bottom;
      const windowHeight = window.innerHeight;
      
      // Show indicator when we're near the bottom of this section
      setIsNearBottom(elementBottom <= windowHeight + 200 && elementBottom > windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionName]);

  return (
    <motion.section
      id={sectionName}
      className={`min-h-screen relative section-snap ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
      
      {/* Section transition overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      
      {/* Scroll indicator */}
      {nextSection && (
        <ScrollIndicator 
          nextSectionName={nextSection} 
          isVisible={isNearBottom} 
        />
      )}
    </motion.section>
  );
}
