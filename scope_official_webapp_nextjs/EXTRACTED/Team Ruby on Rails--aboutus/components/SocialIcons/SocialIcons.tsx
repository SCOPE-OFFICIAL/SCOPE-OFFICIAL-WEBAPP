import React from "react";
import styles from "./SocialIcons.module.css"; // Import the CSS module

const SocialIcons: React.FC = () => {
  return (
    <div className={styles.socialIconsContainer}>
      {/* Assuming icons are in your public directory */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.iconLink}
      >
        <img
          src="/instagram-icon.png"
          alt="Instagram"
          className={styles.icon}
        />
      </a>
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.iconLink}
      >
        <img
          src="/x-icon.png"
          alt="X (formerly Twitter)"
          className={styles.icon}
        />
      </a>
      <a
        href="https://www.linkedin.com/company/scope-reva-university/posts/?feedView=all"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.iconLink}
      >
        <img src="/linkedin-icon.png" alt="LinkedIn" className={styles.icon} />
      </a>
    </div>
  );
};

export default SocialIcons;
