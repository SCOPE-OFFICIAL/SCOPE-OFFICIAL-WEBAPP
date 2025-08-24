"use client";

import React, { useState } from "react";
import styles from "./OurTeams.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";

const OurTeams: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState(0);
  
  const teams = [
    { 
      name: "Event Management", 
      image: "/images/event-management.png" // Update with your actual image path
    },
    { 
      name: "Content and Design", 
      image: "/images/content-design.png" // Update with your actual image path
    },
    { 
      name: "Student Coordinators and Marketing", 
      image: "/images/student-coordinators.png" // Update with your actual image path
    },
    
    { 
      name: "Technical", 
      image: "/images/technical.png" // Update with your actual image path
    },
  ];

  return (
    <section className={styles.ourTeamsSection} id="team">
      <div className={styles.container}>
        <HorizontalDivider marginBottom="50px" />
        <SectionTitle title="OUR TEAMS" showLines={false} />
        
        {/* Team Tabs */}
        <div className={styles.tabsContainer}>
          {teams.map((team, index) => (
            <button
              key={index}
              className={`${styles.tab} ${activeTeam === index ? styles.activeTab : ""}`}
              onClick={() => setActiveTeam(index)}
            >
              {team.name}
            </button>
          ))}
        </div>
        
        {/* Team Photo Display */}
        <div className={styles.photoContainer}>
          <img 
            src={teams[activeTeam].image} 
            alt={`${teams[activeTeam].name} Team`}
            className={styles.teamPhoto}
          />
          
        </div>
      </div>
    </section>
  );
};

export default OurTeams;