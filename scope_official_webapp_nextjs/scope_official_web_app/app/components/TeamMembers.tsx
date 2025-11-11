"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface GroupPhoto {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  is_visible: boolean;
}

interface PhotoTag {
  id: string;
  photo_id: string;
  team_member_id?: string | null;
  person_name: string;
  position_x: number;
  position_y: number;
}

interface TeamData {
  id: string;
  title: string;
  image: string;
  description: string;
  members?: { name: string; position: { x: number; y: number } }[];
}

export default function TeamMembers() {
  const reduceMotion = useReducedMotion();
  const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([]);
  const [photoTags, setPhotoTags] = useState<{ [key: string]: PhotoTag[] }>({});
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupPhotos();
  }, []);

  const fetchGroupPhotos = async () => {
    try {
      // Fetch group photos from database
      const photosRes = await fetch('/api/group-photos?withTags=true');
      const photosData = await photosRes.json();
      const photos = photosData.photos || [];
      
      // Filter visible photos
      const visiblePhotos = photos.filter((p: GroupPhoto) => p.is_visible);
      setGroupPhotos(visiblePhotos);
      
      // Organize tags by photo ID
      const tagsByPhoto: { [key: string]: PhotoTag[] } = {};
      photos.forEach((photo: GroupPhoto & { tags?: PhotoTag[] }) => {
        if (photo.tags && photo.tags.length > 0) {
          tagsByPhoto[photo.id] = photo.tags;
        }
      });
      setPhotoTags(tagsByPhoto);
    } catch (error) {
      console.error('Error fetching group photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: GroupPhoto) => {
    const tags = photoTags[photo.id] || [];
    
    const members = tags.map(tag => ({
      name: tag.person_name,
      position: { x: tag.position_x, y: tag.position_y }
    }));

    setSelectedTeam({
      id: photo.id,
      title: photo.title,
      image: photo.image_url,
      description: photo.description || photo.category,
      members
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.6, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative">
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
          
          // Reduce motion/animation for users that prefer reduced motion
          if (reduceMotion) {
            return (
              <div
                key={i}
                className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full opacity-10"
                style={{
                  background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
                  left: positions[i].left,
                  top: positions[i].top,
                  willChange: 'transform'
                }}
              />
            );
          }

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
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: durations[i],
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h1 
            className="mb-4 text-center relative inline-block"
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '2.4rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(242, 77, 194, 0.4)',
              letterSpacing: '2px'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Our Team Members
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the dedicated individuals who drive innovation and excellence in SCOPE
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-300">Loading team photos...</p>
            </div>
          ) : groupPhotos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-300">No team photos available</p>
            </div>
          ) : (
            groupPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                className="group cursor-pointer"
                onClick={() => handlePhotoClick(photo)}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-[#F24DC2]/50 group-hover:shadow-[0_0_30px_rgba(242,77,194,0.3)]">
                  {/* Team Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={photo.image_url}
                      alt={photo.title}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    {/* Team Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {photo.title}
                      </h3>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F24DC2]/20 to-[#2C97FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Click to view more indicator */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Modal for Team Details */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Full screen backdrop overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
            />
            
            {/* Modal content container */}
            <motion.div
              className="relative z-[100000] bg-white/10 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/20 mx-4 flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - positioned relative to modal container */}
                <div className="absolute top-6 right-6 z-[10001]">
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="group/close bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-4 w-14 h-14 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white group-hover/close:text-gray-200 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    
                    {/* Hover tooltip - positioned to the left to avoid cutoff */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 opacity-0 group-hover/close:opacity-100 transition-all duration-200 pointer-events-none">
                      <div className="bg-black/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-white/40 shadow-xl">
                        Close
                        {/* Arrow pointing right */}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/95"></div>
                      </div>
                    </div>
                  </button>
                </div>

              <div className="relative">

                {/* Team Image */}
                <div className="relative h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-[45vh] w-full bg-black/70 overflow-hidden rounded-t-2xl">
                  <Image
                    src={selectedTeam.image}
                    alt={selectedTeam.title}
                    fill
                    loading="lazy"
                    className="object-contain object-center"
                    style={{ backgroundColor: 'rgba(10,10,15,0.6)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Name Tags for Team Members */}
                  {selectedTeam.members && selectedTeam.members.length > 0 && (
                    selectedTeam.members.map((member, index) => (
                      <div
                        key={index}
                        className="absolute group/member z-20"
                        style={{
                          left: `${member.position.x}%`,
                          top: `${member.position.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Reduced hit/touch area to avoid overlaps with nearby markers.
                            - Mobile: smaller (w-8), Small and up: slightly larger (w-10)
                            - Boost z-index on hover so the active marker captures pointer events above neighbors */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer relative group-hover/member:z-50">
                          {/* Visible dot indicator - subtle by default, prominent on hover */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-3 sm:h-3 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full opacity-40 group-hover/member:opacity-100 transition-all duration-300 shadow-lg border border-white/30 group-hover/member:scale-150 group-hover/member:border-2"></div>

                          {/* Hover trigger area - small circular region */}
                          <div className="absolute inset-0 rounded-full transition-all duration-200 bg-transparent group-hover/member:bg-white/10"></div>

                          {/* Name Tag - appears BELOW the marker */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover/member:opacity-100 transition-all duration-300 pointer-events-none z-60">
                            <div className="bg-black/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap border-2 border-[#F24DC2] shadow-2xl">
                              {member.name}
                              {/* Arrow pointing UP to the marker */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-[#F24DC2]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Team Details - reduced padding/size so it fits without internal scroll */}
                <div className="p-6 sm:p-8">
                  <h2 
                    className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-3"
                    style={{
                      fontFamily: '"Orbitron", sans-serif',
                      textShadow: '0 0 14px rgba(242, 77, 194, 0.35)',
                      letterSpacing: '1.5px'
                    }}
                  >
                    {selectedTeam.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {selectedTeam.description}
                  </p>
                </div>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
