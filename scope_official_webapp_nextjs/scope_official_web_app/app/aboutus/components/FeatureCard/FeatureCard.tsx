import React from "react";
import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
  iconSrc: string;
  title: string;
  description: string;
  // New prop to control the border style (must match CSS classes)
  boxType?: 'blue' | 'pink' | 'default'; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  iconSrc,
  title,
  description,
  boxType = 'default', // Default to a neutral border
}) => {

  // Dynamically select the correct class for the border
  const borderClass = boxType === 'blue' 
    ? styles.blueBorder 
    : boxType === 'pink' 
    ? styles.pinkBorder 
    : '';

  return (
    <div className={`${styles.card} ${borderClass}`}>
      <div className={styles.iconContainer}>
        <img src={iconSrc} alt={`${title} Icon`} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default FeatureCard;