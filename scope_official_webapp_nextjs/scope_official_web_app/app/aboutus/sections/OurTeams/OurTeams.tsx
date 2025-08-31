"use client";

import React, { useState, useMemo } from "react";
import styles from "./OurTeams.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";

const teamsData = [
  {
    name: "Event Management",
    image: "/images/event-management.png",
    description: "🎪 Event Management Team – The masterminds behind every seamless event",
    members: [
      "Event Management Head: Rohan Baiju",
      "Team: Ananya Y, Nikhil Ajay, Arfa, Imdad Aqueel, Pranav Kamboj, Viha Shomikha, Nandish Reddy, Varsha V, Joel Jo",
    ],
  },
  {
    name: "Content and Design",
    image: "/images/content-design.png",
    description: "🎨 Content & Design Team – The storytellers shaping our identity",
    members: [
      "Content Manager: Rayyan Ahamed",
      "Designer Head: Anantha Sai Gudivada",
      "Team: Nidhish MG, Sruthi Subhash, Srijan Srivastava, Vedhashri M, Nikhil N",
    ],
  },
  {
    name: "Student Coordinator and Marketing",
    image: "/images/student-coordinators.png",
    description: "📢 PR & Marketing Team – The bridge to the world",
    members: [
      "Marketing Head: Kadiri Akshaya",
      "PR Team: Head - Dhanyashree Karnam, Dhiya",
      "Student Coordinators/Documentation: Jyothishree V Daroji, G. Joyce Aparna, Ashmitha, Gagana K, Vaibhav S J, Vaishnavi T, Lathashree M S",
    ],
  },
  {
    name: "Technical",
    image: "/images/technical.png",
    description: "💻 Technical Team – The innovators driving our vision forward",
    members: [
      "Technical Head: Prasanna Kumaran",
      "Team: Sindhuja U, Divyashree N, Vyshak Bharadwaj L, Neha J S, Kavyanjali, Kunaal Raju M, Mekala Abhi Rama V S Sai Kumar",
    ],
  },
];

const OurTeams: React.FC = () => {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const teams = useMemo(() => teamsData, []);
  const activeTeam = teams[activeTeamIndex];

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
              className={`${styles.tab} ${activeTeamIndex === index ? styles.activeTab : ""}`}
              onClick={() => setActiveTeamIndex(index)}
            >
              {team.name}
            </button>
          ))}
        </div>

        {/* Content Container with Image and Members List */}
        <div className={styles.contentAndDetails}>
          {/* Team Photo Display */}
          <div className={styles.photoContainer}>
            <img
              src={activeTeam.image}
              alt={`${activeTeam.name} Team`}
              className={styles.teamPhoto}
            />
          </div>

          {/* Members List */}
          <div className={styles.membersContainer}>
            <p className={styles.teamDescription}>{activeTeam.description}</p>
            <ul className={styles.memberList}>
              {activeTeam.members.map((member, i) => (
                <li key={i} className={styles.memberItem}>
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeams;