import React from "react";
import styles from "./TeamCard.module.css"; // Import the CSS module

interface TeamCardProps {
  teamName: string;
  position: "left" | "right"; // To define its position in the staggered layout
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, position }) => {
  return (
    <div className={`${styles.teamCard} ${styles[position]}`}>
      <p className={styles.teamName}>{teamName}</p>
    </div>
  );
};

export default TeamCard;
