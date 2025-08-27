"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ members: 0, events: 0 }); // Removed projects
  const swipeThreshold = 50;
  const heroRef = useRef(null);

  // Google Form link for Join Us
  const JOIN_US_FORM_URL = "https://docs.google.com/forms/your-form-link-here";

  // Stats counter animation - Updated realistic numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        members: Math.min(prev.members + 3, 50), // Realistic member count
        events: Math.min(prev.events + 1, 6)     // Realistic event count
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Newsletter form submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can add Firebase integration here later
    alert("Thank you for subscribing! We'll keep you updated.");
  };

  return (
    <main className="bg-[#040A28] text-white font-inter">
      {/* ✅ Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 bg-[#004C94] hover:bg-[#006ac4] text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 hover:opacity-100 group"
        aria-label="Back to top"
      >
        ↑
        <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs py-1 px-2 rounded">
          Back to Top
        </span>
      </button>

      {/* ✅ HERO SECTION with aligned text and image */}
      <section ref={heroRef} className="py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-20 relative z-10">
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

            <div className="space-y-2">
              <p className="text-lg text-gray-300 text-left">
                From the tiniest circuits to groundbreaking innovation,
              </p>
              <p className="text-lg text-gray-300 text-left">
                bridging ideas with technology.
              </p>
            </div>

            {/* Stats Counter - Updated with realistic numbers */}
            <div className="grid grid-cols-2 gap-6 mt-8"> {/* Changed to 2 columns */}
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#2C97FF]">
                  {stats.members}+
                </div>
                <div className="text-sm text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#F24DC2]">
                  {stats.events}+
                </div>
                <div className="text-sm text-gray-400">Events Organized</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => scrollToSection('what-we-do')}
                className="px-8 py-3 bg-[#004C94] text-white font-regular rounded-md hover:bg-[#006ac4] transition duration-300 transform hover:scale-105"
              >
                LEARN MORE
              </button>
              <a 
                href={JOIN_US_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 border border-[#004C94] text-white font-regular rounded-md hover:bg-[#004C94] transition duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                JOIN NOW
              </a>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative w-full">
            <Image
              src="/assets/pcb.png"
              alt="PCB Background"
              width={600}
              height={400}
              className="w-full h-auto object-cover opacity-80 mix-blend-lighten"
              priority
            />

            {/* Faint grid lines */}
            <div className="absolute inset-0 bg-grid-lines bg-[length:40px_40px] pointer-events-none z-10" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040A28] via-transparent to-transparent z-20" />
          </div>
        </div>
      </section>

      {/* ✅ WHAT DO WE DO */}
      <section id="what-we-do" className="py-16 px-6 text-center">
        <h3 className="text-3xl font-bold mb-4 font-orbitron">
          WHAT DO WE DO?
        </h3>
        <p className="max-w-2xl mx-auto text-gray-300 font-dm-sans mb-10">
          SCOPE fosters innovation through hands-on training and discussions,
          empowering future electronics leaders.
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {[
            { src: "/assets/technical.jpg", title: "Technical Talks", description: "Expert sessions on emerging technologies" },
            { src: "/assets/workshops.jpg", title: "Workshops", description: "Practical learning sessions for all skill levels" },
            { src: "/assets/projects.jpg", title: "Events", description: "Competitions and networking opportunities" }
          ].map((item, index) => (
            <div key={index} className="w-full md:w-1/4 max-w-xs mx-auto flex flex-col items-center group">
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg mb-4 relative">
                <Image
                  src={item.src}
                  alt={item.title}
                  width={300}
                  height={225}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition duration-300"></div>
              </div>
              <h4 className="text-xl font-dm-sans text-white mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
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
          {/* Event carousel code remains the same */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 text-5xl text-white hover:text-gray-300 px-4"
            aria-label="Previous event"
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
                <Image
                  key={index}
                  src={src}
                  alt={`Event ${index + 1}`}
                  width={320}
                  height={420}
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
            aria-label="Next event"
          >
            ≫
          </button>
          
          <Link href="/eventss">
            <button className="mt-10 px-10 py-3 bg-[#004C94] text-white font-regular rounded-md hover:bg-[#006ac4] transition duration-300 transform hover:scale-105">
              VIEW ALL EVENTS
            </button>
          </Link>
        </div>
      </section>

            {/* ✅ TESTIMONIALS SECTION with real team members */}
      <section className="py-16 px-6 bg-[#0A1430]">
        <h3 className="text-3xl font-bold font-orbitron mb-12 text-center">
          WHAT OUR MEMBERS SAY
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              quote: "SCOPE has been an incredible journey — leading this community has given me lifelong skills.",
              author: "Marisetty Nehasree",
              role: "President",
              image: "/images/neha pick.jpg",
            },
            {
              quote: "Working with such a passionate team inspires me every day to push boundaries.",
              author: "Brunda R",
              role: "Vice President",
              image: "/images/brundha pick.png",
            },
            {
              quote: "Mentoring students here has been one of the most fulfilling experiences of my academic life.",
              author: "Guraman Singh",
              role: "Student Mentor",
              image: "/images/guraman singh pick.jpg",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm text-center">
              <div className="flex justify-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-4"
                />
              </div>
              <p className="text-gray-300 mb-4 italic">“{testimonial.quote}”</p>
              <div>
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ✅ JOIN US SECTION with Google Form link */}
      <section className="bg-[#040A28] py-40 px-6">
        <div className="relative max-w-6xl mx-auto bg-white/3 border border-white/10 rounded-2xl py-10 px-20 backdrop-blur-3xl overflow-hidden flex items-center justify-between">
          {/* Glow Spots */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#76101E] rounded-full blur-xl opacity-70" />
          <div className="absolute top-0 right-20 w-20 h-20 bg-[#00058C] rounded-full blur-xl opacity-30" />
          <div className="absolute -bottom-10 left-5 w-20 h-20 bg-[#444AE4] rounded-full blur-xl opacity-40" />
          <div className="absolute -bottom-10 right-5 w-20 h-20 bg-[#76101E] rounded-full blur-xl opacity-40" />
          
          {/* Text */}
          <div className="z-10 text-left text-white max-w-2xl">
            <p className="text-xl">
              Turn your ideas into reality! Join our club and start creating!
            </p>
          </div>

          {/* Button linking to Google Form */}
          <div className="z-10">
            <a 
              href={JOIN_US_FORM_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#76101E] text-white font-semibold rounded-full hover:bg-[#00058C] transition transform hover:scale-105 inline-block"
            >
              Join Us
            </a>
          </div>
        </div>
      </section>

      {/* ✅ NEWSLETTER SIGNUP - Simple implementation for now */}
      <section className="py-16 px-6 bg-[#0A1430]">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6">Get the latest news about events, workshops, and activities</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#004C94] w-64"
              required
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-[#004C94] text-white rounded-md hover:bg-[#006ac4] transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">
            We'll email you about upcoming events - no spam, just updates!
          </p>
        </div>
      </section>

      {/* ✅ OUR PARTNERS (Animated Scroll) */}
      <section className="py-16 px-6 text-center overflow-hidden">
        <h3 className="text-3xl mb-20">Our Partners</h3>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 animate-marquee w-max">
            {[1, 2, 3, 4, 5, 6, 7].map((n, idx) => (
              <Image
                key={`partner-${idx}`}
                src={`/assets/partner${n}.png`}
                alt={`Partner ${n}`}
                width={120}
                height={60}
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
            {/* Duplicate for seamless loop */}
            {[1, 2, 3, 4, 5, 6, 7].map((n, idx) => (
              <Image
                key={`partner-dup-${idx}`}
                src={`/assets/partner${n}.png`}
                alt={`Partner ${n}`}
                width={120}
                height={60}
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}