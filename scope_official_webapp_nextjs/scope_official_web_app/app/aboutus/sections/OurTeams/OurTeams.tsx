"use client";

import React, { useState } from "react";
import styles from "./OurTeams.module.css";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";

const OurTeams: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState(0);
  const [showMembers, setShowMembers] = useState(false);

  const teams = [
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
              onClick={() => {
                setActiveTeam(index);
                setShowMembers(false); // reset members view when switching tabs
              }}
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
            onClick={() => setShowMembers(!showMembers)} // toggle members on click
          />
        </div>

        {/* Members List */}
        {showMembers && (
          <div className={styles.membersContainer}>
            <p className={styles.teamDescription}>{teams[activeTeam].description}</p>
            <ul className={styles.memberList}>
              {teams[activeTeam].members.map((member, i) => (
                <li key={i} className={styles.memberItem}>
                  {member}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeams;
