"use client";

import Image from "next/image";
import { useState } from "react";

// Team data with images
const teamData = [
  {
    category: "Leadership",
    members: [
      { name: "Nehasree", role: "President", image: "/team/nehasree.jpg" },
      { name: "Brunda R", role: "Vice President", image: "/team/brunda.jpg" },
      { name: "Guraman Singh", role: "Student Mentor", image: "/team/guraman.jpg" },
      { name: "Nandana Rajesh", role: "Student Coordinator Head", image: "/team/nandana.jpg" },
      { name: "Monika S", role: "Secretary", image: "/team/monika.jpg" },
      { name: "Pratham Gupta", role: "Treasurer", image: "/team/pratham.jpg" },
      { name: "Kishore", role: "Project Manager", image: "/team/kishore.jpg" }
    ]
  },
  {
    category: "PR & Marketing",
    members: [
      { name: "Kadiri Akshaya", role: "Marketing Head", image: "/team/akshaya.jpg" },
      { name: "Dhanyashree Karnam", role: "PR Team Head", image: "/team/dhanyashree.jpg" },
      { name: "Dhiya", role: "PR Team", image: "/team/dhiya.jpg" },
      { name: "Jyothishree V Daroji", role: "Student Coordinator", image: "/team/jyothishree.jpg" },
      { name: "G. Joyce Aparna", role: "Student Coordinator", image: "/team/joyce.jpg" },
      { name: "Ashmitha", role: "Student Coordinator", image: "/team/ashmitha.jpg" },
      { name: "Gagana K", role: "Student Coordinator", image: "/team/gagana.jpg" },
      { name: "Vaibhav S J", role: "Student Coordinator", image: "/team/vaibhav.jpg" },
      { name: "Vaishnavi T", role: "Student Coordinator", image: "/team/vaishnavi.jpg" },
      { name: "Lathashree M S", role: "Student Coordinator", image: "/team/lathashree.jpg" }
    ]
  },
  {
    category: "Event Management",
    members: [
      { name: "Rohan Baiju", role: "Event Management Head", image: "/team/rohan.jpg" },
      { name: "Ananya Y", role: "Team Member", image: "/team/ananya.jpg" },
      { name: "Nikhil Ajay", role: "Team Member", image: "/team/nikhil.jpg" },
      { name: "Arfa", role: "Team Member", image: "/team/arfa.jpg" },
      { name: "Imdad Aqueel", role: "Team Member", image: "/team/imdad.jpg" },
      { name: "Pranav Kamboj", role: "Team Member", image: "/team/pranav.jpg" },
      { name: "Viha Shomikha", role: "Team Member", image: "/team/viha.jpg" },
      { name: "Nandish Reddy", role: "Team Member", image: "/team/nandish.jpg" },
      { name: "Varsha V", role: "Team Member", image: "/team/varsha.jpg" },
      { name: "Joel Jo", role: "Team Member", image: "/team/joel.jpg" }
    ]
  },
  {
    category: "Content & Design",
    members: [
      { name: "Rayyan Ahamed", role: "Content Manager", image: "/team/rayyan.jpg" },
      { name: "Anantha Sai Gudivada", role: "Designer Head", image: "/team/anantha.jpg" },
      { name: "Nidhish MG", role: "Team Member", image: "/team/nidhish.jpg" },
      { name: "Sruthi Subhash", role: "Team Member", image: "/team/sruthi.jpg" },
      { name: "Srijan Srivastava", role: "Team Member", image: "/team/srijan.jpg" },
      { name: "Vedhashri M", role: "Team Member", image: "/team/vedhashri.jpg" },
      { name: "Nikhil N", role: "Team Member", image: "/team/nikhil-n.jpg" }
    ]
  },
  {
    category: "Technical",
    members: [
      { name: "Prasanna Kumaran", role: "Technical Head", image: "/team/prasanna.jpg" },
      { name: "Sindhuja U", role: "Team Member", image: "/team/sindhuja.jpg" },
      { name: "Divyashree N", role: "Team Member", image: "/team/divyashree.jpg" },
      { name: "Vyshak Bharadwaj L", role: "Team Member", image: "/team/vyshak.jpg" },
      { name: "Neha J S", role: "Team Member", image: "/team/neha.jpg" },
      { name: "Kavyanjali", role: "Team Member", image: "/team/kavyanjali.jpg" },
      { name: "Kunaal Raju M", role: "Team Member", image: "/team/kunaal.jpg" },
      { name: "Mekala Abhi Rama V S Sai Kumar", role: "Team Member", image: "/team/mekala.jpg" }
    ]
  }
];

