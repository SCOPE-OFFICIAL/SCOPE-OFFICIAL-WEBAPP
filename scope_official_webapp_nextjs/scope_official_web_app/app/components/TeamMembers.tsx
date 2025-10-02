"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TeamData {
  id: string;
  title: string;
  image: string;
  description: string;
  members?: { name: string; position: { x: number; y: number } }[];
}

const teamData: TeamData[] = [
  {
    id: "tech_team",
    title: "Technical Team",
    image: "/images/TEAM_Mem/tech_team.jpeg",
    description: "Focuses on electronics, embedded systems, IoT, and VLSI through projects, workshops, and mentorship.",
    members: [
      { name: "Neha J S", position: { x: 85, y: 65 } },
      { name: "Sindhuja U", position: { x: 72, y: 65 } },
      { name: "Mekala Abhirama", position: { x: 58, y: 65 } },
      { name: "Prasanna Kumaran", position: { x: 45, y: 65 } },
      { name: "Kunaal Raju M", position: { x: 35,y: 65 } },
      { name: "Divyashree N", position: { x: 20, y: 65 } },
      { name: "Kavyanjali", position: { x: 10, y: 65 } }
    ]
  },
  {
    id: "design_team",
    title: "Design Team",
    image: "/images/TEAM_Mem/Design_team.jpeg",
    description: "Creates visual identities, user interfaces, and creative solutions for all SCOPE initiatives.",
    members: [
      { name: "Sruthi Subhash", position: { x: 75, y: 65 } },
      { name: "Vedhashri M", position: { x: 68, y: 65 } },
      { name: "Anantha Sai Gudivada", position: { x: 58, y: 65 } },
      { name: "Rayyan Ahmed", position: { x: 45, y: 65 } },
      { name: "Nidish MG", position: { x: 35, y: 65 } },
      { name: "Srijan Srivastava", position: { x: 24, y: 65 } },
      { name: "Nikhil N", position: { x: 14, y: 65 } }
    ]
  },
  {
    id: "events_team",
    title: "Events Team",
    image: "/images/TEAM_Mem/events_team.jpeg",
    description: "Organizes workshops, seminars, competitions, and technical events for the community.",
    members: [
      { name: "Nikhil Ajay", position: { x: 82, y: 65 } },
      { name: "Imdad Aqueel", position: { x: 72, y: 65 } },
      { name: "Joel Jo", position: { x: 64, y: 65 } },
      { name: "Rohan Baiju", position: { x: 52, y: 65 } },
      { name: "Nandish Reddy", position: { x: 43, y: 65 } },
      { name: "Viha Shomikha", position: { x: 31, y: 65 } },
      { name: "Arfa", position: { x: 23, y: 65 } },
      { name: "Ananya Y", position: { x: 13, y: 65 } }
    ]
  },
  {
    id: "pr_team",
    title: "PR Team",
    image: "/images/TEAM_Mem/pr_team.jpeg",
    description: "Manages communications, social media presence, and outreach activities.",
    members: [
      { name: "Dhiya Krishna R", position: { x: 64, y: 65 } },
      { name: "Dhanyashree Karnam", position: { x: 37, y: 65 } }
    ]
  },
  {
    id: "student_coordinator",
    title: "Student Coordinator",
    image: "/images/TEAM_Mem/student_cordinator.jpeg",
    description: "Bridges communication between students, faculty, and administration for smooth operations.",
    members: [
      { name: "Vaibhav S J", position: { x: 86, y: 65 } },
      { name: "Joyce Aparna", position: { x: 76, y: 65 } },
      { name: "Gagana K", position: { x: 67, y: 65 } },
      { name: "Monika S", position: { x: 60, y: 65 } },
      { name: "Nandana Rajesh", position: { x: 52, y: 65 } },
      { name: "Brunda R", position: { x: 45, y: 65 } },
      { name: "Akshaya Kadiri", position: { x: 38, y: 65 } },
      { name: "Jyothishree V Daroji", position: { x: 28, y: 65 } },
      { name: "Vaishnavi T", position: { x: 21, y: 65 } },
      { name: "Ashmitha", position: { x: 13, y: 65 } }
    ]
  }
];

export default function TeamMembers() {
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

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
              fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '3.2rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px',
              paddingLeft: '40px'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-7 rounded"
              style={{
                background: 'linear-gradient(to bottom, var(--secondary-pink), var(--primary-purple))'
              }}
            ></span>
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
          {teamData.map((team) => (
            <motion.div
              key={team.id}
              variants={itemVariants}
              className="group cursor-pointer"
              onClick={() => setSelectedTeam(team)}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-[#F24DC2]/50 group-hover:shadow-[0_0_30px_rgba(242,77,194,0.3)]">
                {/* Team Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={team.image}
                    alt={team.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Team Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {team.title}
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
          ))}
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
              className="relative z-[100000] bg-white/10 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 mx-4"
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
                <div className="relative h-[650px]">
                  <Image
                    src={selectedTeam.image}
                    alt={selectedTeam.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Name Tags for Team Members (only for Technical Team) */}
                  {selectedTeam.members && selectedTeam.members.map((member, index) => (
                    <div
                      key={index}
                      className="absolute group/member"
                      style={{
                        left: `${member.position.x}%`,
                        top: `${member.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Hover Area */}
                      <div className="w-32 h-32 cursor-pointer relative">
                        {/* Invisible hover trigger */}
                        <div className="absolute inset-0 bg-transparent hover:bg-white/5 rounded-full transition-all duration-200"></div>
                        
                        {/* Name Tag */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover/member:opacity-100 transition-all duration-300 pointer-events-none">
                          <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-base font-medium whitespace-nowrap border border-white/30 shadow-2xl">
                            {member.name}
                            {/* Arrow pointing down */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-black/90"></div>
                          </div>
                        </div>
                        
                        {/* Dot indicator - invisible but larger hover area */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full opacity-0 group-hover/member:opacity-30 transition-all duration-300 shadow-lg border border-white/30"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team Details */}
                <div className="p-8">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] mb-4">
                    {selectedTeam.title}
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
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
