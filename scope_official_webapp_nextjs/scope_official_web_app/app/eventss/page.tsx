"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const pastEvents = [
    {
      image: "/images/past-event-1.jpg",
      title: "MATLAB Orientation Workshop",
      description:
        "An intensive workshop introducing MATLAB fundamentals for signal processing and data analysis. Participants learned practical applications through hands-on exercises and real-world examples.",
      date: "February 15, 2024",
      attendees: "120+ students",
    },
    {
      image: "/images/past-event-2-matlab.jpg",
      title: "Empower'25 Leadership Conference",
      description:
        "A leadership development conference featuring industry experts discussing innovation, career opportunities, and personal growth strategies for engineering students.",
      date: "January 20, 2025",
      attendees: "200+ participants",
    },
    {
      image: "/images/past-event-3-tech.jpg",
      title: "PCB Design Masterclass",
      description:
        "Hands-on workshop covering PCB design fundamentals, schematic capture, layout design, and manufacturing processes using industry-standard tools.",
      date: "March 10, 2024",
      attendees: "85+ engineering students",
    },
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
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap";
    dmSansLink.rel = "stylesheet";
    document.head.appendChild(dmSansLink);

    return () => {
      document.head.removeChild(orbitronLink);
      document.head.removeChild(dmSansLink);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#040A28] text-gray-200 font-sans relative overflow-hidden">
      <main className="container mx-auto px-4 sm:px-8 py-12 lg:py-20">
        {/* Upcoming Events Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-20 lg:mb-24">
          <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
            <h2 className="font-orbitron text-4xl sm:text-5xl font-bold text-white mb-8 lg:mb-16">
              UPCOMING EVENTS
            </h2>
            <div className="font-dm-sans text-lg sm:text-xl">
              <p className="leading-relaxed mb-6">
                SCOPE at Reva University is hosting an IEEE Lab Orientation for
                2nd-semester ECE students. This comprehensive session covers
                essential concepts, lab equipment, safety protocols, and
                hands-on experiments, guided by expert mentors to build a strong
                foundation in electronics.
              </p>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                Key Learning Objectives
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-8">
                <li>Introduction to essential lab instruments and equipment</li>
                <li>
                  Hands-on experience with basic circuit design and
                  implementation
                </li>
                <li>Safety practices and laboratory protocols</li>
                <li>Developing practical skills for confident experimentation</li>
                <li>Networking with peers and industry professionals</li>
              </ul>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="/images/upcoming-event-poster.jpg"
                alt="Upcoming Event Poster: IEEE Lab Orientation"
                className="rounded-xl shadow-2xl max-w-full h-auto w-full max-w-md border-2 border-blue-500/20"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-dm-sans font-bold text-sm">
                Coming Soon
              </div>
            </div>
          </div>
        </section>

        {/* Past Events Section */}
        <section className="text-center mb-24 relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0072FF] to-transparent my-16"></div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-12">
            PAST EVENTS GALLERY
          </h2>

          {/* Carousel */}
          <div className="relative w-full max-w-6xl mx-auto mb-12">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-4xl sm:text-5xl text-white hover:text-blue-300 px-2 sm:px-4 transition-all duration-300"
              aria-label="Previous event"
            >
              ‹
            </button>

            <div
              className="flex justify-center items-center relative h-[400px] sm:h-[450px] overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
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
              {pastEvents.map((event, index) => {
                const relativeIndex =
                  (index + pastEvents.length - currentIndex) %
                  pastEvents.length;

                const isHovered = hoverIndex === index;
                const isCenter = relativeIndex === 0 && hoverIndex === null;

                let styleClass =
                  "absolute transition-all duration-500 ease-in-out rounded-xl shadow-xl object-cover ";

                if (relativeIndex === 0) {
                  styleClass +=
                    "w-72 sm:w-80 h-[380px] sm:h-[420px] z-30 scale-100 opacity-100";
                } else if (relativeIndex === 1) {
                  styleClass +=
                    "translate-x-[170px] sm:translate-x-[190px] scale-90 z-10 opacity-70 w-64 sm:w-72 h-[360px]";
                } else if (relativeIndex === pastEvents.length - 1) {
                  styleClass +=
                    "-translate-x-[170px] sm:-translate-x-[190px] scale-90 z-10 opacity-70 w-64 sm:w-72 h-[360px]";
                } else {
                  styleClass += "opacity-0 pointer-events-none";
                }

                return (
                  <div
                    key={index}
                    className={styleClass}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-xl"
                      draggable={false}
                    />
                    {(isHovered || isCenter) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 rounded-b-xl">
                        <h3 className="font-dm-sans font-bold text-white text-sm sm:text-base mb-1">
                          {event.title}
                        </h3>
                        <p className="font-dm-sans text-xs text-gray-300">
                          {event.date} • {event.attendees}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-4xl sm:text-5xl text-white hover:text-blue-300 px-2 sm:px-4 transition-all duration-300"
              aria-label="Next event"
            >
              ›
            </button>
          </div>

          {/* Event Description */}
          <div className="max-w-4xl mx-auto mb-10 p-6 bg-blue-900/20 rounded-xl border border-blue-700/30">
            <h3 className="font-orbitron text-2xl text-white mb-4">
              {pastEvents[currentIndex].title}
            </h3>
            <p className="font-dm-sans text-lg text-gray-300 mb-4">
              {pastEvents[currentIndex].description}
            </p>
            <div className="flex justify-between items-center text-sm text-blue-300">
              <span>{pastEvents[currentIndex].date}</span>
              <span>{pastEvents[currentIndex].attendees}</span>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-3 mb-8">
            {pastEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-500 scale-110"
                    : "bg-blue-900 hover:bg-blue-700"
                }`}
                aria-label={`View event ${index + 1}`}
              />
            ))}
          </div>

          {/* Gallery Link */}
          <Link href="/gallery">
            <button className="mt-10 px-10 py-3 bg-[#004C94] text-white rounded-md hover:bg-[#006ac4] transition duration-300 transform hover:scale-105">
              VIEW EVENT GALLERY
            </button>
          </Link>
        </section>
      </main>

      {/* Decorative Bottom-Right Circuit Image */}
      <img
        src="/images/circuit-deco.png"
        alt="Circuit Decoration"
        className="absolute bottom-0 right-0 w-48 sm:w-64 opacity-40 pointer-events-none z-0"
      />

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
