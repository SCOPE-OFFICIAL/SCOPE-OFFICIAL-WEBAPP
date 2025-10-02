"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface MagneticCursorProps {
  enabled?: boolean;
  dotSize?: number;
  dotColors?: {
    default: string;
    hover: string;
  };
  outlineSize?: number;
  magnetismStrength?: number;
  smoothness?: number;
  hoverScale?: number;
  rippleColors?: string[];
}

const MagneticCursor: React.FC<MagneticCursorProps> = ({
  enabled = true,
  dotSize = 20,
  dotColors = {
    default: "#3b82f6", // Blue-500
    hover: "#60a5fa"    // Blue-400
  },
  outlineSize = 40,
  magnetismStrength = 0.3,
  smoothness = 25,
  hoverScale = 1.6,
  rippleColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#2563eb"],
}) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Get random ripple color
  const getRandomColor = useCallback(() => 
    rippleColors[Math.floor(Math.random() * rippleColors.length)], 
    [rippleColors]
  );

  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    setCursorPos({ x: e.clientX, y: e.clientY });
    setIsMoving(true);
    setIsVisible(true);

    // Reset movement state
    clearTimeout((window as any).movementTimeout);
    (window as any).movementTimeout = setTimeout(() => {
      setIsMoving(false);
    }, 100);
  }, [enabled]);

  // Click handler for ripples
  const handleClick = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    const ripple: Ripple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 20 + 30, // 30-50px
      color: getRandomColor(),
    };

    setRipples(prev => [...prev, ripple]);

    // Auto-remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 800);
  }, [enabled, getRandomColor]);

  // Hover detection
  const handleHoverDetection = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    const target = e.target as HTMLElement;
    const interactive = target.closest(
      'button, a, [role="button"], input, textarea, select, [data-cursor-hover]'
    );
    setIsHovering(!!interactive);
  }, [enabled]);

  // Mouse leave detection
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Magnetic effect calculation
  useEffect(() => {
    if (!enabled) return;

    const updateDisplayPosition = () => {
      setDisplayPos(prev => {
        if (!isHovering) {
          return cursorPos;
        }

        // Calculate magnetic pull towards interactive elements
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) { // Magnetic radius
          const force = (1 - distance / 100) * magnetismStrength;
          return {
            x: prev.x + dx * force,
            y: prev.y + dy * force,
          };
        }
        
        return cursorPos;
      });
    };

    const animationFrame = requestAnimationFrame(updateDisplayPosition);
    return () => cancelAnimationFrame(animationFrame);
  }, [cursorPos, isHovering, enabled, magnetismStrength]);

  // Event listeners
  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("mouseover", handleHoverDetection, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Hide native cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseover", handleHoverDetection);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "auto";
      clearTimeout((window as any).movementTimeout);
    };
  }, [enabled, handleMouseMove, handleClick, handleHoverDetection, handleMouseLeave]);

  if (!enabled || !isVisible) return null;

  const currentDotSize = isHovering ? dotSize * 1.2 : dotSize;
  const currentOutlineSize = isHovering ? outlineSize * 1.1 : outlineSize;

  return (
    <>
      {/* Ripple Effects on Click */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-40 rounded-full border-2"
            initial={{ 
              scale: 0, 
              opacity: 0.8,
              x: ripple.x - ripple.size / 2,
              y: ripple.y - ripple.size / 2,
            }}
            animate={{ 
              scale: 2.5, 
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut" 
            }}
            style={{
              width: ripple.size,
              height: ripple.size,
              borderColor: ripple.color,
              boxShadow: `
                0 0 15px ${ripple.color},
                0 0 30px ${ripple.color}40,
                0 0 45px ${ripple.color}20
              `,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Outer Glow Ring */}
      <motion.div
        className="fixed pointer-events-none z-46"
        animate={{
          x: displayPos.x - currentOutlineSize / 2,
          y: displayPos.y - currentOutlineSize / 2,
          scale: isMoving ? 1.1 : 1,
          opacity: isMoving ? 0.4 : 0.2,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: smoothness 
        }}
        style={{
          width: currentOutlineSize,
          height: currentOutlineSize,
          borderRadius: "50%",
          backgroundColor: dotColors.default,
          boxShadow: `
            0 0 25px ${dotColors.default}80,
            0 0 50px ${dotColors.default}40,
            0 0 75px ${dotColors.default}20
          `,
          filter: "blur(1px)",
        }}
      />

      {/* Outline Ring */}
      <motion.div
        className="fixed pointer-events-none z-47 border-2"
        animate={{
          x: displayPos.x - currentOutlineSize / 2,
          y: displayPos.y - currentOutlineSize / 2,
          scale: isMoving ? 1.05 : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: smoothness 
        }}
        style={{
          width: currentOutlineSize,
          height: currentOutlineSize,
          borderRadius: "50%",
          borderColor: isHovering ? dotColors.hover : dotColors.default,
          opacity: isHovering ? 0.8 : 0.4,
          boxShadow: `
            inset 0 0 10px ${dotColors.default}40,
            0 0 15px ${dotColors.default}30
          `,
        }}
      />

      {/* Main Cursor Dot */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: displayPos.x - currentDotSize / 2,
          y: displayPos.y - currentDotSize / 2,
          scale: isHovering ? hoverScale : (isMoving ? 1.2 : 1),
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: smoothness,
          mass: 0.5
        }}
        style={{
          width: currentDotSize,
          height: currentDotSize,
          borderRadius: "50%",
          backgroundColor: isHovering ? dotColors.hover : dotColors.default,
          mixBlendMode: "difference" as const,
          boxShadow: `
            0 0 20px ${isHovering ? dotColors.hover : dotColors.default},
            0 0 40px ${isHovering ? dotColors.hover : dotColors.default}80,
            0 0 60px ${isHovering ? dotColors.hover : dotColors.default}40,
            inset 0 0 10px ${isHovering ? dotColors.hover : dotColors.default}80
          `,
        }}
      />

      {/* Inner Core Dot */}
      <motion.div
        className="fixed pointer-events-none z-51"
        animate={{
          x: displayPos.x - 4,
          y: displayPos.y - 4,
          scale: isMoving ? [1, 1.2, 1] : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 800, 
          damping: smoothness,
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: `
            0 0 10px #ffffff,
            0 0 20px #3b82f6
          `,
        }}
      />

      {/* Pulsing Aurora Effect */}
      <motion.div
        className="fixed pointer-events-none z-45 border"
        animate={{
          x: displayPos.x - currentOutlineSize * 0.7,
          y: displayPos.y - currentOutlineSize * 0.7,
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.4, 0.1],
          rotate: [0, 180, 360],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: currentOutlineSize * 1.4,
          height: currentOutlineSize * 1.4,
          borderRadius: "50%",
          borderColor: dotColors.default,
          borderStyle: "dashed",
          borderWidth: "1px",
        }}
      />

      {/* Secondary Pulse */}
      <motion.div
        className="fixed pointer-events-none z-44 border"
        animate={{
          x: displayPos.x - currentOutlineSize * 0.9,
          y: displayPos.y - currentOutlineSize * 0.9,
          scale: [1, 1.6, 1],
          opacity: [0.05, 0.2, 0.05],
          rotate: [0, -180, -360],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: currentOutlineSize * 1.8,
          height: currentOutlineSize * 1.8,
          borderRadius: "50%",
          borderColor: dotColors.hover,
          borderStyle: "dotted",
          borderWidth: "1px",
        }}
      />
    </>
  );
};

export default MagneticCursor;