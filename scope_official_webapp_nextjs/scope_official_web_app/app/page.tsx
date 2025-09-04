"use client";
import { useState, useEffect } from "react";

const metadata = {
  title: "SCOPE Club",
  description: "Wired for Innovation, Powered by Passion",
};

export default function Home() {
  const eventImages = [
    "/assets/event1.jpg",
    "/assets/event2.jpg",
    "/assets/event3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const swipeThreshold = 50;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? eventImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === eventImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#040A28] text-white font-inter">
      {/* ✅ HERO SECTION with aligned text and image */}
      <section className="pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-20">
          {/* Left: Hero Text */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-4xl md:text-6xl mb-6 text-left leading-tight font-dmsans">
              <span className="block whitespace-nowrap">
                Wired for{" "}
                <span className="font-orbitron font-semibold bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-transparent bg-clip-text">
                  INNOVATION,
                </span>
              </span>
              <span className="block whitespace-nowrap">
                Powered by{" "}
                <span className="font-orbitron font-semibold bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-transparent bg-clip-text">
                  PASSION
                </span>
              </span>
            </h2>

            {/* ✅ Wrap p + button in a div */}
            <div className="space-y-2">
              <p className="text-lg text-gray-300 text-left">
                From the tiniest circuits to groundbreaking innovation,
              </p>
              <p className="text-lg text-gray-300 text-left">
                bridging ideas with technology.
              </p>
            </div>

            {/* ✅ Learn More Button */}
            <a href="/aboutus">
              <button className="mt-6 px-10 py-3 bg-[#004C94] text-white font-regular rounded-md hover:bg-[#006ac4] transition duration-300">
                LEARN MORE
              </button>
            </a>
          </div>

          {/* Right: Hero Image */}
          <div className="relative w-full">
            <img
              src="/assets/pcb.png"
              alt="PCB Background"
              className="w-full h-auto object-cover opacity-90 mix-blend-lighten"
            />

            {/* Faint grid lines */}
            <div className="absolute inset-0 bg-grid-lines bg-[length:40px_40px] pointer-events-none z-10" />

            {/* Optional gradient overlay to blend better */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040A28] via-transparent to-transparent z-20" />
          </div>
        </div>
      </section>

     {/* ✅ FUELING THE FUTURE OF ELECTRONICS */}
<section className="py-16 -mt-10">
  <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-20">
    {/* Left: Image */}
    <div className="md:w-1/2 w-full flex justify-center">
      {/* ✅ Hexagon Image */}
      <div className="relative flex flex-col items-center">
        {/* ✅ Hexagon */}
        <img
          src="/assets/hex-design.png"
          alt="Hexagonal electronics design"
          className="w-full max-w-lg md:max-w-xl object-contain animate-float animate-spin-slow relative z-10"
        />
        <br />
        <br />

        {/* ✅ Ring as glow base */}
        <img
          src="/assets/hex_ring.jpg"
          alt="Hexagonal glowing ring"
          className="absolute bottom-[-50px] w-[85%] object-contain mix-blend-screen opacity-100 translate-x-5"
        />
      </div>
    </div>

    {/* Right: Text and buttons */}
    <div className="md:w-1/2 w-full text-center md:text-left">
      <h2 className="text-4xl md:text-5xl font-regulur font-dm-sans mb-4">
        Fueling the <br />
        <span className="font-DMSans font-bold">
          <span className="text-[#DF9E65]">future</span>{" "}
          <span className="text-white font-dm-sans font-normal">
            of electronics.
          </span>
        </span>
      </h2>

      <p className="text-lg text-gray-300 mb-8 max-w-md md:max-w-none mx-auto md:mx-0">
        SCOPE fosters innovation through hands-on training and discussions.
      </p>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
        <div className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 space-x-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:translate-y-[-5px]">
          <img src="/assets/tech-talk-icon.png" alt="Tech talks icon" className="w-10 h-10" />
          <span className="text-white">Tech talks</span>
        </div>

        <div className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 space-x-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:translate-y-[-5px]">
          <img src="/assets/projects-icon.png" alt="Projects icon" className="w-10 h-10" />
          <span className="text-white">Projects</span>
        </div>

        <div className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 space-x-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:translate-y-[-5px]">
          <img src="/assets/workshops-icon.png" alt="Workshops icon" className="w-10 h-10" />
          <span className="text-white">Workshops</span>
        </div>

        <div className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 space-x-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:translate-y-[-5px]">
          <img src="/assets/competitions-icon.png" alt="Competitions icon" className="w-10 h-10" />
          <span className="text-white">Competitions</span>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* ✅ UPCOMING EVENTS */}
      <section className="py-16 px-6 text-center" id="events">
        <h3 className="text-3xl font-bold font-orbitron mb-6">
          UPCOMING EVENTS
        </h3>
        <p className="text-gray-300 mb-10 max-w-xl mx-auto font-dm-sans">
          Learn, innovate, and compete in our hands-on sessions. Stay tuned for
          updates!
        </p>

        <div className="relative w-full max-w-6xl mx-auto">
          <button
            onClick={prevSlide}
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
              if (diff > swipeThreshold) nextSlide();
              else if (diff < -swipeThreshold) prevSlide();
            }}
            onMouseDown={(e) => setTouchStartX(e.clientX)}
            onMouseUp={(e) => {
              const diff = touchStartX - e.clientX;
              if (diff > swipeThreshold) nextSlide();
              else if (diff < -swipeThreshold) prevSlide();
            }}
          >
            {eventImages.map((src, index) => {
              const relativeIndex =
                (index + eventImages.length - currentIndex) %
                eventImages.length;
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
                styleClass += isHovered
                  ? "translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                  : "translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]";
              } else if (relativeIndex === eventImages.length - 1) {
                styleClass += isHovered
                  ? "-translate-x-[190px] scale-100 z-30 opacity-100 w-80 h-[420px]"
                  : "-translate-x-[190px] scale-90 z-10 opacity-60 w-72 h-[400px]";
              } else {
                styleClass += "opacity-0 pointer-events-none";
              }

              return (
                <img
                  key={index}
                  src={src}
                  alt={`Event ${index + 1}`}
                  className={styleClass}
                  draggable={false}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
          >
            ≫
          </button>
          {/* ✅ Learn More Button */}
          <a href="/eventss">
            <button className="mt-10 px-10 py-3 bg-[#004C94] text-white font-regular rounded-md hover:bg-[#006ac4] transition duration-300">
              LEARN MORE
            </button>
          </a>
        </div>
      </section>

      {/* ✅ JOIN US */}
      <section className="bg-[#040A28] py-40 px-6">
        <div className="relative max-w-6xl mx-auto bg-white/3 border border-white/10 rounded-2xl py-10 px-20 backdrop-blur-3xl overflow-hidden flex items-center justify-between">
          {/* Glow Spots */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#76101E] rounded-full blur-xl opacity-70" />
          <div className="absolute top-0 right-20 w-20 h-20 bg-[#00058C] rounded-full blur-xl opacity-30" />
          <div className="absolute -bottom-10 left-5 w-20 h-20 bg-[#444AE4] rounded-full blur-xl opacity-40" />
          <div className="absolute -bottom-10 right-5 w-20 h-20 bg-[#76101E] rounded-full blur-xl opacity-40" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#00058C] rounded-full blur-xl opacity-40" />
          <div className="absolute -top-10 left-1/3 -translate-x-1/2 w-20 h-20 bg-[#444AE4] rounded-full blur-xl opacity-40" />
          <div className="absolute -top-10 right-1/4 -translate-x-1/2 w-20 h-20 bg-[#76101E] rounded-full blur-xl opacity-40" />
          {/* Text */}
          <div className="z-10 text-left text-white max-w-2xl">
            <p className="text-xl">
              Turn your ideas into reality! Join our club and start creating!
            </p>
          </div>

          {/* Button */}
          <div className="z-10">
           <a href="https://forms.gle/u8199gt9FwKentwGA"> <button className="px-8 py-3 bg-[#76101E] text-white font-semibold rounded-full hover:bg-[#00058C] transition">
              Join Us
            </button></a>
          </div>
        </div>
      </section>

      {/* ✅ OUR PARTNERS (Animated Scroll) */}
      <section className="py-16 px-6 text-center overflow-hidden">
        <h3 className="text-3xl mb-20">Our Partners</h3>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 animate-marquee w-max">
            {[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7].map((n, idx) => (
              <img
                key={`partner-${idx}`}
                src={`/assets/partner${n}.png`}
                alt={`Partner ${n}`}
                className="h-16"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
