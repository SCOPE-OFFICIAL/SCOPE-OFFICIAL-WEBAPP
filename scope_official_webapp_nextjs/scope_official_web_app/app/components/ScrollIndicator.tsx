'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
  nextSectionName: string;
  isVisible: boolean;
}

export default function ScrollIndicator({ nextSectionName, isVisible }: ScrollIndicatorProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setShouldShow(isVisible);
  }, [isVisible]);

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full px-6 py-3 shadow-lg backdrop-blur-md border border-white/20">
        <div className="flex items-center space-x-3 text-white">
          <span className="text-sm font-medium">
            Scroll further to go to {nextSectionName}
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
