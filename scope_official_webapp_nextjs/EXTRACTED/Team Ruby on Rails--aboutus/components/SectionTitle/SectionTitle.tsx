import React from "react";
import styles from "./SectionTitle.module.css";

interface SectionTitleProps {
  title: string;
  subtitle?: string; // Optional subtitle
  showLines?: boolean; // Controls if the lines are shown
}

// Default showLines to true if not explicitly provided
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  showLines = true,
}) => {
  return (
    <div className={styles.titleContainer}>
      {showLines && <div className={`${styles.line} ${styles.lineLeft}`}></div>}
      <h2 className={styles.title}>{title}</h2>
      {showLines && (
        <div className={`${styles.line} ${styles.lineRight}`}></div>
      )}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
