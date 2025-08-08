import React from "react";
import styles from "./AboutUs.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
// import HorizontalDivider from '../../components/HorizontalDivider/HorizontalDivider'; // REMOVED: This import is no longer needed if the divider is removed

const AboutUs: React.FC = () => {
  return (
    <section className={styles.aboutUsSection} id="about-us">
      <div className={styles.container}>
        {/* REMOVED: The HorizontalDivider component */}
        {/* <HorizontalDivider marginBottom="50px" /> */}
        <SectionTitle title="ABOUT US" /> {/* HTML title with CSS lines */}
        <div className={styles.contentWrapper}>
          <div className={styles.mission}>
            <h3 className={styles.missionTitle}>OUR MISSION</h3>
            <p>
              Our mission is to ignite curiosity and passion for electronics,
              fostering innovation, and collaboration. Through engaging
              projects, comprehensive workshops, and insightful technical
              discussions, we strive to elevate theoretical knowledge and
              practical application. We aim to create a community where students
              can learn, develop real-world solutions, and be inspired to tackle
              complex technological challenges. By fostering creativity and
              teamwork, we empower our members to transform their ideas into
              impactful innovations.
            </p>
          </div>
          <div className={styles.illustration}>
            <img
              src="/about-us-illustration.png"
              alt="SCOPE Mission Illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
