"use client";

import Image from "next/image";
import { useState } from "react";

// Event data with images and descriptions
const events = [
  {
    id: 1,
    title: "MATLAB Orientation",
    description: "Unlock MATLAB to Learn, Analyze and Innovate",
    category: "workshop",
    images: [
      "/images/matlab1.png",
      "/images/matlab2.png",
      "/images/matlab3.png"
    ],
    date: "2024-02-15"
  },
  {
    id: 2,
    title: "Empower'25",
    description: "Leadership, Innovation, and Opportunities",
    category: "conference",
    images: [
      "/images/empower1.png",
      "/images/empower2.png",
      "/images/empower3.png"
    ],
    date: "2025-01-20"
  },
  {
    id: 3,
    title: "SCOPE Inauguration",
    description: "Welcome to the inauguration of SCOPE",
    category: "event",
    images: [
      "/images/inauguration1.png",
      "/images/inauguration2.png",
      "/images/inauguration3.png"
    ],
    date: "2024-08-10"
  },
  {
    id: 4,
    title: "Workshop on Fundamentals of Electrical and Electronics",
    description: "Hands-on learning experience in electrical and electronics fundamentals",
    category: "workshop",
    images: [
      "/images/workshop1.png",
      "/images/workshop2.png",
      "/images/workshop3.png"
    ],
    date: "2024-05-12"
  }
];

// Categories for filtering
const categories = ["all", "workshop", "conference", "event"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const openLightbox = (event, imageIndex = 0) => {
    setSelectedEvent(event);
    setCurrentImageIndex(imageIndex);
  };

  const closeLightbox = () => {
    setSelectedEvent(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!selectedEvent) return;
    
    if (direction === "prev") {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="gallery-page-container">
      {/* Header Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <h1 className="hero-title">SCOPE Gallery</h1>
          <p className="hero-subtitle">
            Explore the exciting events and workshops conducted by SCOPE
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
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-grid-section">
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <Image
                  src={event.images[0]}
                  alt={event.title}
                  width={400}
                  height={300}
                  className="event-image"
                  onClick={() => openLightbox(event, 0)}
                />
                <div className="event-overlay">
                  <button 
                    className="view-gallery-btn"
                    onClick={() => openLightbox(event, 0)}
                  >
                    View Gallery
                  </button>
                </div>
              </div>
              <div className="event-info">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                  <span className="event-category">{event.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedEvent && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              &times;
            </button>
            
            <div className="lightbox-image-container">
              <Image
                src={selectedEvent.images[currentImageIndex]}
                alt={selectedEvent.title}
                width={800}
                height={600}
                className="lightbox-image"
              />
              
              <button 
                className="lightbox-nav lightbox-prev"
                onClick={() => navigateImage("prev")}
              >
                &#8249;
              </button>
              
              <button 
                className="lightbox-nav lightbox-next"
                onClick={() => navigateImage("next")}
              >
                &#8250;
              </button>
            </div>
            
            <div className="lightbox-info">
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.description}</p>
              <div className="image-counter">
                {currentImageIndex + 1} / {selectedEvent.images.length}
              </div>
            </div>
            
            <div className="lightbox-thumbnails">
              {selectedEvent.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={60}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #040A28 0%, #0a1039 100%);
          color: #fff;
          padding: 2rem 1rem;
        }
        
        .gallery-hero {
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
          
          color: #fff; /* ✅ pure white */
          text-shadow: 0 4px 20px rgba(108, 141, 255, 0.3);
        }
        

        .hero-subtitle {
          font-size: 1.2rem;
          color: #aab4e8;
          max-width: 600px;
          margin: 0 auto;
        }
        
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
        
        .events-grid-section {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .event-card {
          background: linear-gradient(145deg, #0c1338, #070c29);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          border: 1px solid rgba(108, 141, 255, 0.1);
        }
        
        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border-color: rgba(108, 141, 255, 0.3);
        }
        
        .event-image-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          cursor: pointer;
        }
        
        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .event-card:hover .event-image {
          transform: scale(1.05);
        }
        
        .event-overlay {
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
        
        .event-card:hover .event-overlay {
          opacity: 1;
        }
        
        .view-gallery-btn {
          padding: 0.8rem 1.5rem;
          background: #6c8dff;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .view-gallery-btn:hover {
          background: #5a7dff;
          transform: scale(1.05);
        }
        
        .event-info {
          padding: 1.5rem;
        }
        
        .event-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .event-description {
          color: #aab4e8;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .event-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .event-date {
          color: #8a95c9;
          font-size: 0.9rem;
        }
        
        .event-category {
          background: rgba(108, 141, 255, 0.2);
          color: #6c8dff;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        /* Lightbox Styles */
        .lightbox-overlay {
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
        
        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: #0c1338;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-close {
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
        
        .lightbox-image-container {
          position: relative;
          width: 100%;
          height: 70vh;
        }
        
        .lightbox-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lightbox-prev {
          left: 1rem;
        }
        
        .lightbox-next {
          right: 1rem;
        }
        
        .lightbox-info {
          padding: 1.5rem;
          text-align: center;
        }
        
        .lightbox-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .lightbox-info p {
          color: #aab4e8;
          margin-bottom: 1rem;
        }
        
        .image-counter {
          color: #8a95c9;
          font-size: 0.9rem;
        }
        
        .lightbox-thumbnails {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(13, 18, 41, 0.6);
          overflow-x: auto;
        }
        
        .thumbnail {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.3s ease;
          flex-shrink: 0;
        }
        
        .thumbnail:hover, .thumbnail.active {
          opacity: 1;
          border: 2px solid #6c8dff;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .events-grid {
            grid-template-columns: 1fr;
          }
          
          .lightbox-content {
            max-width: 95vw;
            max-height: 95vh;
          }
          
          .lightbox-image-container {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}