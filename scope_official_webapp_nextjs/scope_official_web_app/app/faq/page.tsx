"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from '../components/AnimatedButton';
import FooterComponent from '../components/FooterComponent';

export default function FaqPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is SCOPE and what do you do?",
      answer: "SCOPE (Society of Core Oriented Projects in Electronics) is a student-led electronics club that focuses on promoting electronics and circuit design among students. We organize workshops, competitions, and projects to enhance practical learning in electronics."
    },
    {
      question: "How can I join SCOPE?",
      answer: "You can join SCOPE by attending our recruitment events, filling out the membership form, or contacting any of our team members. We welcome students from all departments who are interested in electronics."
    },
    {
      question: "What kind of events does SCOPE organize?",
      answer: "We organize various events including technical workshops, circuit designing competitions, PCB designing sessions, robotics workshops, guest lectures from industry experts, and hands-on project development sessions."
    },
    {
      question: "Do I need prior experience in electronics to join?",
      answer: "No prior experience is required! We welcome beginners and provide foundational training. Our workshops are designed to cater to all skill levels, from basic electronics to advanced circuit design."
    },
    {
      question: "What are the benefits of joining SCOPE?",
      answer: "Members get access to workshops, hands-on training, industry exposure, networking opportunities, project guidance, access to tools and components, and certification for completed courses and projects."
    },
    {
      question: "Are there any membership fees?",
      answer: "Membership details including any fees are communicated during recruitment. We strive to keep costs minimal and focus on providing maximum value to our members."
    },
    {
      question: "Can I propose a project or workshop idea?",
      answer: "Absolutely! We encourage members to propose new ideas for projects, workshops, or events. Innovation and creativity are at the heart of what we do at SCOPE."
    },
    {
      question: "How often do you conduct meetings and events?",
      answer: "We conduct regular meetings and events throughout the academic year. The frequency varies based on the academic calendar, but we typically have activities every few weeks."
    }
  ];

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <motion.div 
      id="faq-section" 
      data-section="faq" 
      className="flex flex-col min-h-screen text-white font-sans relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Static Vibrant Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040A28] via-[#0d1b3d] to-[#040A28]">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(147, 51, 234, 0.3) 0%, 
              rgba(79, 70, 229, 0.25) 30%, 
              rgba(44, 151, 255, 0.3) 60%, 
              rgba(15, 23, 42, 0.9) 100%)`
          }}
        />
      </div>
      
      {/* Animated Background Elements (Balls) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          // Static positions that don't change on re-render
          const positions = [
            { left: '10%', top: '20%' },
            { left: '80%', top: '10%' },
            { left: '20%', top: '80%' },
            { left: '70%', top: '60%' },
            { left: '50%', top: '30%' },
            { left: '15%', top: '50%' }
          ];
          const durations = [25, 30, 20, 28, 22, 26];
          
          return (
            <motion.div
              key={i}
              className="absolute w-72 h-72 rounded-full opacity-5"
              style={{
                background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
                left: positions[i].left,
                top: positions[i].top,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
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
        {[...Array(6)].map((_, i) => {
          // Static positions that don't change on re-render
          const positions = [
            { left: '10%', top: '20%' },
            { left: '80%', top: '10%' },
            { left: '20%', top: '80%' },
            { left: '70%', top: '60%' },
            { left: '50%', top: '30%' },
            { left: '15%', top: '50%' }
          ];
          const durations = [25, 30, 20, 28, 22, 26];
          
          return (
            <motion.div
              key={i}
              className="absolute w-72 h-72 rounded-full opacity-5"
              style={{
                background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
                left: positions[i].left,
                top: positions[i].top,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
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

      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => {
          // Static positions for particles
          const particlePositions = [
            { left: '5%', top: '15%' }, { left: '25%', top: '25%' }, { left: '45%', top: '35%' },
            { left: '65%', top: '15%' }, { left: '85%', top: '25%' }, { left: '15%', top: '55%' },
            { left: '35%', top: '65%' }, { left: '55%', top: '75%' }, { left: '75%', top: '85%' },
            { left: '95%', top: '45%' }, { left: '25%', top: '85%' }, { left: '85%', top: '65%' }
          ];
          const particleDurations = [18, 16, 20, 22, 19, 17, 21, 15, 23, 19, 16, 18];
          const particleDelays = [0, 0.5, 1, 1.5, 2, 0.3, 0.8, 1.3, 1.8, 0.2, 0.7, 1.2];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full"
              style={{
                left: particlePositions[i].left,
                top: particlePositions[i].top,
              }}
              animate={{
                y: [0, -7, 0],
                x: [0, 3, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particleDurations[i],
                repeat: Infinity,
                delay: particleDelays[i],
                ease: "easeInOut",
              }}
            />
          );
        })}
        {[...Array(12)].map((_, i) => {
          // Static positions for particles
          const particlePositions = [
            { left: '5%', top: '15%' }, { left: '25%', top: '25%' }, { left: '45%', top: '35%' },
            { left: '65%', top: '15%' }, { left: '85%', top: '25%' }, { left: '15%', top: '55%' },
            { left: '35%', top: '65%' }, { left: '55%', top: '75%' }, { left: '75%', top: '85%' },
            { left: '95%', top: '45%' }, { left: '25%', top: '85%' }, { left: '85%', top: '65%' }
          ];
          const particleDurations = [18, 16, 20, 22, 19, 17, 21, 15, 23, 19, 16, 18];
          const particleDelays = [0, 0.5, 1, 1.5, 2, 0.3, 0.8, 1.3, 1.8, 0.2, 0.7, 1.2];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full"
              style={{
                left: particlePositions[i].left,
                top: particlePositions[i].top,
              }}
              animate={{
                y: [0, -7, 0],
                x: [0, 3, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particleDurations[i],
                repeat: Infinity,
                delay: particleDelays[i],
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <motion.main 
        className="flex-grow container mx-auto px-6 py-20 pb-64 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Centered Heading Section */}
        <motion.div 
          className="text-center mb-12 max-w-7xl mx-auto mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="tracking-tight"
            style={{
              fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '3.2rem',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              letterSpacing: '2px'
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Frequently Asked Questions
          </motion.h1>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.p 
            className="text-gray-300 leading-relaxed text-center text-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Navigating Your Queries with Precision. Explore answers to common
            questions about circuits, components, electronics fundamentals and
            the upcoming events.
          </motion.p>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
                whileHover={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(242, 77, 194, 0.3)"
                }}
              >
                <motion.button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] flex items-center justify-center"
                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <span className="text-white text-lg font-bold">+</span>
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2">
                        <motion.p 
                          className="text-gray-300 leading-relaxed"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold text-white mb-4"
              style={{
                fontFamily: '"Mango Grotesque", "Helvetica Neue", Helvetica, Arial, sans-serif',
                textShadow: '0 0 20px rgba(138, 64, 255, 0.4)',
              }}
            >
              Still Have Questions?
            </h2>
            <p className="text-gray-300 text-lg">
              Need more help? Reach out to us directly!
            </p>
          </div>

          <motion.div 
            className="flex flex-col lg:flex-row gap-16 items-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            
            <motion.div 
              className="lg:w-1/2 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.form 
                className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fieldVariants}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                    whileFocus={{ 
                      boxShadow: "0 0 20px rgba(44, 151, 255, 0.3)",
                      scale: 1.02
                    }}
                  />
                </motion.div>
                
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <motion.input
                    type="tel"
                    id="phone"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                    whileFocus={{ 
                      boxShadow: "0 0 20px rgba(44, 151, 255, 0.3)",
                      scale: 1.02
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  className="md:col-span-1"
                  variants={fieldVariants}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                    whileFocus={{ 
                      boxShadow: "0 0 20px rgba(44, 151, 255, 0.3)",
                      scale: 1.02
                    }}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div
                variants={fieldVariants}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Post Your Queries Here
                </label>
                <motion.textarea
                  id="query"
                  rows={5}
                  className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                  whileFocus={{ 
                    boxShadow: "0 0 20px rgba(44, 151, 255, 0.3)",
                    scale: 1.02
                  }}
                />
              </motion.div>

              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Submit Query
              </AnimatedButton>
            </motion.form>
            </motion.div>

            {/* Animated Illustration */}
            <motion.div 
              className="lg:w-1/2 flex items-center justify-center"
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  filter: "drop-shadow(0 20px 40px rgba(242, 77, 194, 0.2))"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <Image
                  src="/images/faq_pic.png"
                  alt="Illustration of a person with a large question mark"
                  width={380}
                  height={410}
                />

                {/* Floating question marks animation */}
                <div className="absolute inset-0">
                  {['?', '?', '?'].map((mark, i) => {
                    // Static positions for question marks
                    const questionPositions = [
                      { left: '60px', top: '70px' },
                      { left: '280px', top: '90px' },
                      { left: '170px', top: '200px' }
                    ];
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute text-4xl text-[#F24DC2] opacity-30"
                        style={{
                          left: questionPositions[i].left,
                          top: questionPositions[i].top,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 10, -10, 0],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        {mark}
                      </motion.div>
                    );
                  })}
                  {['?', '?', '?'].map((mark, i) => {
                    // Static positions for question marks
                    const questionPositions = [
                      { left: '60px', top: '70px' },
                      { left: '280px', top: '90px' },
                      { left: '170px', top: '200px' }
                    ];
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute text-4xl text-[#F24DC2] opacity-30"
                        style={{
                          left: questionPositions[i].left,
                          top: questionPositions[i].top,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 10, -10, 0],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        {mark}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
      
      {/* Spacer to ensure gap between FAQ and Footer */}
      <div className="h-32 md:h-48"></div>
      
      {/* Footer - Only appears at the end of the website */}
      <FooterComponent />
    </motion.div>
  );
}
