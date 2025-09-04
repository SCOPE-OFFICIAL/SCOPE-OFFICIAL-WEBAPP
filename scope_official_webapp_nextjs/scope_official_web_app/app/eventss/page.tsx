"use client";
import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";
import { ArrowRight } from "lucide-react"; // ✅ arrow icon

const orbitron = Orbitron({ subsets: ["latin"], weight: "700" });

const events = [
  { title: "Orientation on Matlab", date: "15th Aug 25" },
  { title: "Hackathon", date: "28th Aug 25" },
  { title: "ARM architecture workshop", date: "10th Sept 25" },
  { title: "Empower talk", date: "5th Sept 25" },
  { title: "Current Basics", date: "12th Sept 25" },
];

// Fill up to 7 slots for 3–2–3 honeycomb
const totalHexagons = 7;
const paddedEvents = [
  ...events,
  ...Array(totalHexagons - events.length).fill({
    title: "Coming Soon",
    date: "",
  }),
];

const pastEvents = [
  "/assets/event1.jpg",
  "/assets/event2.jpg",
  "/assets/event3.jpg",
];

export default function Events() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, mins: 0 });

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const swipeThreshold = 50;

  useEffect(() => {
    const targetDate = new Date("2025-09-05T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          mins: Math.floor((distance / (1000 * 60)) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pastEvents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pastEvents.length) % pastEvents.length);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 px-6 bg-[#040A28] text-white relative">
      <h2
        className={`${orbitron.className} text-2xl md:text-3xl font-bold text-center mb-12`}
      >
        UPCOMING EVENTS
      </h2>
      <br></br>
      <br></br>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center justify-center">
        {/* 🔷 Honeycomb Hexagon Layout */}
        <div className="flex flex-col items-center gap-6 -mt-10">
          {/* First Row (3) */}
          <div className="flex justify-center gap-1">
            {paddedEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="relative">
                {/* Border wrapper (kept as-is) */}
                <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                {/* Inner hexagon (main background) */}
                <div
                  className={`hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4
                                     bg-[#1a1c3a] text-white relative m-[2px]`}
                >
                  {/* Overlay hexagon with 5% opacity (only for 1st & 3rd) */}
                  {(index === 0 || index === 2) && (
                    <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                  )}
                  {/* Text & icon above everything */}
                  <div className="flex flex-col items-center relative z-10">
                    {index !== 1 && (
                      <>
                        <p className="font-semibold">{event.title}</p>
                        {event.date && (
                          <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                        )}
                        <a href="https://www.google.com/?zx=1756489883681&no_sw_cr=1">
                          <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second  Row (3) */}
          <div className="flex justify-center gap-1 -mt-12">
            {paddedEvents.slice(0, 2).map((event, index) => (
              <div key={index} className="relative">
                {/* Border wrapper */}
                <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                {/* Inner hexagon */}
                <div
                  className={`hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4
                                     bg-[#1a1c3a] text-white relative m-[2px]`}
                >
                  {/* Overlay hexagon with 5% opacity (for both hexagons here) */}
                  <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                  {/* Text & icon above everything */}
                  <div className="flex flex-col items-center relative z-10">
                    {index === 0 && ( // First hexagon
                      <>
                        <p className="font-semibold">Empower talk</p>
                        <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                        <a href="https://www.google.com/?zx=1756489883681&no_sw_cr=1">
                          <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                        </a>
                      </>
                    )}
                    {index === 1 && ( // Second hexagon
                      <>
                        <p className="font-semibold">Hackathon</p>
                        <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                        <a href="https://www.google.com/?zx=1756489883681&no_sw_cr=1">
                          <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Third Row (3) */}
          <div className="flex justify-center gap-1 -mt-12">
            {paddedEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="relative">
                {/* Border wrapper */}
                <div className="hexagon w-25 h-50 bg-pink-500 absolute inset-0 opacity-35" />
                {/* Inner hexagon */}
                <div
                  className={`hexagon w-40 h-44 flex items-center justify-center text-center text-sm p-4
                                     bg-[#1a1c3a] text-white relative m-[2px]`}
                >
                  {/* Overlay hexagon only for middle hexagon */}
                  {index === 1 && (
                    <div className="hexagon w-full h-full bg-white absolute inset-0 opacity-10" />
                  )}
                  {/* Text & icon above everything */}
                  <div className="flex flex-col items-center relative z-10">
                    {index === 1 && ( // Middle hexagon content
                      <>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-gray-300 text-xs mt-1">{event.date}</p>
                        <a href="https://www.google.com/?zx=1756489883681&no_sw_cr=1">
                          <ArrowRight className="mx-auto mt-2 w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>

        {/* 🔥 Countdown with Neon Circular Glow */}
        <div className="flex flex-col items-center">
          {/* New Outermost Ring */}
        <div className="relative w-[450px] h-[450px]  rounded-full flex items-center justify-center border-[0px] border-[#550231]  shadow-[0_0_80px_30px_#560C4B,inset_0_0_50px_15px_#560C4B] opacity-90 ">
  {/* Your content goes here */}
    {/* Your content goes here */}

            {/* Outermost ring: Dark purple, wider */}
            <div className="absolute w-96 h-96 rounded-full flex items-center justify-center border-2 border-[#560C4B] ">
              {/* Second ring: Slightly lighter purple, with a subtle glow */}
              <div className="absolute w-80 h-80 rounded-full flex items-center justify-center border-4 border-[#39184D] shadow-[0_0_15px_rgba(57,24,77,0.5)]">
                {/* Third ring: Pink/Blue gradient glow effect */}
                <div className="absolute w-72 h-72 rounded-full flex items-center justify-center border-4 border-[#FB4B8C] ring-4 ring-[#0072FF] shadow-[0_0_20px_rgba(251,75,140,0.8),_0_0_20px_rgba(0,114,255,0.8)]">
                  {/* Innermost circle: Container for countdown text */}
                  <div className="relative w-64 h-64 rounded-full flex items-center justify-center bg-transparent">
                    <div className="text-center">
                      <p className="text-[#FB4B8C] text-4xl font-bold">
                        {timeLeft.days.toString().padStart(2, "0")}
                      </p>
                      <p className="text-white text-lg">DAYS</p>
                      <p className="text-[#FB4B8C] text-2xl font-bold mt-2">
                        {timeLeft.mins.toString().padStart(2, "0")}
                      </p>
                      <p className="text-white text-lg">MINS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <p className="mt-4 text-sm text-gray-300 font-orbitron">
            Next event : Hackathon in
          </p>

        </div>
      </div>

      {/* ---------------- PAST EVENTS SECTION ---------------- */}
      {/* (kept intact, unchanged) */}
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
                (index + pastEvents.length - currentIndex) % pastEvents.length;

              const isHovered = hoverIndex === index;
              const isCenter = relativeIndex === 0 && hoverIndex === null;

              let styleClass =
                "absolute transition-all duration-700 ease-in-out rounded-xl shadow-xl object-cover ";

              if (relativeIndex === 0) {
                styleClass +=
                  isHovered || isCenter
                    ? "w-80 h-[420px] z-30 scale-100 opacity-100"
                    : "w-72 h-[400px] z-20 scale-95 opacity-90";
              } else if (relativeIndex === 1) {
                styleClass +=
                  isHovered
                    ? "translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                    : "translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]";
              } else if (relativeIndex === pastEvents.length - 1) {
                styleClass +=
                  isHovered
                    ? "-translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                    : "-translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]";
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

        <a href="https://www.google.com/?zx=1756489883681&no_sw_cr=1"><button className="font-dmSansLink mt-12 bg-[rgb(0,76,148)] hover:bg-[#003E7A] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
          KNOW MORE
        </button></a>
      </section>

      {/* 📡 Antenna Image in Bottom Left */}
      <img
        src="/images/antenna.png"
        alt="Antenna"
        className="absolute bottom-14 left-4 w-75 opacity-90"
      />

      {/* HEXAGON CSS */}
      <style jsx>{`
        .hexagon {
          clip-path: polygon(
            50% 0%,
            93% 25%,
            93% 75%,
            50% 100%,
            7% 75%,
            7% 25%
          );
          transition: all 0.3s ease;
        }
        .hexagon:hover {
          background: #ff007f;
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}