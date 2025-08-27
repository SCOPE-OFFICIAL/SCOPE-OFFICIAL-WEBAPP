"use client";

import Image from "next/image";
import { useState } from "react";

// --- Faculty Members ---
const facultyMembers = [
  {
    role: "SCOPE COORDINATOR",
    name: "Prof. Dilip Chandra E",
    image: "/images/dilip.png",
    linkedin: "#",
  },
  {
    role: "VERTICAL HEAD",
    name: "Dr. Rashmi Priyadarshini",
    image: "/images/rashmi.png",
    linkedin: "#",
  },
  {
    role: "DIRECTOR OF ECE",
    name: "Dr. K. M. Sudarshan",
    image: "/images/sudarshan.png",
    linkedin: "#",
  },
];

// --- Student Team Members ---
const studentMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/marisettynehasree",
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png",
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg",
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg",
    instagram: "https://www.instagram.com/nandana2628",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg",
    instagram: "https://www.instagram.com/_m.o.n.i.k.a_16",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png",
    instagram: "https://www.instagram.com/__pratham__01",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg",
    instagram: "https://www.instagram.com/mhskreddy_04",
    linkedin: "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg",
    instagram: "https://www.instagram.com/dhanyaaayyy",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg",
    instagram: "https://www.instagram.com/borahae_hearts",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content head.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg",
    instagram: "https://www.instagram.com/ananthasaigudivada",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg",
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- Team Card ---
const TeamCard = ({ member, isFaculty = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`team-member-card ${isFaculty ? "faculty-card" : ""}`}>
      <div className="member-image-container">
        <Image
          src={imageError ? "/images/placeholder avatar.jpg" : member.image}
          alt={member.name}
          width={150}
          height={150}
          className="member-image"
          onError={() => setImageError(true)}
        />
        <div className="image-overlay"></div>
      </div>
      <h2 className="member-role">{member.role}</h2>
      <p className="member-name">{member.name}</p>
      <div className="member-socials">
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label={`${member.name} Instagram`}
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label={`${member.name} LinkedIn`}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

// --- Team Page ---
export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* Hero */}
      <section className="team-hero-section">
        <div className="team-hero-content">
          <h1 className="team-hero-title">OUR TEAM</h1>
          <p className="team-hero-subtitle">
            Meet the brilliant minds behind SCOPE - our dedicated faculty
            mentors and passionate student leaders driving innovation forward.
          </p>
        </div>
        <div className="team-hero-image">
          <Image
            src="/images/3 pick.png"
            alt="Team Illustration"
            width={800}
            height={400}
            className="hero-img"
          />
        </div>
      </section>

      {/* Faculty */}
      <section className="team-section faculty-section">
        <div className="section-header">
          <h2 className="section-title">Faculty Mentors</h2>
          <p className="section-subtitle">
            Our guiding lights who provide valuable direction and support
          </p>
        </div>
        <div className="team-grid faculty-grid">
          {facultyMembers.map((member, index) => (
            <TeamCard
              key={`faculty-${index}`}
              member={member}
              isFaculty={true}
            />
          ))}
        </div>
      </section>

      {/* Students */}
      <section className="team-section student-section">
        <div className="section-header">
          <h2 className="section-title">Student Core Team</h2>
          <p className="section-subtitle">
            The passionate students driving innovation and excellence at SCOPE
          </p>
        </div>
        <div className="team-grid student-grid">
          {studentMembers.map((member, index) => (
            <TeamCard key={`student-${index}`} member={member} />
          ))}
        </div>
      </section>

      {/* --- Styles --- */}
      <style jsx>{`
        .team-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #040a28 0%, #0a1039 100%);
          color: #fff;
          padding: 2rem 1rem;
        }
        .team-hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 1rem;
          max-width: 1200px;
          margin: 0 auto 4rem;
          animation: fadeIn 1.2s ease;
        }
        .team-hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff; /* ✅ pure white */
  text-shadow: 0 4px 20px rgba(255, 255, 255, 0.15); /* optional subtle glow */
}

        .team-hero-subtitle {
          font-size: 1.2rem;
          color: #aab4e8;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }
        .team-hero-image {
          max-width: 800px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        .team-hero-image:hover {
          transform: translateY(-5px) scale(1.02);
        }
        .team-section {
          max-width: 1200px;
          margin: 0 auto 5rem;
          padding: 0 1rem;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .section-subtitle {
          font-size: 1.1rem;
          color: #aab4e8;
          max-width: 600px;
          margin: 0 auto;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          justify-items: center;
        }
        .faculty-grid {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }
        .team-member-card {
          background: linear-gradient(145deg, #0c1338, #070c29);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          border: 1px solid rgba(108, 141, 255, 0.1);
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 300px;
          animation: fadeUp 1s ease;
        }
        .team-member-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border-color: rgba(108, 141, 255, 0.3);
        }
        .team-member-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6c8dff, #8a5eff);
        }
        .faculty-card {
          background: linear-gradient(145deg, #101945, #0a1039);
          max-width: 350px;
        }
        .faculty-card::before {
          background: linear-gradient(90deg, #ff40a8, #ff6b6b);
        }
        .member-image-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(108, 141, 255, 0.2);
        }
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(108, 141, 255, 0.2),
            rgba(138, 94, 255, 0.2)
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 50%;
        }
        .team-member-card:hover .image-overlay {
          opacity: 1;
        }
        .member-role {
          font-size: 0.9rem;
          font-weight: 600;
          color: #6c8dff;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .faculty-card .member-role {
          color: #ff6b6b;
        }
        .member-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .member-socials {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .social-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(108, 141, 255, 0.1);
          color: #6c8dff;
          transition: all 0.3s ease;
        }
        .social-icon-link:hover {
          background: #6c8dff;
          color: #fff;
          transform: translateY(-3px);
        }
        .icon {
          width: 20px;
          height: 20px;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .team-hero-title {
            font-size: 2.5rem;
          }
          .team-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          .faculty-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .team-hero-title {
            font-size: 2rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
