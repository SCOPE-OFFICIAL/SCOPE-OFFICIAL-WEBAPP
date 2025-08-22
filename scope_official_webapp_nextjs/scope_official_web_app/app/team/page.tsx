"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Team data with group images
const teamData = [
  {
    id: "event-management",
    category: "Event Management",
    description: "The masterminds behind every seamless event",
    groupImage: "/team/event-management-group.jpg",
    members: [
      { name: "Rohan Baiju", role: "Event Management Head" },
      { name: "Ananya Y", role: "Team Member" },
      { name: "Nikhil Ajay", role: "Team Member" },
      { name: "Arfa", role: "Team Member" },
      { name: "Imdad Aqueel", role: "Team Member" },
      { name: "Pranav Kamboj", role: "Team Member" },
      { name: "Viha Shomikha", role: "Team Member" },
      { name: "Nandish Reddy", role: "Team Member" },
      { name: "Varsha V", role: "Team Member" },
      { name: "Joel Jo", role: "Team Member" }
    ]
  },
  {
    id: "content-design",
    category: "Content & Design",
    description: "The storytellers shaping our identity",
    groupImage: "/team/content-design-group.jpg",
    members: [
      { name: "Rayyan Ahamed", role: "Content Manager" },
      { name: "Anantha Sai Gudivada", role: "Designer Head" },
      { name: "Nidhish MG", role: "Team Member" },
      { name: "Sruthi Subhash", role: "Team Member" },
      { name: "Srijan Srivastava", role: "Team Member" },
      { name: "Vedhashri M", role: "Team Member" },
      { name: "Nikhil N", role: "Team Member" }
    ]
  },
  {
    id: "student-coordinators",
    category: "Student Coordinators",
    description: "Documenting and coordinating our activities",
    groupImage: "/team/student-coordinators-group.jpg",
    members: [
      { name: "Jyothishree V Daroji", role: "Student Coordinator" },
      { name: "G. Joyce Aparna", role: "Student Coordinator" },
      { name: "Ashmitha", role: "Student Coordinator" },
      { name: "Gagana K", role: "Student Coordinator" },
      { name: "Vaibhav S J", role: "Student Coordinator" },
      { name: "Vaishnavi T", role: "Student Coordinator" },
      { name: "Lathashree M S", role: "Student Coordinator" }
    ]
  },
  {
    id: "pr-marketing",
    category: "PR & Marketing",
    description: "Building our brand and community presence",
    groupImage: "/team/pr-marketing-group.jpg",
    members: [
      { name: "Kadiri Akshaya", role: "Marketing Head" },
      { name: "Dhanyashree Karnam", role: "PR Team Head" },
      { name: "Dhiya", role: "PR Team" }
    ]
  },
  {
    id: "technical",
    category: "Technical",
    description: "The innovators driving our vision forward",
    groupImage: "/team/technical-group.jpg",
    members: [
      { name: "Prasanna Kumaran", role: "Technical Head" },
      { name: "Sindhuja U", role: "Team Member" },
      { name: "Divyashree N", role: "Team Member" },
      { name: "Vyshak Bharadwaj L", role: "Team Member" },
      { name: "Neha J S", role: "Team Member" },
      { name: "Kavyanjali", role: "Team Member" },
      { name: "Kunaal Raju M", role: "Team Member" },
      { name: "Mekala Abhi Rama V S Sai Kumar", role: "Team Member" }
    ]
  },
  {
    id: "leadership",
    category: "Leadership",
    description: "Guiding SCOPE towards excellence",
    groupImage: "/team/leadership-group.jpg",
    members: [
      { name: "Nehasree", role: "President" },
      { name: "Brunda R", role: "Vice President" },
      { name: "Guraman Singh", role: "Student Mentor" },
      { name: "Nandana Rajesh", role: "Student Coordinator Head" },
      { name: "Monika S", role: "Secretary" },
      { name: "Pratham Gupta", role: "Treasurer" },
      { name: "Kishore", role: "Project Manager" }
    ]
  },
  {
    id: "full-team",
    category: "Full Team",
    description: "The complete SCOPE team 2025",
    groupImage: "/team/full-team-group.jpg",
    members: []
  }
];

// Categories for filtering
const categories = [
  { id: "all", name: "All" },
  { id: "full-team", name: "Full Team" },
  { id: "leadership", name: "Leadership" },
  { id: "pr-marketing", name: "PR & Marketing" },
  { id: "event-management", name: "Event Management" },
  { id: "content-design", name: "Content & Design" },
  { id: "technical", name: "Technical" },
  { id: "student-coordinators", name: "Student Coordinators" }
];

