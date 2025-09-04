import React from "react";
import styles from "./AboutUs.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";

const AboutUs: React.FC = () => {
  return (
    <section className={styles.aboutUsSection} id="about-us">
      <div className={styles.container}>
        <SectionTitle title="ABOUT US" showLines={true} />
        <div className={styles.contentWrapper}>
          <div className={styles.mission}>
            <h3 className={styles.missionTitle}>OUR MISSION</h3>
            <p>
              Our mission is to ignite curiosity and passion for electronics
              among students by providing a platform for hands-on learning,
              innovation, and collaboration. Through engaging projects,
              workshops, and events, we aim to bridge the gap between
              theoretical knowledge and practical application. We strive to
              create a community where students can explore emerging
              technologies, develop problem-solving skills, and work on
              real-world challenges. By fostering creativity and teamwork, we
              empower the next generation of engineers and tech enthusiasts
              to turn ideas into impactful innovations.
            </p>
          </div>

          
          {/* ✅ Video Illustration (no border, no background) */}
<div className={styles.illustration}>
  <video
    src="/images/rocket.mp4"
    autoPlay
    muted
    playsInline
    className="w-full h-auto mix-blend-screen"
  >
    Your browser does not support the video tag.
  </video>
</div>



        </div>
      </div>
    </section>
  );
};

export default AboutUs;
