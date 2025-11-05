import React from "react";
import { motion } from "framer-motion";
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
    <motion.div 
      className={styles.titleContainer}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {showLines && (
        <motion.div 
          className={`${styles.line} ${styles.lineLeft}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      )}
      <motion.h2 
        className={styles.title}
        style={{
          textShadow: '0 0 20px rgba(242, 77, 194, 0.4)',
          letterSpacing: '2px',
          fontFamily: '"Orbitron", sans-serif'
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>
      {showLines && (
        <motion.div 
          className={`${styles.line} ${styles.lineRight}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      )}
      {subtitle && (
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
