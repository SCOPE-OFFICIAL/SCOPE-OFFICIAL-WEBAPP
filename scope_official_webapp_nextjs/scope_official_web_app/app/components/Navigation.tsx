'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useViewMode } from "./ViewModeContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode } = useViewMode();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      // Check for unified scroll container first
      const scrollContainer = document.querySelector('.unified-scroll-container');
      const currentScrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar (slide up)
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top - show navbar (slide down)
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll listener to unified container if it exists, otherwise window
    const scrollContainer = document.querySelector('.unified-scroll-container');
    const target = scrollContainer || window;
    
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/eventss', label: 'Events' },
    { href: '/aboutus', label: 'About Us' },
    { href: '/teams', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
  ];

  // Smooth scroll function for scroll mode
  const scrollToSection = (sectionName: string) => {
    const element = document.getElementById(sectionName);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle navigation based on view mode
  const handleNavigation = (e: React.MouseEvent, item: { href: string; label: string }) => {
    e.preventDefault();
    
    if (viewMode === 'scroll') {
      // For scroll mode, scroll to section if we're on home page
      if (pathname === '/') {
        const sectionMap: { [key: string]: string } = {
          '/': 'Home',
          '/aboutus': 'About Us',
          '/teams': 'Teams',
          '/eventss': 'Events',
          '/gallery': 'Gallery',
          '/faq': 'FAQ'
        };
        
        const sectionName = sectionMap[item.href];
        if (sectionName) {
          scrollToSection(sectionName);
        }
      } else {
        // If not on home page, navigate to home first
        router.push('/');
      }
    } else {
      // For pages mode, use normal navigation
      router.push(item.href);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 min-h-[4rem]">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center">
              <motion.img 
                src="/images/scope_logo.png" 
                alt="SCOPE Logo" 
                className="h-12 w-12 object-contain"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="flex-shrink-0"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-in-out whitespace-nowrap group relative overflow-hidden ${
                      (viewMode === 'pages' && isActive(item.href))
                        ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white shadow-lg'
                        : 'bg-white/15 backdrop-blur-sm text-white hover:text-white shadow-md border border-white/20'
                    }`}
                  >
                    {/* Expanding blue dot - only show when not active */}
                    {!(viewMode === 'pages' && isActive(item.href)) && (
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-[#2C97FF] rounded-full transition-all duration-700 ease-out origin-center group-hover:w-20 group-hover:h-20 group-hover:left-1/2 group-hover:top-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-[3] group-hover:bg-[#2C97FF] group-hover:rounded-full"></span>
                    )}
                    
                    <span className="relative z-10 flex items-center">
                      {/* Invisible spacer for dot positioning - only when not active */}
                      {!(viewMode === 'pages' && isActive(item.href)) && (
                        <span className="w-1.5 h-1.5 mr-2 opacity-0"></span>
                      )}
                      
                      {item.label}
                      
                      {/* Arrow - only visible on hover for non-active items */}
                      <svg
                        className={`w-2.5 h-2.5 flex-shrink-0 transition-all duration-300 ${
                          (viewMode === 'pages' && isActive(item.href))
                            ? 'ml-1.5 opacity-100'
                            : 'ml-0 opacity-0 group-hover:opacity-100 group-hover:ml-1.5'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              className="relative px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white hover:text-white transition-all duration-300 ease-in-out shadow-md group overflow-hidden border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Gradient background animation for hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
              
              <motion.svg 
                className="relative z-10 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
