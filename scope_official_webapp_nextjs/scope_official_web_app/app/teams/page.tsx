"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BackgroundBalls from "../components/BackgroundBalls";

// --- Team Member Interface ---
interface TeamMember {
  id?: string;
  name: string;
  role: string;
  year?: string | null;
  bio?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  github_url?: string | null;
  personality?: string | null;
  photo_url?: string | null;
  display_order?: number;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- SVG Icons ---
const InstagramIcon = (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const GitHubIcon = (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.76 5.47.76 11.74c0 4.88 3.16 9.02 7.56 10.48.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.08.67-3.73-1.3-3.73-1.3-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.67.08-.67 1.09.08 1.66 1.12 1.66 1.12.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.46-.28-5.05-1.23-5.05-5.47 0-1.21.43-2.2 1.13-2.98-.11-.28-.49-1.4.11-2.9 0 0 .92-.29 3.02 1.13.88-.25 1.82-.38 2.76-.38.94 0 1.88.13 2.76.38 2.1-1.42 3.02-1.13 3.02-1.13.6 1.5.22 2.62.11 2.9.7.78 1.13 1.77 1.13 2.98 0 4.25-2.59 5.18-5.06 5.45.39.34.73 1.02.73 2.06 0 1.49-.01 2.7-.01 3.07 0 .29.2.64.76.53 4.4-1.46 7.56-5.6 7.56-10.48C23.24 5.47 18.27.5 12 .5z" />
  </svg>
);

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [facultyCoordinator, setFacultyCoordinator] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    const original = typeof window !== 'undefined' ? document.body.style.overflow : '';
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [modalOpen]);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setError(null);
      const membersRes = await fetch('/api/team?active=true');
      
      if (!membersRes.ok) {
        throw new Error(`Failed to fetch team data: ${membersRes.status}`);
      }
      
      const membersData = await membersRes.json();
      const members = membersData.members || [];
      
      // Separate faculty coordinator from other members
      const faculty = members.find((m: TeamMember) => 
        m.role && m.role.toUpperCase().includes('FACULTY')
      );
      const otherMembers = members.filter((m: TeamMember) => 
        !m.role || !m.role.toUpperCase().includes('FACULTY')
      );
      