// Categories for filtering
const categories = ["All", "Leadership", "PR & Marketing", "Event Management", "Content & Design", "Technical"];

export default function TeamGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredTeams = selectedCategory === "All" 
    ? teamData 
    : teamData.filter(team => team.category === selectedCategory);

  const openMemberModal = (member) => {
    setSelectedMember(member);
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="team-gallery-container">
      {/* Header Section */}
      <section className="team-gallery-hero">
        <div className="hero-content">
          <h1 className="hero-title">SCOPE Team 2025</h1>
          <p className="hero-subtitle">
            United by Passion, Driven by Teamwork
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="category-filters">
        <div className="filters-container">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Teams Grid */}
      <section className="teams-grid-section">
        {filteredTeams.map(team => (
          <div key={team.category} className="team-category">
            <h2 className="team-category-title">{team.category}</h2>
            <div className="members-grid">
              {team.members.map((member, index) => (
                <div key={index} className="member-card" onClick={() => openMemberModal(member)}>
                  <div className="member-image-container">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="member-image"
                    />
                    <div className="member-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={closeMemberModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMemberModal}>
              &times;
            </button>
            <div className="modal-image-container">
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                width={300}
                height={300}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <h2>{selectedMember.name}</h2>
              <p className="modal-role">{selectedMember.role}</p>
              <p className="modal-description">
                {selectedMember.description || "Dedicated member of the SCOPE team contributing to innovation and excellence."}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .team-gallery-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #040A28 0%, #0a1039 100%);
          color: #fff;
          padding: 2rem 1rem;
        }
        
        .team-gallery-hero {
          text-align: center;
          padding: 4rem 1rem;
          background: rgba(13, 18, 41, 0.6);
          border-radius: 16px;
          margin-bottom: 3rem;
          border: 1px solid rgba(108, 141, 255, 0.1);
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #6c8dff 0%, #8a5eff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 20px rgba(108, 141, 255, 0.3);
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          color: #aab4e8;
          max-width: 600px;
          margin: 0 auto;
          font-style: italic;
        }
        
        /* Category Filters */
        .category-filters {
          margin-bottom: 3rem;
        }
        
        .filters-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .filter-btn {
          padding: 0.8rem 1.5rem;
          background: rgba(108, 141, 255, 0.1);
          color: #6c8dff;
          border: 1px solid rgba(108, 141, 255, 0.2);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .filter-btn:hover, .filter-btn.active {
          background: #6c8dff;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(108, 141, 255, 0.3);
        }
        
        /* Teams Grid */
        .teams-grid-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .team-category {
          margin-bottom: 4rem;
        }
        
        .team-category-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #fff;
          text-align: center;
          position: relative;
          padding-bottom: 0.5rem;
        }
        
        .team-category-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #6c8dff, #8a5eff);
          border-radius: 3px;
        }
        
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .member-card {
          background: linear-gradient(145deg, #0c1338, #070c29);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          border: 1px solid rgba(108, 141, 255, 0.1);
          cursor: pointer;
        }
        
        .member-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border-color: rgba(108, 141, 255, 0.3);
        }
        
        .member-image-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        
        .member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .member-card:hover .member-image {
          transform: scale(1.05);
        }
        
        .member-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .member-card:hover .member-overlay {
          opacity: 1;
        }
        
        .view-details {
          color: #fff;
          font-weight: 500;
          padding: 0.5rem 1rem;
          background: rgba(108, 141, 255, 0.8);
          border-radius: 20px;
        }
        
        .member-info {
          padding: 1.5rem;
          text-align: center;
        }
        
        .member-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .member-role {
          color: #aab4e8;
          font-size: 0.9rem;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        
        .modal-content {
          position: relative;
          max-width: 500px;
          background: #0c1338;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-image-container {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 3px solid rgba(108, 141, 255, 0.3);
        }
        
        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .modal-info {
          text-align: center;
        }
        
        .modal-info h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .modal-role {
          color: #6c8dff;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .modal-description {
          color: #aab4e8;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .members-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
          
          .modal-content {
            max-width: 90vw;
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .members-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .team-category-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}