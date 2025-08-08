import React from "react";
import styles from "./WhatWeDo.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";

const WhatWeDo: React.FC = () => {
  return (
    <section className={styles.whatWeDoSection} id="what-we-do">
      <div className={styles.container}>
        <HorizontalDivider marginBottom="50px" />
        <SectionTitle title="WHAT WE DO?" showLines={false} />{" "}
        {/* No lines for this title */}
        <div className={styles.cardsContainer}>
          <FeatureCard
            iconSrc="/projects-icon.png"
            title="Projects"
            description="Projects involving designing and developing cutting-edge systems such as IoT, power electronics, and robotics."
          />
          <FeatureCard
            iconSrc="/technical-talks-icon.png"
            title="Technical Talks"
            description="Talks focused on various technologies, problem-solving techniques, and research findings."
          />
          <FeatureCard
            iconSrc="/workshops-icon.png"
            title="Workshops"
            description="Workshops including hands-on sessions which are led to the students helping them learn a particular skill."
          />
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
