"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import AnimatedButton from './AnimatedButton';

interface GalleryImage {
  id: string;
  image_url: string;
  folder_name: string;
  caption: string | null;
  is_visible: boolean;
  display_order: number;
}

interface FolderData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  eventDetails: {
    date: string;
    duration: string;
    participants: string;
    topics: string[];
  };
  image: string;
  gradient: string;
  photoCount: number;
  gallery: GalleryImage[];
}

const Gallery: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [cameFromEvents, setCameFromEvents] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ image: string; alt: string } | null>(null);
  const [folderCards, setFolderCards] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const reduceMotion = useReducedMotion();

  // Folder metadata (static descriptions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const folderMetadata: { [key: string]: any } = useMemo(() => ({
      MATLAB: {
        title: 'MATLAB WORKSHOP',
        subtitle: 'Learn, Analyze, Innovate with MATLAB workshops and training sessions',
        description:
          'Our MATLAB workshop series is designed to empower students and professionals with comprehensive knowledge of MATLAB programming and its applications. These intensive sessions cover everything from basic programming concepts to advanced data analysis, signal processing, and simulation techniques.',
        eventDetails: {
          date: 'March 15-16, 2024',
          duration: '2 Days',
          participants: '50+ Students',
          topics: [
            'MATLAB Fundamentals',
            'Data Visualization',
            'Signal Processing',
            'Simulink Basics',
            'Real-world Applications'
          ]
        },
        gradient: 'from-blue-600 via-indigo-600 to-purple-600'
      },
      ATLASSIAN: {
        title: 'ATLASSIAN WORKSHOP',
        subtitle: 'Master project management and collaboration with Atlassian tools',
        description:
          'The Atlassian workshop series introduces students to industry-standard project management and collaboration tools used by leading technology companies worldwide. Through comprehensive training sessions, participants learn to effectively use Jira for project tracking, Confluence for documentation and knowledge sharing, and Bitbucket for version control.',
        eventDetails: {
          date: 'April 20-21, 2024',
          duration: '2 Days',
          participants: '40+ Students',
          topics: [
            'Jira Project Management',
            'Confluence Documentation',
            'Bitbucket Version Control',
            'Agile Workflows',
            'Team Collaboration'
          ]
        },
        gradient: 'from-blue-700 via-indigo-700 to-cyan-700'
      }
    }), []);

  // Fetch gallery images from database
  const fetchGalleryData = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      const images: GalleryImage[] = data.images || [];

      // Group images by folder
      const folders: { [key: string]: GalleryImage[] } = {};
      images.forEach(img => {
        if (img.is_visible) {
          if (!folders[img.folder_name]) {
            folders[img.folder_name] = [];
          }
          folders[img.folder_name].push(img);
        }
      });

      // Create folder cards
      const cards: FolderData[] = Object.keys(folders).map(folderName => {
        const folderImages = folders[folderName].sort((a, b) => a.display_order - b.display_order);
        
        // Get saved metadata from localStorage (set by admin panel)
        const savedMetadata = localStorage.getItem(`event_meta_${folderName}`)
        const adminMetadata = savedMetadata ? JSON.parse(savedMetadata) : null
        
        // Merge with default metadata
        const defaultMetadata = folderMetadata[folderName] || {
          title: folderName.toUpperCase(),
          subtitle: `Explore ${folderName} gallery`,
          description: `Collection of photos from ${folderName} events and activities.`,
          eventDetails: {
            date: 'Various dates',
            duration: 'Multiple sessions',
            participants: 'SCOPE Members',
            topics: ['Technology', 'Innovation', 'Learning']
          },
          gradient: 'from-purple-600 via-blue-600 to-indigo-600'
        };

        // Use admin-set metadata if available, otherwise use defaults
        const metadata = adminMetadata ? {
          title: adminMetadata.title || defaultMetadata.title,
          subtitle: adminMetadata.subtitle || defaultMetadata.subtitle,
          description: adminMetadata.description || defaultMetadata.description,
          eventDetails: {
            date: adminMetadata.date || defaultMetadata.eventDetails?.date || 'Various dates',
            duration: adminMetadata.duration || defaultMetadata.eventDetails?.duration || 'Multiple sessions',
            participants: adminMetadata.participants || defaultMetadata.eventDetails?.participants || 'SCOPE Members',
            topics: defaultMetadata.eventDetails?.topics || ['Technology', 'Innovation', 'Learning']
          },
          gradient: adminMetadata.gradient || defaultMetadata.gradient
        } : defaultMetadata;

        // Use display image from admin metadata if set, otherwise use first image
        const displayImage = adminMetadata?.displayImage || folderImages[0]?.image_url || '/images/default-gallery.jpg';

        return {
          id: folderName,
          ...metadata,
          image: displayImage,
          photoCount: folderImages.length,
          gallery: folderImages
        };
      });

      setFolderCards(cards);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  }, [folderMetadata]);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Auto-slide carousel when there are more than 2 folders
  useEffect(() => {
    if (folderCards.length > 2 && !selectedFolder) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % folderCards.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [folderCards.length, selectedFolder]);

  // (fetchGalleryData is implemented above as a stable useCallback)

  // Check for localStorage to auto-select gallery folder
  useEffect(() => {
    const storedFolder = localStorage.getItem('galleryFolder');
    
    if (storedFolder) {
      setSelectedFolder(storedFolder);
      setCameFromEvents(true); // Mark that user came from events page
      // Clear the stored folder after using it
      localStorage.removeItem('galleryFolder');
    }
  }, []);

  const getCurrentGallery = useCallback((): GalleryImage[] => {
    const folder = folderCards.find((f) => f.id === selectedFolder);
    return folder?.gallery || [];
  }, [folderCards, selectedFolder]);

  const getCurrentFolderData = useCallback((): FolderData | undefined => {
    return folderCards.find((folder) => folder.id === selectedFolder);
  }, [folderCards, selectedFolder]);

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') {
        setSelectedImage(null);
        return;
      }

      const currentGallery = getCurrentGallery();
      const currentIndex = currentGallery.findIndex(img => img.image_url === selectedImage.image);
      if (currentIndex === -1) return;

      let newIndex: number | null = null;
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
      } else if (e.key === 'ArrowRight') {
        newIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
      }

      if (newIndex === null) return;

      const newImage = currentGallery[newIndex];
      const folderData = getCurrentFolderData();
      setSelectedImage({
        image: newImage.image_url,
        alt: newImage.caption || `${folderData?.title} - Photo ${newIndex + 1}`
      });
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, getCurrentGallery, getCurrentFolderData]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentGallery = getCurrentGallery();
    const currentIndex = currentGallery.findIndex(img => img.image_url === selectedImage.image);
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
    } else {
      newIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newImage = currentGallery[newIndex];
    const folderData = getCurrentFolderData();
    setSelectedImage({
      image: newImage.image_url,
      alt: newImage.caption || `${folderData?.title} - Photo ${newIndex + 1}`
    });
  };

  const handleBackNavigation = () => {
    if (cameFromEvents) {
      // Navigate back to events page
      window.location.href = '/eventss';
    } else {
      // Regular back to folders behavior
      setSelectedFolder(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <div id="gallery" className="min-h-screen py-20 px-6 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => {
          // Static positions that don't change on re-render - adjusted to prevent overflow
          const positions = [
            { left: '15%', top: '10%' },
            { left: '60%', top: '20%' },
            { left: '25%', top: '70%' },
            { left: '70%', top: '60%' },
            { left: '35%', top: '35%' },
            { left: '10%', top: '50%' }
          ];
          const durations = [25, 30, 20, 28, 22, 26];
          
          return (
            <motion.div
              key={i}
              className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full opacity-10"
              style={{
                background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
                left: positions[i].left,
                top: positions[i].top,
                willChange: 'transform'
              }}
              // keep background floats very lightweight: only translate, no rotate or filter
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: [0, 40, 0],
                      y: [0, -30, 0]
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 1 }
                  : {
                      duration: durations[i],
                      repeat: Infinity,
                      ease: "linear"
                    }
              }
            />
          );
        })}
      </div>

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="mb-6 text-center relative inline-block"
            style={{
              fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '3.2rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px',
              paddingLeft: '40px'
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-7 rounded"
              style={{
                background: 'linear-gradient(to bottom, var(--secondary-pink), var(--primary-purple))'
              }}
            ></span>
            Gallery
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our innovative projects and cutting-edge research across multiple domains
          </motion.p>
        </motion.div>

        {/* Folder Cards - Show when no folder is selected */}
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            folderCards.length > 2 ? (
              /* 3D Carousel View for 3+ folders - Full Viewport */
              <motion.div
                key="carousel"
                className="relative mb-16 h-[70vh] min-h-[600px] -mx-6 md:-mx-8 lg:-mx-12 w-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                style={{ marginLeft: 'calc(-50vw + 50%)' }}
              >
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-300">Loading gallery...</p>
                  </div>
                ) : (
                  <div className="relative h-full w-full overflow-hidden" style={{ perspective: '2000px' }}>
                    {/* Horizontal Slide Container - Right to Left Flow */}
                    <div className="relative h-full flex items-center justify-center">
                      <AnimatePresence initial={false} mode="popLayout">
                        {folderCards.map((folder, index) => {
                          const position = (index - currentSlide + folderCards.length) % folderCards.length;
                          const isCenter = position === 0;
                          const isLeft = position === folderCards.length - 1;
                          const isRight = position === 1;
                          const isVisible = isCenter || isLeft || isRight;

                          // Calculate horizontal positions (no rotation, pure slide)
                          let xPosition = '0%';
                          let opacity = 0;
                          let scale = 0.7;
                          let blur = 4;
                          let zIndex = 10;

                          if (isCenter) {
                            xPosition = '0%';
                            opacity = 1;
                            scale = 1;
                            blur = 0;
                            zIndex = 30;
                          } else if (isLeft) {
                            xPosition = '-110%'; // Far left, preparing to exit
                            opacity = 0.3;
                            scale = 0.75;
                            blur = 3;
                            zIndex = 20;
                          } else if (isRight) {
                            xPosition = '110%'; // Far right, waiting to enter
                            opacity = 0.3;
                            scale = 0.75;
                            blur = 3;
                            zIndex = 20;
                          }

                          if (!isVisible) {
                            return null;
                          }

                          return (
                            <motion.div
                              key={`${folder.id}-${index}`}
                              className="absolute"
                              initial={{ 
                                x: '150%',
                                opacity: 0,
                                scale: 0.7
                              }}
                              animate={{
                                x: xPosition,
                                opacity: opacity,
                                scale: scale,
                                filter: `blur(${blur}px)`,
                              }}
                              exit={{
                                x: '-150%',
                                opacity: 0,
                                scale: 0.7
                              }}
                              transition={{
                                duration: 0.8,
                                ease: [0.43, 0.13, 0.23, 0.96]
                              }}
                              style={{
                                zIndex: zIndex,
                                pointerEvents: isCenter ? 'auto' : 'none',
                                width: '35%',
                                maxWidth: '500px',
                                minWidth: '350px'
                              }}
                            >
                            <motion.div
                              onClick={() => isCenter && setSelectedFolder(folder.id)}
                              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border transition-all duration-500 ${
                                isCenter 
                                  ? 'border-[#F24DC2]/50 cursor-pointer shadow-2xl shadow-[#F24DC2]/30' 
                                  : 'border-gray-700/20'
                              }`}
                              whileHover={isCenter ? { 
                                scale: 1.02,
                                boxShadow: "0 40px 80px rgba(242, 77, 194, 0.6)"
                              } : {}}
                              whileTap={isCenter ? { scale: 0.98 } : {}}
                              transition={{ 
                                duration: 0.3,
                                ease: "easeOut"
                              }}
                            >
                              {/* Background Gradient Overlay */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${folder.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                              
                              {/* Image Container */}
                              <div className="relative h-[350px] overflow-hidden">
                                <motion.div
                                  className="absolute inset-0"
                                  whileHover={isCenter ? { scale: 1.05 } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Image
                                    src={folder.image}
                                    alt={folder.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                </motion.div>
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                
                                {/* Folder Icon */}
                                {isCenter && (
                                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-[#F24DC2]/20 transition-colors duration-300">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                  </div>
                                )}

                                {/* Event Count Badge */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                  {folder.photoCount} photos
                                </div>

                                {/* Center Highlight Indicator */}
                                {isCenter && (
                                  <motion.div
                                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F24DC2] to-transparent"
                                    animate={{
                                      opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                )}
                              </div>

                              {/* Content - Only show fully on center card */}
                              <div className={`p-6 relative z-10 transition-all duration-500 ${isCenter ? 'opacity-100' : 'opacity-40'}`}>
                                <motion.h3 
                                  className={`text-2xl font-bold text-white mb-2 transition-all duration-300 ${
                                    isCenter ? 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F24DC2] group-hover:to-[#2C97FF]' : ''
                                  }`}
                                >
                                  {folder.title}
                                </motion.h3>
                                {isCenter && (
                                  <>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-3 text-sm">
                                      {folder.subtitle}
                                    </p>

                                    {/* Click to explore indicator */}
                                    <div className="flex items-center text-[#2C97FF] group-hover:text-[#F24DC2] transition-colors duration-300">
                                      <span className="text-xs font-medium mr-2">Click to explore</span>
                                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                      </svg>
                                    </div>
                                  </>
                                )}
                                
                                {/* Animated Border */}
                                {isCenter && (
                                  <motion.div
                                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] w-0 group-hover:w-full"
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                  />
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    </div>

                    {/* Navigation Arrows - At screen edges */}
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + folderCards.length) % folderCards.length)}
                      className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 bg-gradient-to-r from-[#F24DC2]/20 to-[#2C97FF]/20 hover:from-[#F24DC2]/40 hover:to-[#2C97FF]/40 backdrop-blur-md rounded-full p-5 text-white transition-all duration-200 border border-white/30 hover:scale-110 shadow-2xl hover:shadow-[#F24DC2]/50"
                      aria-label="Previous slide"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % folderCards.length)}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 bg-gradient-to-r from-[#2C97FF]/20 to-[#F24DC2]/20 hover:from-[#2C97FF]/40 hover:to-[#F24DC2]/40 backdrop-blur-md rounded-full p-5 text-white transition-all duration-200 border border-white/30 hover:scale-110 shadow-2xl hover:shadow-[#2C97FF]/50"
                      aria-label="Next slide"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Side Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#040a28] to-transparent pointer-events-none z-20" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#040a28] to-transparent pointer-events-none z-20" />
                  </div>
                )}
              </motion.div>
            ) : (
              /* Grid View for 2 or fewer folders */
              <motion.div 
                key="folders"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-300">Loading gallery...</p>
                  </div>
                ) : folderCards.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-300">No gallery folders available</p>
                  </div>
                ) : (
                  folderCards.map((folder) => (
                    <motion.div
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/30 hover:border-[#F24DC2]/30 transition-all duration-500 cursor-pointer"
                      whileHover={{ 
                        scale: 1.02,
                        y: -10,
                        boxShadow: "0 25px 50px rgba(242, 77, 194, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeOut",
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    >
                      {/* Background Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${folder.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={folder.image}
                            alt={folder.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </motion.div>
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Folder Icon */}
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-[#F24DC2]/20 transition-colors duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>

                        {/* Event Count Badge */}
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {folder.photoCount} photos
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 relative z-10">
                        <motion.h3 
                          className="text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F24DC2] group-hover:to-[#2C97FF] transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {folder.title}
                        </motion.h3>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-4">
                          {folder.subtitle}
                        </p>

                        {/* Click to explore indicator */}
                        <div className="flex items-center text-[#2C97FF] group-hover:text-[#F24DC2] transition-colors duration-300">
                          <span className="text-sm font-medium mr-2">Click to explore</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        
                        {/* Animated Border */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] w-0 group-hover:w-full"
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )
          ) : (
            /* Gallery View - Show when folder is selected */
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatedButton
                  onClick={handleBackNavigation}
                  variant="secondary"
                  size="md"
                  className="mb-6"
                  arrowDirection="left"
                >
                  {cameFromEvents ? 'Back to Events' : 'Back to Gallery'}
                </AnimatedButton>
              </motion.div>

              {/* Event Description Section */}
              {getCurrentFolderData() && (
                <motion.div
                  className="mb-12 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {/* Event Header */}
                  <div className="text-center mb-8">
                    <motion.h2 
                      className="text-4xl font-bold text-white mb-4"
                      style={{
                        fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {getCurrentFolderData()!.title}
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-gray-300 max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      {getCurrentFolderData()!.subtitle}
                    </motion.p>
                  </div>

                  {/* Event Details Grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {/* Left Side - Description */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                          <span className="w-2 h-2 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full mr-3"></span>
                          About This Event
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {getCurrentFolderData()!.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Side - Event Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                          <span className="w-2 h-2 bg-gradient-to-r from-[#2C97FF] to-[#F24DC2] rounded-full mr-3"></span>
                          Event Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-400">Date</span>
                            <span className="text-white font-medium">{getCurrentFolderData()!.eventDetails.date}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-400">Duration</span>
                            <span className="text-white font-medium">{getCurrentFolderData()!.eventDetails.duration}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-400">Participants</span>
                            <span className="text-white font-medium">{getCurrentFolderData()!.eventDetails.participants}</span>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-400 block mb-2">Topics Covered</span>
                            <div className="flex flex-wrap gap-2">
                              {getCurrentFolderData()!.eventDetails.topics.map((topic, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-gradient-to-r from-[#F24DC2]/20 to-[#2C97FF]/20 text-white text-sm rounded-full border border-white/20"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Gallery Info */}
                  <motion.div 
                    className="text-center pt-6 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p className="text-gray-400 text-lg">
                      📸 {getCurrentGallery().length} photos captured during this amazing event
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Gallery Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {getCurrentGallery().map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/30 hover:border-[#F24DC2]/30 transition-all duration-500 cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      boxShadow: "0 25px 50px rgba(242, 77, 194, 0.3)"
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: "easeOut",
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                    onClick={() => setSelectedImage({ 
                      image: item.image_url, 
                      alt: item.caption || `${getCurrentFolderData()?.title} - Photo ${index + 1}` 
                    })}
                  >
                    {/* Image Container - Full card */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={item.image_url}
                          alt={item.caption || `Photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </motion.div>
                      
                      {/* Subtle hover overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-[#F24DC2]/10 via-transparent to-[#2C97FF]/10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 bg-[#F24DC2] rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Modal Content */}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Previous Button */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 border border-white/20 hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 border border-white/20 hover:scale-110"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh]"
                  sizes="90vw"
                  priority
                />
                
                {/* Image gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>
              </div>

              {/* Image Caption */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <p className="text-lg font-medium text-center mb-2">
                  {selectedImage.alt}
                </p>
                
                {/* Image counter */}
                {(() => {
                  const currentGallery = getCurrentGallery();
                  const currentIndex = currentGallery.findIndex(img => img.image_url === selectedImage.image);
                  return (
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-sm text-gray-300">
                        {currentIndex + 1} of {currentGallery.length}
                      </span>
                      <div className="flex space-x-1">
                        {currentGallery.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentIndex 
                                ? 'bg-[#F24DC2] scale-110' 
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        Use ← → keys or buttons to navigate
                      </span>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
