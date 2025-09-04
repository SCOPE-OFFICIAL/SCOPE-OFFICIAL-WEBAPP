'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FooterComponent() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Check for unified scroll container first
      const scrollContainer = document.querySelector('.unified-scroll-container');
      const currentScrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      
      console.log('Scroll Y:', currentScrollY, 'Last Y:', lastScrollY); // Debug log
      
      // When scrolling down - hide footer (slide down)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        console.log('Scrolling down - hiding footer'); // Debug log
        setIsVisible(false);
      }
      // When scrolling up - show footer (slide up)
      else if (currentScrollY < lastScrollY) {
        console.log('Scrolling up - showing footer'); // Debug log
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll listener to unified container if it exists, otherwise window
    const scrollContainer = document.querySelector('.unified-scroll-container');
    const target = scrollContainer || window;
    
    target.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl text-white border-t border-white/10 shadow-lg transform transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3 min-h-[4rem]">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-100">Connect with us</p>
            <div className="flex justify-center space-x-4">
              <a href="https://www.instagram.com/your-username" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200">
                <Image src="/assets/instagram.png" alt="Instagram" width={20} height={20} className="h-5 w-5 hover:opacity-80 transition-opacity duration-200" />
              </a>
              <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200">
                <Image src="/assets/x.png" alt="X (Twitter)" width={20} height={20} className="h-5 w-5 opacity-80 hover:opacity-100 transition-opacity duration-200" />
              </a>
              <a href="https://www.linkedin.com/company/scope-reva-university/" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200">
                <Image src="/assets/linkedin.png" alt="LinkedIn" width={20} height={20} className="h-5 w-5 hover:opacity-80 transition-opacity duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