      setFacultyCoordinator(faculty || null);
      setTeamMembers(otherMembers);
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to load team members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="team-page-container min-h-fit relative"
      style={{ 
        overflow: 'visible', 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Background animated balls */}
      <BackgroundBalls />
      
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ 
          overflow: 'visible', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        {/* Error Message */}
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: '1200px',
              margin: '2rem auto',
              padding: '1rem',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '8px',
              color: '#ff6b6b',
              textAlign: 'center'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* --- Main Our Team Section --- */}
        <motion.section 
          className="our-team-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0.75rem 2rem 3rem'
          }}
        >
          {/* Left: Heading and paragraph */}
          <motion.div 
            className="intro-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <motion.h1 
              className="section-title"
              style={{
                textShadow: '0 0 20px rgba(242, 77, 194, 0.4)',
                letterSpacing: '2px',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'white',
                marginBottom: '1rem'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            >
              OUR CORE TEAM
            </motion.h1>
            <motion.p 
              className="section-subtitle"
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                color: '#b0b0b0',
                maxWidth: '600px',
                margin: '0 auto'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            >
              Introducing the core members of SCOPE and their respective roles.
            </motion.p>
          </motion.div>

          {/* Faculty Coordinator Card */}
          {facultyCoordinator && (
            <div 
              className="faculty-coordinator-container" 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '3rem', 
                marginTop: '2rem' 
              }}
            >
              <div className="team-member-wrapper" style={{ width: '320px' }}>
                <div className="member-text-top" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h2 className="member-role" style={{ 
                    fontSize: '0.9rem', 
                    color: '#F24DC2', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem'
                  }}>
                    {facultyCoordinator.role}
                  </h2>
                  <p className="member-name" style={{ 
                    fontSize: '1.2rem', 
                    color: 'white', 
                    fontWeight: 'bold' 
                  }}>
                    {facultyCoordinator.name}
                  </p>
                </div>
                <motion.div 
                  className="team-member-card"
                  whileHover={{ y: -10, transition: { duration: 0.2, ease: "easeOut" } }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#1a1a2e',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div 
                    className="member-image-background" 
                    style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '320px', 
                      overflow: 'hidden' 
                    }}
                  >
                    {facultyCoordinator.photo_url ? (
                      <Image
                        src={facultyCoordinator.photo_url}
                        alt={facultyCoordinator.name}
                        fill
                        className="member-background-image"
                        style={{ objectFit: 'cover' }}
                        quality={85}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {facultyCoordinator.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div 
                    className="member-overlay" 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      pointerEvents: 'none'
                    }}
                  />
                  <button
                    onClick={() => openModal(facultyCoordinator)}
                    className="know-more-btn"
                    aria-label={`Know more about ${facultyCoordinator.name}`}
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '0.5rem 1rem',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                  >
                    <span className="km-text">Know more</span>
                    <svg className="km-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.6"></circle>
                      <path d="M12 8v4" strokeLinecap="round" strokeLinejoin="round"></path>
                      <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                    </svg>
                  </button>
                  <div 
                    className="member-socials" 
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      display: 'flex',
                      gap: '0.5rem',
                      zIndex: 10
                    }}
                  >
                    {facultyCoordinator.instagram_url && (
                      <a
                        href={facultyCoordinator.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {InstagramIcon}
                      </a>
                    )}
                    {facultyCoordinator.linkedin_url && (
                      <a
                        href={facultyCoordinator.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {LinkedInIcon}
                      </a>
                    )}
                    {facultyCoordinator.github_url && (
                      <a
                        href={facultyCoordinator.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {GitHubIcon}
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Team Grid */}
          <div 
            className="team-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
              justifyContent: 'center',
              alignItems: 'start'
            }}
          >
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading team members...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'white', fontSize: '1.2rem' }}>No team members found. Add members from the admin panel!</p>
              </div>
            ) : (
              teamMembers.map((member, index) => (
                <div className="team-member-wrapper" key={member.id} style={{ width: '100%' }}>
                  <div className="member-text-top" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 className="member-role" style={{ 
                      fontSize: '0.85rem', 
                      color: '#F24DC2', 
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '0.5rem'
                    }}>
                      {member.role}
                    </h2>
                    <p className="member-name" style={{ 
                      fontSize: '1.1rem', 
                      color: 'white', 
                      fontWeight: 'bold' 
                    }}>
                      {member.name}
                    </p>
                  </div>
                  <motion.div 
                    className="team-member-card"
                    whileHover={{ y: -10, transition: { duration: 0.2, ease: "easeOut" } }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    viewport={{ once: true, margin: "-50px", amount: 0.3 }}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: '#1a1a2e',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div 
                      className="member-image-background" 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '320px', 
                        overflow: 'hidden' 
                      }}
                    >
                      {member.photo_url ? (
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          fill
                          className="member-background-image"
                          style={{ objectFit: 'cover' }}
                          quality={85}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 280px"
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div 
                      className="member-overlay" 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        pointerEvents: 'none'
                      }}
                    />
                    <button
                      onClick={() => openModal(member)}
                      className="know-more-btn"
                      aria-label={`Know more about ${member.name}`}
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s ease',
                        zIndex: 10
                      }}
                    >
                      <span className="km-text">Know more</span>
                      <svg className="km-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.6"></circle>
                        <path d="M12 8v4" strokeLinecap="round" strokeLinejoin="round"></path>
                        <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                      </svg>
                    </button>
                    <div 
                      className="member-socials" 
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        zIndex: 10
                      }}
                    >
                      {member.instagram_url && (
                        <a
                          href={member.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon-link"
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {InstagramIcon}
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon-link"
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {LinkedInIcon}
                        </a>
                      )}
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon-link"
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {GitHubIcon}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </motion.section>
      </motion.div>

      {/* Modal for extra info */}
      <AnimatePresence mode="wait">
        {modalOpen && selectedMember && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeModal}
              style={{ background: 'rgba(0,0,0,0.75)' }}
            />

            <motion.div
              key={selectedMember.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="team-modal relative z-[10000] max-w-6xl w-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-0 mx-4 shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="team-modal-title"
            >
              <div className="flex flex-col md:flex-row md:h-[72vh]">
                {/* Left: image */}
                <div className="modal-image-container w-full md:w-1/2 relative h-64 md:h-full flex-shrink-0">
                  {selectedMember.photo_url ? (
                    <Image
                      src={selectedMember.photo_url}
                      alt={selectedMember.name}
                      fill
                      className="object-cover w-full h-full"
                      quality={90}
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center text-white font-bold text-6xl">
                      {selectedMember.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Right: content */}
                <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 id="team-modal-title" className="text-2xl font-bold text-white">
                        {selectedMember.name}
                      </h3>
                      <p className="text-sm text-purple-300 uppercase tracking-wider mt-1">
                        {selectedMember.role}
                      </p>
                    </div>
                    <button 
                      onClick={closeModal} 
                      className="text-gray-300 hover:text-white transition-colors text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {selectedMember.personality && (
                    <div className="mb-4">
                      <h4 className="text-lg text-white font-semibold mb-2">About</h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {selectedMember.personality}
                      </p>
                    </div>
                  )}

                  {selectedMember.bio && (
                    <div className="mb-4">
                      <h4 className="text-lg text-white font-semibold mb-2">Bio</h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>
                  )}

                  {selectedMember.year && (
                    <div className="mb-4">
                      <h4 className="text-lg text-white font-semibold mb-2">Experience</h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {selectedMember.year}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 modal-socials flex gap-3" aria-label="Connect">
                    {selectedMember.linkedin_url && (
                      <a 
                        href={selectedMember.linkedin_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-social-link p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        aria-label="LinkedIn"
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {LinkedInIcon}
                      </a>
                    )}
                    {selectedMember.instagram_url && (
                      <a 
                        href={selectedMember.instagram_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-social-link p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        aria-label="Instagram"
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {InstagramIcon}
                      </a>
                    )}
                    {selectedMember.github_url && (
                      <a 
                        href={selectedMember.github_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="modal-social-link p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        aria-label="GitHub"
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {GitHubIcon}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}