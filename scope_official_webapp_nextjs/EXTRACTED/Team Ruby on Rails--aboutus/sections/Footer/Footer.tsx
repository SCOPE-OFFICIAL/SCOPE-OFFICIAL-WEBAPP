import React from "react";
import styles from "./Footer.module.css";
import SocialIcons from "../../components/SocialIcons/SocialIcons";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.container}>
        {/* REMOVED: The main horizontal line element (div with class mainFooterDivider) */}

        <div className={styles.connectTextWrapper}>
          <div
            className={`${styles.connectLine} ${styles.connectLineLeft}`}
          ></div>
          <p className={styles.connectText}>Connect with us</p>
          <div
            className={`${styles.connectLine} ${styles.connectLineRight}`}
          ></div>
        </div>

        <SocialIcons />
      </div>
    </footer>
  );
};

export default Footer;
