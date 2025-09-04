// Animation configurations and variants for consistent animations across the app

export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.22, 1, 0.36, 1],
} as const;

export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
} as const;

// Common animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

export const slideInFromBottom = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

// Stagger container variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Hover effects
export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 10px 30px rgba(242, 77, 194, 0.3)",
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const cardHover = {
  y: -10,
  scale: 1.02,
  boxShadow: "0 20px 40px rgba(242, 77, 194, 0.15)",
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const imageHover = {
  scale: 1.05,
  rotateY: 5,
  filter: "drop-shadow(0 10px 20px rgba(242, 77, 194, 0.2))",
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

// Loading animation variants
export const loadingSpinner = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

export const pulseAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Floating animation for background elements
export const floatingAnimation = {
  y: [0, -20, 0],
  x: [0, 5, 0],
  rotate: [0, 5, -5, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Gradient line animation
export const gradientLineGrow = {
  scaleX: [0, 1],
  transition: {
    duration: durations.slow,
    ease: easings.easeOut,
  },
};

// Text reveal animation (typewriter effect simulation)
export const textReveal = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: durations.fast,
      ease: easings.easeOut,
    },
  }),
};

// Magnetic hover effect
export const magneticHover = (strength = 0.3) => ({
  scale: 1 + strength * 0.1,
  transition: { type: "spring", stiffness: 400, damping: 10 },
});

// Navigation link hover
export const navLinkHover = {
  scale: 1.05,
  color: "#F24DC2",
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

// Social icon hover effects
export const socialIconHover = {
  instagram: {
    scale: 1.2,
    rotate: 10,
    color: "#E1306C",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  linkedin: {
    scale: 1.2,
    rotate: -10,
    color: "#0077B5",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  twitter: {
    scale: 1.2,
    rotate: 10,
    color: "#1DA1F2",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

const animations = {
  easings,
  durations,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInFromTop,
  slideInFromBottom,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  buttonHover,
  cardHover,
  imageHover,
  pageVariants,
  loadingSpinner,
  pulseAnimation,
  floatingAnimation,
  gradientLineGrow,
  textReveal,
  magneticHover,
  navLinkHover,
  socialIconHover,
};

export default animations;
