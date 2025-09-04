'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AnimatedButton from './AnimatedButton';

interface VideoHeroSectionProps {
  videoSrc: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  description: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function VideoHeroSection({
  videoSrc,
  title,
  subtitle,
  description,
  buttonText,
  onButtonClick,
}: VideoHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#040A28]"
      style={{ opacity }}
    >
      {/* Video Background */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          src={videoSrc}
          className="w-full h-full object-cover"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
        />
        
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040A28]/70 via-[#040A28]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A28]/80 via-transparent to-[#040A28]/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex items-center min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl">
            {/* Animated Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-6"
            >
              {title}
            </motion.div>

            {/* Animated Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-8"
            >
              {subtitle}
            </motion.div>

            {/* Animated Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mb-10"
            >
              {description}
            </motion.div>

            {/* Animated Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 1.4,
                type: "spring",
                stiffness: 100 
              }}
            >
              <AnimatedButton
                onClick={onButtonClick}
                variant="primary"
                size="lg"
                className="px-10 py-4"
              >
                {buttonText}
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/70"
        >
          <span className="text-sm mb-2 font-light">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
