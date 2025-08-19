"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./faq.module.css";
import Link from "next/link";

// --- FAQ Data ---
const faqData = [
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
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
              >
                {item.question}
                <span className={styles.accordionIcon}>+</span>
              </button>
              <div
                className={styles.accordionContent}
                style={{
                  maxHeight: openIndex === index ? '200px' : '0px',
                  padding: openIndex === index ? '1rem 2rem 2rem' : '0',
                }}
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
              <form className={styles.contactForm}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Name
                    </label>
                    <input type="text" id="name" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number
                    </label>
                    <input type="tel" id="phone" className={styles.input} />
                  </div>
                  <div className={styles.colSpan}>
                    <label htmlFor="email" className={styles.label}>
                      Email
                    </label>
                    <input type="email" id="email" className={styles.input} />
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
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>
                  Send Query
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
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
