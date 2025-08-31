"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageTransitionVariants = {
  initial: { opacity: 0, transform: "translateY(30px) scale(0.98)" },
  animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
  exit: { opacity: 0, transform: "translateY(-30px) scale(0.98)" },
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransition({
  children,
  transitionDuration = 0.5,
  ease = [0.16, 1, 0.3, 1], // Custom cubic bezier curve
  initialY = 30,
}: {
  children: React.ReactNode;
  transitionDuration?: number;
  ease?: number[];
  initialY?: number;
}) {
  const pathname = usePathname();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for user's motion preference on component mount
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const variants = prefersReducedMotion ? fadeVariants : pageTransitionVariants;
  const animationProps = prefersReducedMotion
    ? {
        transition: { duration: transitionDuration / 2, ease: "linear" },
      }
    : {
        transition: {
          duration: transitionDuration,
          ease: ease,
        },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        {...animationProps}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}