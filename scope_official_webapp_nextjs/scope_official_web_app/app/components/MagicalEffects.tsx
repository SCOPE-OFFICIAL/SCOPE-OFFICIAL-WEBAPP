"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MagicalEffects() {
  // --- Pixie Dust Trail ---
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = Date.now();
      setParticles((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 2,
          opacity: 1,
        },
      ]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- Ripple Effect ---
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // --- Floating Orbs (background depth) ---
  const orbs = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Pixie Dust */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {/* Ripple Clicks */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0.7, scale: 0 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full border border-cyan-400"
          style={{
            left: r.x - 50,
            top: r.y - 50,
            width: 100,
            height: 100,
          }}
        />
      ))}

      {/* Floating Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full bg-cyan-500/10 blur-2xl"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
          }}
          animate={{ y: ["0%", "20%", "0%"] }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
