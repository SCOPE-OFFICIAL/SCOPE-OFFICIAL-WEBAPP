"use client";

import React, { useEffect, useState } from "react";

export default function HomePage() {
  const pastEvents = [
    "/images/past-event-1.jpg",
    "/images/past-event-2-matlab.jpg",
    "/images/past-event-3-tech.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeThreshold = 50;

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const orbitronLink = document.createElement("link");
    orbitronLink.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
    orbitronLink.rel = "stylesheet";
    document.head.appendChild(orbitronLink);

    const dmSansLink = document.createElement("link");
    dmSansLink.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap";
    dmSansLink.rel = "stylesheet";
    document.head.appendChild(dmSansLink);

    return () => {
      document.head.removeChild(orbitronLink);
      document.head.removeChild(dmSansLink);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#040A28] text-gray-200 font-sans relative overflow-hidden">
      {/* Main Content Area */}
      <main className="container mx-auto px-8 py-16 lg:py-24">
        {/* Upcoming Events Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-24">
          <div className="lg:w-1/2 pr-8 mb-12 lg:mb-0">
            <h2 className="font-orbitron text-5xl font-bold text-white mb-12 lg:mb-20">
              UPCOMING EVENTS
            </h2>
            <div className="font-dm-sans text-xl">
              <p className="leading-relaxed mb-6">
                SCOPE at Reva University is hosting a IEEE Lab Orientation for
                2nd-semester ECE students. This session covers key concepts, lab
                equipment, safety, and hands-on experiments, guided by expert
                mentors to build a strong foundation in electronics.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">
                Key Ambitions
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-10">
                <li>Lab instruments: intro to essential equipment</li>
                <li>Basic circuits: hands-on experience</li>
                <li>Safety practices: key guidelines</li>
                <li>Practical skills: experiment confidently</li>
              </ul>
            </div>
            <button className="font-dmSansLink bg-[rgb(0,76,148)] hover:bg-[#003E7A] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
              REGISTER NOW
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src="/images/upcoming-event-poster.jpg"
              alt="Upcoming Event Poster: Current Basics"
              className="rounded-lg shadow-xl max-w-full h-[619px] w-[437.42px]"
            />
          </div>
        </section>

        {/* Past Events Section */}
        <section className="text-center mb-32 relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-[#EC4DC2] via-[#0072FF] to-[#040A28] my-16"></div>
          <h2 className="font-orbitron text-4xl font-bold text-white mb-12">
            PAST EVENTS
          </h2>

          <div className="relative w-full max-w-6xl mx-auto">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
            >
              ≪
            </button>

            <div
              className="flex justify-center items-center relative h-[420px] overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (diff > swipeThreshold) handleNext();
                else if (diff < -swipeThreshold) handlePrev();
              }}
              onMouseDown={(e) => setTouchStartX(e.clientX)}
              onMouseUp={(e) => {
                const diff = touchStartX - e.clientX;
                if (diff > swipeThreshold) handleNext();
                else if (diff < -swipeThreshold) handlePrev();
              }}
            >
              {pastEvents.map((src, index) => {
                const relativeIndex =
                  (index + pastEvents.length - currentIndex) %
                  pastEvents.length;

                const isHovered = hoverIndex === index;
                const isCenter = relativeIndex === 0 && hoverIndex === null;

                let styleClass =
                  "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover ";

                if (relativeIndex === 0) {
                  styleClass +=
                    (isHovered || isCenter
                      ? "w-80 h-[420px] z-30 scale-100 opacity-100"
                      : "w-72 h-[400px] z-20 scale-95 opacity-90");
                } else if (relativeIndex === 1) {
                  styleClass +=
                    (isHovered
                      ? "translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                      : "translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass +=
                    (isHovered
                      ? "-translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                      : "-translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]");
                } else {
                  styleClass += "opacity-0 pointer-events-none";
                }

                return (
                  <img
                    key={index}
                    src={src}
                    alt={`Past Event ${index + 1}`}
                    className={styleClass}
                    draggable={false}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleImageClick(index)}
                  />
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
            >
              ≫
            </button>
          </div>

          <button className="font-dmSansLink mt-12 bg-[rgb(0,76,148)] hover:bg-[#003E7A] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
            KNOW MORE
          </button>
        </section>
      </main>

      {/* Decorative Bottom-Right Circuit Image */}
      <img
        src="/images/circuit-deco.png"
        alt="Circuit Decoration"
        className="absolute bottom-0 right-0 w-64 opacity-60 pointer-events-none z-0"
      />
    </div>
  ); 
}

// This is Team Zero testing
/* This code is part of the SCOPE official web app built with Next.js.

// This is Team Zero
/* This code is part of the SCOPE official web app built with Next.js.*/

