import React from "react";
import Link from "next/link";
import styles from "./WhatWeDo.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PartnersTicker from '../../../components/PartnersTicker';
import FeatureCard from "../../components/FeatureCard/FeatureCard";

const WhatWeDo: React.FC = () => {
  const programs = [
    {
      iconSrc: "/images/bulb-icon.png",
      title: "LEARN & SHAPE",
      description: "Dedicated workshops and expert talks to sharpen your skills.",
      boxType: "blue" as const,
    },
    {
      iconSrc: "/images/chat-icon.png",
      title: "NETWORK",
      description: "Connect with industry leaders and expand your professional circle.",
      boxType: "blue" as const,
    },
    {
      iconSrc: "/images/robot-icon.png",
      title: "BUILD",
      description: "Engage in interdisciplinary, hands-on projects that solve real-world problems.",
      boxType: "blue" as const,
    },
  ];

  return (
    <div 
      className={styles.container}
      style={{ 
        overflow: 'visible', 
        height: 'auto', 
        minHeight: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Main Title of the section: WHAT WE OFFER */}
      <SectionTitle title="WHAT WE OFFER" showLines={false} />
      
      {/* Sub-Headline: LEARN. NETWORK. INNOVATE. */}
      <p className={styles.subHeadline}>LEARN. NETWORK. INNOVATE.</p>

      {/* --- Programs Grid --- */}
      <h2 className={styles.programsTitle}>OUR PROGRAMS</h2>
      <div className={styles.cardsContainer}>
        {programs.map((program) => (
          <FeatureCard
            key={program.title}
            iconSrc={program.iconSrc}
            title={program.title}
            description={program.description}
            boxType={program.boxType}
          />
        ))}
      </div>

  {/* Partners slider inserted below WHAT WE OFFER */}
  <PartnersTicker />

  {/* --- Enhanced Call to Action --- */}
      <div className={styles.callToActionContainer}>
        <h3 className={styles.ctaTitle}>READY TO GET STARTED?</h3>
        <Link href="/#faq">
          <button className={styles.ctaButton}>
            JOIN OUR COMMUNITY
          </button>
        </Link>
        <p className={styles.ctaTagline}>
          Become part of a vibrant community of innovators, creators, and tech enthusiasts 
          shaping the future together.
        </p>
      </div>

      {/* Decorative Separator Line */}
      <div className={styles.sectionSeparator}>
        <div className={styles.separatorLine}></div>
        <div className={styles.separatorDot}></div>
        <div className={styles.separatorLine}></div>
      </div>
    </div>
  );
};

export default WhatWeDo;