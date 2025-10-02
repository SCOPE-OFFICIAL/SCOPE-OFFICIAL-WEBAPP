import React from "react";
import styles from "./AboutUs.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { FaLightbulb, FaCog } from "react-icons/fa";

interface InfoBoxProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  type: "mission" | "value";
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, content, icon, type }) => (
  <div className={`${styles.infoBox} ${styles[`${type}Box`]}`}>
    <h3 className={styles.boxTitle}>{title}</h3>
    <div className={styles.boxContent}>
      {icon}
      <p>{content}</p>
    </div>
  </div>
);

export default function AboutUs() {
  const infoBoxes: InfoBoxProps[] = [
    {
      title: "OUR MISSION",
      content: "Ignite passion for tech, foster innovation, and bridge the gap between theory and real-world application.",
      icon: <FaLightbulb className={styles.boxIcon} />,
      type: "mission"
    },
    {
      title: "WHY WE EXIST",
      content: "We shift the focus toward technology careers by providing hands-on experience often missing in traditional curriculum.",
      icon: <FaCog className={styles.boxIcon} />,
      type: "value"
    }
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
      <SectionTitle title="ABOUT US" showLines={true} />
      <p className={styles.subHeadline}>
        Empowering the next generation of innovators
      </p>

      <div className={styles.contentWrapper}>
        {infoBoxes.map((box) => (
          <InfoBox
            key={box.title}
            title={box.title}
            content={box.content}
            icon={box.icon}
            type={box.type}
          />
        ))}
      </div>
      
      <div className={styles.ctaWrapper}>
        <a href="#what-we-offer" className={styles.ctaButton}>
          LEARN MORE ABOUT OUR PROGRAMS
        </a>
      </div>
    </div>
  );
}