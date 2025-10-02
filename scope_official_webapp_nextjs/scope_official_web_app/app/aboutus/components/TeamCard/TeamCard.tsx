import React from "react";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  teamName: string;
  position: "left" | "right";
  delay?: number;
  onClick?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  teamName, 
  position, 
  delay = 0,
  onClick 
}) => {
  const cardStyle = {
    animationDelay: `${delay}ms`,
  };

  return (
    <div 
      className={`${styles.teamCard} ${styles[position]}`}
      style={cardStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <p className={styles.teamName}>{teamName}</p>
    </div>
  );
};

export default TeamCard;