export default function TeamGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const router = useRouter();

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && categories.find(cat => cat.id === hash)) {
        setSelectedCategory(hash);
        
        // Scroll to the section after a short delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const filteredTeams = selectedCategory === "all" 
    ? teamData 
    : teamData.filter(team => team.id === selectedCategory);

  const openTeamModal = (team) => {
    setSelectedTeam(team);
  };

  const closeTeamModal = () => {
    setSelectedTeam(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      router.push("/team");
    } else {
      router.push(`/team#${categoryId}`);
    }
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
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Teams Grid */}
      <section className="teams-grid-section">
        {filteredTeams.map(team => (
          <div key={team.id} id={team.id} className="team-category">
            <h2 className="team-category-title">{team.category}</h2>
            <p className="team-category-description">{team.description}</p>
            
            <div className="team-group-card" onClick={() => openTeamModal(team)}>
              <div className="team-group-image-container">
                <Image
                  src={team.groupImage}
                  alt={`${team.category} Team`}
                  width={800}
                  height={450}
                  className="team-group-image"
                />
                <div className="team-group-overlay">
                  <span className="view-details">View Team Details</span>
                </div>
              </div>
            </div>

            {/* Team members list */}
            {team.members.length > 0 && (
              <div className="team-members-list">
                <h3 className="members-list-title">Team Members</h3>
                <div className="members-grid">
                  {team.members.map((member, index) => (
                    <div key={index} className="member-item">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-role">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Team Modal */}
      {selectedTeam && (
        <div className="modal-overlay" onClick={closeTeamModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeTeamModal}>
              &times;
            </button>
            <div className="modal-image-container">
              <Image
                src={selectedTeam.groupImage}
                alt={selectedTeam.category}
                width={800}
                height={450}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <h2>{selectedTeam.category} Team</h2>
              <p className="modal-role">{selectedTeam.description}</p>
              
              {selectedTeam.members.length > 0 && (
                <div className="modal-members">
                  <h3>Team Members</h3>
                  <div className="modal-members-list">
                    {selectedTeam.members.map((member, index) => (
                      <div key={index} className="modal-member-item">
                        <span className="modal-member-name">{member.name}</span>
                        <span className="modal-member-role">{member.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          position: sticky;
          top: 80px;
          z-index: 100;
          background: rgba(4, 10, 40, 0.9);
          padding: 1rem 0;
          backdrop-filter: blur(10px);
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
          scroll-margin-top: 120px;
        }
        
        .team-category-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
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
        
        .team-category-description {
          text-align: center;
          color: #8a95c9;
          margin-bottom: 2rem;
          font-style: italic;
        }
        
        /* Team Group Card */
        .team-group-card {
          background: linear-gradient(145deg, #0c1338, #070c29);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          border: 1px solid rgba(108, 141, 255, 0.1);
          cursor: pointer;
          margin-bottom: 2rem;
        }
        
        .team-group-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border-color: rgba(108, 141, 255, 0.3);
        }
        
        .team-group-image-container {
          position: relative;
          width: 100%;
          height: 400px;
          overflow: hidden;
        }
        
        .team-group-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .team-group-card:hover .team-group-image {
          transform: scale(1.05);
        }
        
        .team-group-overlay {
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
        
        .team-group-card:hover .team-group-overlay {
          opacity: 1;
        }
        
        .view-details {
          color: #fff;
          font-weight: 500;
          padding: 0.8rem 1.5rem;
          background: rgba(108, 141, 255, 0.8);
          border-radius: 20px;
          font-size: 1.1rem;
        }
        
        /* Team Members List */
        .team-members-list {
          margin-top: 2rem;
        }
        
        .members-list-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #fff;
          text-align: center;
        }
        
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .member-item {
          background: rgba(108, 141, 255, 0.1);
          padding: 1.2rem;
          border-radius: 12px;
          border: 1px solid rgba(108, 141, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .member-item:hover {
          background: rgba(108, 141, 255, 0.2);
          transform: translateY(-3px);
        }
        
        .member-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
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
          max-width: 800px;
          max-height: 90vh;
          background: #0c1338;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-y: auto;
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
          width: 100%;
          margin-bottom: 1.5rem;
        }
        
        .modal-image {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
        
        .modal-info {
          text-align: center;
          width: 100%;
        }
        
        .modal-info h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .modal-role {
          color: #6c8dff;
          font-weight: 500;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .modal-members {
          margin-top: 2rem;
        }
        
        .modal-members h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }
        
        .modal-members-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .modal-member-item {
          background: rgba(108, 141, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          text-align: left;
        }
        
        .modal-member-name {
          display: block;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #fff;
        }
        
        .modal-member-role {
          color: #aab4e8;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .team-group-image-container {
            height: 300px;
          }
          
          .members-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
          
          .modal-content {
            max-width: 90vw;
            padding: 1.5rem;
          }
          
          .category-filters {
            top: 60px;
          }
          
          .modal-members-list {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .team-category-title {
            font-size: 1.5rem;
          }
          
          .filters-container {
            gap: 0.5rem;
          }
          
          .filter-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }
          
          .team-group-image-container {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}