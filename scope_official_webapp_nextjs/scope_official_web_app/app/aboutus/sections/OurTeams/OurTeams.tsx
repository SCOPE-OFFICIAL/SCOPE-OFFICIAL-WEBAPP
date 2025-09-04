import styles from "./OurTeams.module.css";
import HorizontalDivider from "../../components/HorizontalDivider/HorizontalDivider";
import SectionTitle from "../../components/SectionTitle/SectionTitle";

const teamData = [
  { title: "Event Management" },
  { title: "Content and design" },
  { title: "Student coordinators" },
  { title: "PR and Marketing" },
  { title: "Technical" },
];

export default function OurTeams() {
  return (
    <section className={styles.ourTeamsSection}>
      <HorizontalDivider marginBottom="50px" />
      <SectionTitle title="OUR TEAMS" showLines={false} />
      <div className={styles.timeline}>
        {teamData.map((team, index) => (
          <div
            key={index}
            className={`${styles.card} ${
              index % 2 === 0 ? styles.left : styles.right
            }`}
          >
            <div className={styles.content}>
              <h3>{team.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

