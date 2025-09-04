'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'fade-top' | 'fade-bottom' | 'fade-both';
}

export default function SectionTransition({ 
  children, 
  className = "", 
  id,
  variant = 'default' 
}: SectionTransitionProps) {
  return (
    <motion.section
      id={id}
      className={`relative min-h-screen ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-15%" }}
    >
      {/* Enhanced Top fade transition */}
      {(variant === 'fade-top' || variant === 'fade-both') && (
        <motion.div 
          className="fade-transition-top"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
      )}
      
      {/* Enhanced Bottom fade transition */}
      {(variant === 'fade-bottom' || variant === 'fade-both') && (
        <motion.div 
          className="fade-transition-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
      )}
      
      {/* Elegant divider line */}
      {(variant === 'fade-both' || variant === 'fade-top') && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#F24DC2]/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 128, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      )}
      
      {/* Smooth background blend overlay */}
      <div className="absolute inset-0 smooth-section-blend opacity-20 pointer-events-none" />
      
      {/* Content wrapper with enhanced background blending */}
      <motion.div 
        className="relative z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: "-10%" }}
      >
        {children}
      </motion.div>
      
      {/* Enhanced gradient overlay for extra smoothness */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(4, 10, 40, 0.1) 0%, 
            rgba(13, 27, 61, 0.2) 30%, 
            rgba(4, 10, 40, 0.6) 70%, 
            rgba(4, 10, 40, 0.8) 100%)`
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      {/* Floating particles for elegance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2]/30 to-[#2C97FF]/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
