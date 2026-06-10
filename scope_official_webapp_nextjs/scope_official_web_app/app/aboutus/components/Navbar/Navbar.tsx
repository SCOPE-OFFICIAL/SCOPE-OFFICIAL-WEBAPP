import React from "react";
import Image from "next/image";
import styles from "./Navbar.module.css"; // Import the CSS module

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image src="/images/scope_logo.png" alt="SCOPE Logo" width={140} height={140} priority />
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#events">Events</a>
          </li>
          <li>
            <a href="#about-us">About Us</a>
          </li>
          <li>
            <a href="#team">Team</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
