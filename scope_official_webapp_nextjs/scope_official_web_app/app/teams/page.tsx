"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TeamMember } from '@/lib/types/database';

// --- SVG Icons (Simplified) ---
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

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [facultyCoordinator, setFacultyCoordinator] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Fetch individual team members
      const membersRes = await fetch('/api/team?active=true');
      const membersData = await membersRes.json();
      const members = membersData.members || [];
      
      // Separate faculty coordinator from other members
      const faculty = members.find((m: TeamMember) => m.role.toUpperCase().includes('FACULTY'));
      const otherMembers = members.filter((m: TeamMember) => !m.role.toUpperCase().includes('FACULTY'));
      
      setFacultyCoordinator(faculty || null);
      setTeamMembers(otherMembers);
      
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="team-page-container min-h-screen relative"
      style={{ 
        overflow: 'visible', 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          overflow: 'visible', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >

      {/* --- Main Our Team Section --- */}
      <motion.section 
        className="our-team-section"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left: Heading and paragraph */}
        <motion.div 
          className="intro-text"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1 
            className="section-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            OUR TEAM
          </motion.h1>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Introducing the core members of SCOPE and their respectful roles.
          </motion.p>
        </motion.div>

        {/* Faculty Coordinator Card - Same size as other team cards */}
        {facultyCoordinator && (
          <div 
            className="faculty-coordinator-container" 
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', marginTop: '2rem' }}
          >
            <div 
              className="team-member-wrapper"
            >
              <div className="member-text-top">
                <h2 className="member-role">{facultyCoordinator.role}</h2>
                <p className="member-name">{facultyCoordinator.name}</p>
              </div>
              <motion.div 
                className="team-member-card"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="member-image-background">
                  {facultyCoordinator.photo_url ? (
                    <Image
                      src={facultyCoordinator.photo_url}
                      alt={facultyCoordinator.name}
                      fill
                      className="member-background-image"
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
                <div className="member-overlay"></div>
                <div className="member-socials">
                  {facultyCoordinator.instagram_url && (
                    <a
                      href={facultyCoordinator.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-link"
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
                    >
                      {LinkedInIcon}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
        
        {/* Right: Image */}
          
        <div className="team-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'white', fontSize: '1.2rem' }}>No team members found. Add members from the admin panel!</p>
            </div>
          ) : (
            <>
              {/* Individual Team Members */}
              {teamMembers.map((member, index) => (
              <div className="team-member-wrapper" key={member.id}>
                <div className="member-text-top">
                  <h2 className="member-role">{member.role}</h2>
                  <p className="member-name">{member.name}</p>
                </div>
                <motion.div 
                  className="team-member-card"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="member-image-background">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className="member-background-image"
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
                  <div className="member-overlay"></div>
                  <div className="member-socials">
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
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
                      >
                        {LinkedInIcon}
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
              ))}
            </>
          )}
        </div>
      </motion.section>

      </motion.div>
    </div>
  );
}
