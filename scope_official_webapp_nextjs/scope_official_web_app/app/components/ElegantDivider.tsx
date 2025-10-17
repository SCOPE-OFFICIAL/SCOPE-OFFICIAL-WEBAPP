'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ElegantDividerProps {
  variant?: 'line' | 'dots' | 'wave' | 'gradient';
  className?: string;
}

export default function ElegantDivider({ 
  variant = 'gradient', 
  className = "" 
}: ElegantDividerProps) {
  
  if (variant === 'line') {
    return (
      <motion.div 
        className={`flex justify-center items-center py-8 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#F24DC2]/50 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: 200 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </motion.div>
    );
  }

  if (variant === 'dots') {
    return (
      <motion.div 
        className={`flex justify-center items-center space-x-4 py-8 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF]"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.1, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300
            }}
            viewport={{ once: true }}
          />
        ))}
      </motion.div>
    );
  }

  if (variant === 'wave') {
    return (
      <motion.div 
        className={`flex justify-center items-center py-8 ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <svg 
          width="200" 
          height="20" 
          viewBox="0 0 200 20"
          className="overflow-visible"
        >
          <motion.path
            d="M0,10 Q50,5 100,10 T200,10"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="#F24DC2" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#2C97FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  // Default gradient variant
  return (
    <motion.div 
      className={`flex justify-center items-center py-12 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="relative flex items-center"
        initial={{ width: 0 }}
        whileInView={{ width: 300 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Central gradient line */}
        <motion.div
          className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F24DC2]/40 to-[#2C97FF]/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          viewport={{ once: true }}
        />
        
        {/* Central diamond */}
        <motion.div
          className="w-3 h-3 mx-4 transform rotate-45 bg-gradient-to-br from-[#F24DC2] to-[#2C97FF] shadow-lg"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          transition={{ 
            duration: 1, 
            delay: 1,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          viewport={{ once: true }}
        />
        
        {/* Right gradient line */}
        <motion.div
          className="h-px flex-1 bg-gradient-to-r from-[#2C97FF]/40 via-[#F24DC2]/40 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          viewport={{ once: true }}
        />
      </motion.div>
    </motion.div>
  );
}
