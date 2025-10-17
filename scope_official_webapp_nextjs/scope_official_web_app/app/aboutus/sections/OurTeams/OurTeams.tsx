import React from "react";
import styles from "./OurTeams.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import TeamCard from "../../components/TeamCard/TeamCard";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";

const OurTeams: React.FC = () => {
  const teams: Array<{ name: string; position: "left" | "right" }> = [
    { name: "Event Management", position: "left" },
    { name: "Content and design", position: "right" },
    { name: "Student coordinators", position: "left" },
    { name: "PR and Marketing", position: "right" },
    { name: "Technical", position: "left" },
  ];

  return (
    <section className={styles.ourTeamsSection} id="team">
      <div className={styles.container}>
        <HorizontalDivider marginBottom="30px" />
        <SectionTitle title="OUR TEAMS" showLines={true} />
        {/* Decorative background element */}
        <div className={styles.decorativeElement}></div>
        <div className={styles.timelineContainer}>
          {teams.map((team, index) => (
            <div
              key={index}
              className={`${styles.timelineItem} ${
                team.position === "left" ? styles.itemLeft : styles.itemRight
              }`}
            >
              <div className={styles.timelineDot}></div>
              {/* Correctly passing the props to TeamCard */}
              <TeamCard teamName={team.name} position={team.position} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeams;
