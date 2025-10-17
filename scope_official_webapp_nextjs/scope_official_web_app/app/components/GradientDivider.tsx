'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientDividerProps {
  height?: string;
  gradientDirection?: 'to-bottom' | 'to-top';
  colors?: {
    start: string;
    middle: string;
    end: string;
  };
}

export default function GradientDivider({ 
  height = "h-24",
  gradientDirection = 'to-bottom',
  colors = {
    start: 'rgba(4, 10, 40, 0)',
    middle: 'rgba(13, 27, 61, 0.5)',
    end: 'rgba(4, 10, 40, 1)'
  }
}: GradientDividerProps) {
  const gradientStyle = {
    background: `linear-gradient(${gradientDirection}, ${colors.start} 0%, ${colors.middle} 50%, ${colors.end} 100%)`
  };

  return (
    <motion.div 
      className={`w-full ${height} relative overflow-hidden`}
      style={gradientStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      {/* Additional animated gradient overlay for extra smoothness */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(242, 77, 194, 0.02) 0%, 
            transparent 30%, 
            rgba(44, 151, 255, 0.02) 70%, 
            transparent 100%)`
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => {
          // Static positions for particles
          const particlePositions = [
            { left: '30%', top: '40%' }, { left: '60%', top: '50%' }, { left: '45%', top: '65%' }
          ];
          const particleDurations = [6, 7, 8];
          const particleDelays = [0, 0.7, 1.4];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2]/20 to-[#2C97FF]/20 rounded-full"
              style={{
                left: particlePositions[i].left,
                top: particlePositions[i].top,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
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
    </motion.div>
  );
}
