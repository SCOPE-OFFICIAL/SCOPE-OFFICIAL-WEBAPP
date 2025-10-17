"use client";

import Image from "next/image"; // Import Next.js Image component for optimized images
import { motion } from "framer-motion";

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/rayan .jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
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
        <div 
          className="faculty-coordinator-container" 
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', marginTop: '2rem' }}
        >
          <div 
            className="team-member-wrapper"
          >
            <div className="member-text-top">
              <h2 className="member-role">FACULTY COORDINATOR</h2>
              <p className="member-name">Prof. Dilip Chandra E</p>
            </div>
            <motion.div 
              className="team-member-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="member-image-background">
                <Image
                  src="/images/dilip sir.jpg"
                  alt="Prof. Dilip Chandra E"
                  fill
                  className="member-background-image"
                />
              </div>
              <div className="member-overlay"></div>
              <div className="member-socials">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-wrapper" key={index}>
              <div className="member-text-top">
                <h2 className="member-role">{member.role}</h2>
                <p className="member-name">{member.name}</p>
              </div>
              <motion.div 
                className="team-member-card"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="member-image-background">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="member-background-image"
                  />
                </div>
                <div className="member-overlay"></div>
                <div className="member-socials">
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                  >
                    {InstagramIcon}
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                  >
                    {LinkedInIcon}
                  </a>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.section>

      </motion.div>
    </div>
  );
}
