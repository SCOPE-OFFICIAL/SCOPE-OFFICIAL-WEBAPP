"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from '../components/AnimatedButton';
import FooterComponent from '../components/FooterComponent';
import { FAQ } from '@/lib/types/database';

export default function FaqPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [adminFaqs, setAdminFaqs] = useState<FAQ[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    question: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      // Fetch admin FAQs
      const adminRes = await fetch('/api/faq');
      const adminData = await adminRes.json();
      const visibleAdminFaqs = (adminData.faqs || []).filter((faq: FAQ) => faq.is_visible);
      setAdminFaqs(visibleAdminFaqs);

  // (Intentionally do not fetch public user questions here — public FAQ displays only admin FAQs)
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      alert('Please enter your question');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/user-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ user_name: '', user_email: '', question: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert('Failed to submit question. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error submitting question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Public FAQ should only display curated admin FAQs.
  // User-submitted questions are stored separately and moderated from the admin panel.
  const allFaqs = adminFaqs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
    type: 'admin' as const
  }));

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
      
      {/* Animated Background Elements (Balls) - Reduced for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => {
          const positions = [
            { left: '10%', top: '20%' },
            { left: '80%', top: '10%' },
            { left: '20%', top: '80%' },
            { left: '70%', top: '60%' }
          ];
          const durations = [30, 35, 28, 32];
          
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
                x: [0, 80, 0],
                y: [0, -80, 0],
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

      {/* Animated Background Particles - Reduced for performance */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const particlePositions = [
            { left: '5%', top: '15%' }, { left: '25%', top: '25%' }, 
            { left: '65%', top: '15%' }, { left: '85%', top: '25%' },
            { left: '35%', top: '65%' }, { left: '55%', top: '75%' },
            { left: '95%', top: '45%' }, { left: '25%', top: '85%' }
          ];
          const particleDurations = [20, 18, 22, 19, 21, 23, 19, 20];
          const particleDelays = [0, 0.5, 1, 1.5, 0.3, 0.8, 0.2, 0.7];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] rounded-full"
              style={{
                left: particlePositions[i].left,
                top: particlePositions[i].top,
              }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 0.5, 0.3],
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
            className="tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 600,
              color: 'var(--text-light)',
              textShadow: '0 0 20px rgba(242, 77, 194, 0.4)',
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
            className="text-gray-300 leading-relaxed text-center text-sm sm:text-base md:text-lg mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Navigating Your Queries with Precision. Explore answers to common
            questions about circuits, components, electronics fundamentals and
            the upcoming events.
          </motion.p>

          {/* FAQ Items - Simplified animations */}
          <div className="space-y-4">
            {allFaqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/8 hover:border-[#F24DC2]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: Math.min(0.05 * index, 0.5) }}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] flex items-center justify-center"
                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white text-lg font-bold">+</span>
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
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
            className="flex flex-col lg:flex-row gap-16 items-start md:items-center lg:items-start"
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
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-4"
                >
                  <p className="text-green-300 font-semibold">✅ Your question has been submitted! We&apos;ll review and answer it soon.</p>
                  <p className="text-green-200 text-sm mt-2">📧 If you provided an email, check your inbox (and spam folder) for our response!</p>
                </motion.div>
              )}

              <form 
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.user_email}
                    onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Post Your Question Here *
                </label>
                <textarea
                  id="query"
                  rows={5}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  placeholder="Ask your question..."
                  className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500 transition-all duration-300"
                />
                <p className="text-gray-400 text-xs mt-2">
                  💡 Tip: If you provide your email, we&apos;ll send you a notification when your question is answered. 
                  <span className="text-yellow-400"> Remember to check your spam folder</span> and mark our email as &quot;Not Spam&quot;!
                </p>
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Question'}
              </AnimatedButton>
            </form>
            </motion.div>

            {/* Animated Illustration - Simplified */}
            <motion.div 
              className="lg:w-1/2 flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative hover:scale-105 transition-transform duration-300 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px]">
                  <div className="relative w-full aspect-[380/410]">
                    <Image
                      src="/images/faq_pic.png"
                      alt="Illustration of a person with a large question mark"
                      fill
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 380px"
                      className="object-contain"
                    />
                  </div>

                  {/* Floating question marks animation - Simplified (positions converted to % for responsiveness) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {['?', '?', '?'].map((mark, i) => {
                      const questionPositions = [
                        { left: '62%', top: '18%' },
                        { left: '88%', top: '22%' },
                        { left: '45%', top: '55%' }
                      ];
                    
                      return (
                        <motion.div
                          key={i}
                          className="absolute text-3xl sm:text-4xl text-[#F24DC2] opacity-30"
                          style={{
                            left: questionPositions[i].left,
                            top: questionPositions[i].top,
                          }}
                          animate={{
                            y: [0, -12, 0],
                            opacity: [0.2, 0.45, 0.2],
                          }}
                          transition={{
                            duration: 3.5 + i,
                            repeat: Infinity,
                            delay: i * 0.45,
                            ease: "easeInOut",
                          }}
                        >
                          {mark}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
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
