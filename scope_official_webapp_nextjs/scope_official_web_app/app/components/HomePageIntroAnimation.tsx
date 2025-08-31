"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePageIntroAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  // Handle intro animation timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 2500); // ⚡ sparks animation duration
    return () => clearTimeout(timer);
  }, []);

  // Handle pixie dust trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = Date.now();
      const newParticle = { id, x: e.clientX, y: e.clientY };
      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after 1s
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* ⚡ Electricity Sparks Layer */}
      {!isAnimationComplete && (
        <motion.svg
          className="absolute inset-0 w-full h-full z-50 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[
            "M 100 250 L 180 200 L 150 150 L 250 100",
            "M 250 400 L 280 300 L 230 250 L 350 150",
            "M 120 300 L 200 280 L 180 200 L 300 180",
            "M 400 350 L 350 250 L 420 200 L 300 100",
          ].map((path, i) => (
            <motion.path
              key={i}
              d={path}
              stroke="url(#electricGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.4,
                ease: "easeInOut",
              }}
            />
          ))}

          <defs>
            <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="50%" stopColor="#9D4DFF" />
              <stop offset="100%" stopColor="#FF2CF9" />
            </linearGradient>
          </defs>
        </motion.svg>
      )}

      {/* ✨ Pixie Dust Particles (cursor trail) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            background: "radial-gradient(circle, #ffffff, transparent)",
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2, y: -10 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* 🌍 Main Content Layer */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isAnimationComplete ? 1 : 0,
          transition: { duration: 0.8 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
