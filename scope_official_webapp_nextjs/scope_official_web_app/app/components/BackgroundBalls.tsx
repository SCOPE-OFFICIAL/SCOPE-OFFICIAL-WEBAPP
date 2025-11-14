"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function BackgroundBalls() {
  // Positions and timings are tuned for subtlety and low CPU on most devices
  const ballPositions = useMemo(() => [
    { left: '10%', top: '20%' },
    { left: '80%', top: '10%' },
    { left: '20%', top: '80%' },
    { left: '70%', top: '60%' }
  ], []);
  
  const ballDurations = useMemo(() => [12, 14, 10, 11], []);

  const particlePositions = useMemo(() => [
    { left: '5%', top: '15%' }, { left: '25%', top: '25%' },
    { left: '65%', top: '15%' }, { left: '85%', top: '25%' },
    { left: '35%', top: '65%' }, { left: '55%', top: '75%' },
    { left: '95%', top: '45%' }, { left: '25%', top: '85%' }
  ], []);
  
  const particleDurations = useMemo(() => [9, 8, 10, 9, 9, 10, 8, 9], []);
  const particleDelays = useMemo(() => [0, 0.25, 0.5, 0.75, 0.3, 0.4, 0.2, 0.35], []);

  return (
    <>
      {/* Large gradient balls */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ contain: 'layout style paint' }}>
        {ballPositions.map((pos, i) => (
          <motion.div
            key={`ball-${i}`}
            className="absolute w-72 h-72 rounded-full opacity-5"
            style={{ 
              left: pos.left, 
              top: pos.top, 
              background: 'linear-gradient(45deg, #F24DC2, #2C97FF)',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)'
            }}
            animate={{ x: [0, 80, 0], y: [0, -80, 0] }}
            transition={{ duration: ballDurations[i] ?? 30, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Small floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ contain: 'layout style paint' }}>
        {particlePositions.map((pos, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              left: pos.left, 
              top: pos.top, 
              background: 'linear-gradient(90deg, #F24DC2, #2C97FF)',
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)'
            }}
            animate={{ y: [0, -5, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: particleDurations[i] ?? 20, repeat: Infinity, delay: particleDelays[i] ?? 0, ease: "easeInOut" }}
          />
        ))}
      </div>
    </>
  );
}
