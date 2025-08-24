"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import Link from "next/link";

// Define types for FAQ items and form data
interface FAQItem {
  id?: number;
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  query: string;
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    query: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch FAQs from backend (optional)
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        // Uncomment when backend is ready
        // const response = await fetch('/api/faqs');
        // const data = await response.json();
        // setFaqData(data);
        
        // For now, use static data
        setFaqData([
          {
            question: "What is SCOPE?",
            answer: "SCOPE is a club dedicated to fostering innovation and passion for electronics, embedded systems, and robotics. We focus on hands-on learning, projects, workshops, and technical discussions."
          },
          {
            question: "How can I join SCOPE?",
            answer: "You can join SCOPE by attending our introductory meetings and workshops, or by reaching out to our core team. We're always looking for enthusiastic members who want to learn and contribute."
          },
          {
            question: "What kind of projects do you work on?",
            answer: "Our projects range from basic circuit design and PCB development to advanced robotics, IoT systems, and software for embedded applications. We encourage members to bring their own ideas to life with our support."
          },
          {
            question: "Are there any prerequisites to join?",
            answer: "No prior experience is necessary. We welcome students from all backgrounds and skill levels. Our goal is to provide a supportive environment where you can learn from scratch."
          },
          {
            question: "How often does the club meet?",
            answer: "We typically have weekly meetings, workshops, and project sessions. Our schedule is flexible and is announced on our social media channels and our website's events page."
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      // Send form data to backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", query: "" });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.faqPageContainer}>
      <main className={styles.mainContent}>
        {/* --- Page Header --- */}
        <div className={styles.introSection}>
          <h1 className={styles.sectionTitle}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className={styles.sectionSubtitle}>
            Navigating Your Queries with Precision. Explore answers to common questions about circuits, components, electronics fundamentals and the upcoming events. Need more help? Reach out to us!
          </p>
        </div>

        {/* --- Accordion Section --- */}
        <div className={styles.accordionContainer}>
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`${styles.accordionItem} ${
                openIndex === index ? styles.active : ""
              }`}
            >
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                {item.question}
                <span className={styles.accordionIcon}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={styles.accordionContent}
                aria-hidden={openIndex !== index}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Contact Form Section --- */}
        <div className={styles.formSection}>
          <div className={styles.gridContainer}>
            {/* Left Column: Form and Text */}
            <div className={styles.formWrapper}>
              <h1 className={styles.sectionTitle}>
                ASK US ANYTHING
              </h1>
              <p className={styles.sectionSubtitle}>
                Still have questions? We are here to help. Send us your query, and we'll get back to you as soon as possible.
              </p>
              
              {submitStatus === "success" && (
                <div className={styles.successMessage}>
                  Thank you! Your query has been submitted successfully.
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className={styles.errorMessage}>
                  Sorry, there was an error submitting your query. Please try again.
                </div>
              )}
              
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className={styles.input} 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className={styles.input} 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.colSpan}>
                    <label htmlFor="email" className={styles.label}>
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className={styles.input} 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="query" className={styles.label}>
                    Post Your Queries Here
                  </label>
                  <textarea
                    id="query"
                    rows={8}
                    className={styles.textarea}
                    value={formData.query}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Query"}
                </button>
              </form>
            </div>

            {/* Right Column: Illustration */}
            <div className={styles.illustrationWrapper}>
              <Image
                src="/images/faq_pic.png"
                alt="Illustration of a person with a large question mark"
                width={380}
                height={409.7}
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}