'use client';

import Link from "next/link";
import Image from "next/image";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // OPTIMIZED: Debounced scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Check for unified scroll container first
          const scrollContainer = document.querySelector('.unified-scroll-container');
          const currentScrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
          
          // Only update if scroll difference is significant (reduces unnecessary renders)
          if (Math.abs(currentScrollY - lastScrollY) > 10) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling down and past 100px - hide navbar (slide up)
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
              // Scrolling up or near top - show navbar (slide down)
              setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll listener to unified container if it exists, otherwise window
    const scrollContainer = document.querySelector('.unified-scroll-container');
    const target = scrollContainer || window;
    
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

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
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    if (viewMode === 'scroll') {
      // For scroll mode, scroll to section if we're on home page
      if (pathname === '/') {
        const sectionMap: { [key: string]: string } = {
          '/': 'home',
          '/aboutus': 'about-us',
          '/teams': 'team',
          '/eventss': 'events',
          '/gallery': 'gallery',
          '/faq': 'faq'
        };
        
        const sectionId = sectionMap[item.href];
        if (sectionId) {
          scrollToSection(sectionId);
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
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/8 backdrop-blur-xl border-b border-white/15 shadow-lg"
      >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 min-h-[4.5rem]">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center cursor-pointer">
              <motion.img 
                src="/images/scope_logo.png" 
                alt="SCOPE Logo" 
                className="h-10 w-10 object-contain"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
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
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className={`relative inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap group overflow-hidden cursor-pointer ${
                      (viewMode === 'pages' && isActive(item.href))
                        ? 'text-white shadow-lg'
                        : 'text-white/85 hover:text-white shadow-md'
                    }`}
                  >
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-white/12 backdrop-blur-sm rounded-lg border border-white/25"></div>
                    
                    {/* Animated gradient background for active state */}
                    {(viewMode === 'pages' && isActive(item.href)) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    )}
                    
                    {/* Hover effect for non-active items */}
                    {!(viewMode === 'pages' && isActive(item.href)) && (
                      <>
                        {/* Sliding background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#F24DC2]/25 to-[#2C97FF]/25 rounded-lg transform translate-x-full transition-transform duration-400 ease-out group-hover:translate-x-0"></div>
                      </>
                    )}
                    
                    <span className="relative z-10 font-medium tracking-wide">
                      {item.label}
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
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open mobile menu"
              className="relative px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white hover:text-white transition-all duration-300 ease-in-out shadow-md group overflow-hidden border border-white/20 cursor-pointer"
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

    {/* Mobile Menu Panel - Centered Modal */}
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isMobileMenuOpen ? 1 : 0,
        scale: isMobileMenuOpen ? 1 : 0.95,
        pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 flex items-center justify-center z-[101] md:hidden p-4"
      style={{
        pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
      }}
    >
      {/* Semi-transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Menu Container - Centered and Non-scrollable */}
      <div
        className="relative w-full max-w-sm bg-gradient-to-b from-[#0a0e27]/95 to-[#040a28]/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        style={{
          maxHeight: '90vh',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
      {/* Menu Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/30 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Image 
            src="/images/scope_logo.png" 
            alt="SCOPE Logo" 
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <div className="text-white font-bold text-xl tracking-wide drop-shadow-lg">SCOPE</div>
            <div className="text-white/80 text-xs font-medium drop-shadow">School of ECE</div>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsMobileMenuOpen(false)}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-full border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
          aria-label="Close mobile menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      {/* Menu Items - No internal scrolling */}
      <div className="p-6">
        <div className="space-y-2.5">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 100 }}
            >
              <Link
                href={item.href}
                onClick={(e) => handleNavigation(e, item)}
                className={`block py-3 px-5 rounded-xl text-center text-base font-semibold transition-all duration-300 border-2 backdrop-blur-sm ${
                  (viewMode === 'pages' && isActive(item.href))
                    ? 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white border-transparent shadow-lg shadow-[#F24DC2]/30'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-md'
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Join Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: navItems.length * 0.06 + 0.15 }}
          className="mt-5"
        >
          <Link
            href="/#faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#2C97FF] to-[#4169E1] text-white text-center text-base font-bold hover:from-[#2C97FF]/90 hover:to-[#4169E1]/90 transition-all duration-300 shadow-lg shadow-[#2C97FF]/40 border-2 border-white/20"
          >
            Join Us
          </Link>
        </motion.div>
      </div>
    </div>
  </motion.div>
  </>
  );
}
