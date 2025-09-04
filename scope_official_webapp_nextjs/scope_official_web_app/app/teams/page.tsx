"use client";
import Image from "next/image";
import { Orbitron, DM_Sans } from "next/font/google";
import { useRef, useState, useEffect } from "react";

// Load fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

const teamMembers = [
  // --- Faculty Co-Ordinators ---
  {
    role: "DIRECTOR",
    name: "Dr K M Sudharshan",
    image: "/images/sudharshan sir.png",
    instagram: "#",
    linkedin: "#",
  },
  {
    role: "VERTICAL HEAD",
    name: "Dr Rashmi Priyadarshini B K",
    image: "/images/rashmi mam.png",
    instagram: "#",
    linkedin: "#",
  },
  {
    role: "FACULTY CO-ORDINATOR",
    name: "Prof. Dilip Chandra E",
    image: "/images/dileep sir.png",
    instagram: "#",
    linkedin: "#",
  },

  // --- The Craftsman ---
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
    image: "/images/brundha.png",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham.png",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },

  // --- Team Leads ---
  {
    role: "EVENT MANAGEMENT",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Ananya Y", "Joel Jo", "Imdad", "Nandish"],
  },
  {
    role: "DESIGN",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Srijan", "Sanya"],
  },
  {
    role: "CONTENT",
    name: "Rayyan Ahamed",
    image: "/images/rayyan.png",
    instagram: "#",
    linkedin: "#",
    members: ["Sruthi Subhash", "Nidhish"],
  },
  {
    role: "PR",
    name: "Dhanyashree Karnam",
    image: "/images/dhanya pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Diya", "Kavya"],
  },
  {
    role: "MARKETING",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Ram", "Divya"],
  },
  {
    role: "TECHNICAL",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Abhinav", "Nikita", "Surya"],
  },
  {
    role: "STUDENT COORDINATOR",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg",
    instagram: "#",
    linkedin: "#",
    members: ["Vaibhav S J", "Arpana", "Gagana"],
  },
];

// --- Teams Section Data ---
const teams = [
  { name: "Event Management Team", image: "/images/Team event management.png" },
  { name: "Content & Design Team", image: "/images/Team content and design.png" },
  { name: "Student Co-Ordinater Team", image: "/images/Team student coordinator.png" },
  { name: "Technical Team", image: "/images/technical team.png" },
  { name: "PR & Marketing Team", image: "/images/pr team.png" },
];

// --- SVG Icons ---
const InstagramIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 
    2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 
    1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

export default function TeamPage() {
  const scrollLeaderRef = useRef<HTMLDivElement>(null);
  const scrollLeadRef = useRef<HTMLDivElement>(null);
  const scrollTeamsRef = useRef<HTMLDivElement>(null);
  const [activeTeam, setActiveTeam] = useState<number | null>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const { clientWidth } = ref.current;
      ref.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  // ✅ Auto-center hovered team
  useEffect(() => {
    if (activeTeam !== null && scrollTeamsRef.current) {
      const container = scrollTeamsRef.current;
      const child = container.children[activeTeam] as HTMLElement;
      if (child) {
        const offset = child.offsetLeft - container.clientWidth / 2 + child.clientWidth / 2;
        container.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [activeTeam]);

  return (
    <div className="bg-[#040A28] min-h-screen text-white overflow-x-hidden">
      {/* --- Heading --- */}
      <section className="py-16 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    
    {/* Left side: Text */}
    <div className="text-left">
     <h1 className={`${orbitron.className} text-6xl font-regular`}>
  MEET
</h1>

<h1 className={`${orbitron.className} text-6xl font-regular mt-4`}>
  OUR TEAM
</h1>
      <br></br>
      <br></br>
      <p className="text-gray-400 mt-2">
        Introducing the core members of SCOPE
      </p>
    </div>

    {/* Right side: Image */}
  <div className="w-96 h-96 md:w-150 md:h-150 relative flex-shrink-0 ">
  <Image
    src="/images/team_page.png" // 👈 replace with your actual image path
    alt="Team Logo"
    fill
    className="object-contain rounded-xl opacity-80"
  />
</div>
  </div>
</section>

      <div className="max-w-6xl mx-auto px-6">
        {/* --- Top 3 Members (Craftsman) --- */}
        <h2 className={`${orbitron.className} text-2xl font-semibold mb-6 text-center`}>FACULTY CO-ORDINATORS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {teamMembers.slice(0, 3).map((member, index) => (
            <Card key={index} member={member} big />
          ))}
        </div>

        {/* --- Our Leaders --- */}
        <SectionWithScroll title="THE CRAFTSMAN" members={teamMembers.slice(3, 9)} scrollRef={scrollLeaderRef} scroll={scroll} />

        {/* --- Team Leads --- */}
        <SectionWithScroll title="TEAM LEADS" members={teamMembers.slice(9)} scrollRef={scrollLeadRef} scroll={scroll} withDropdown />

        {/* --- TEAMS --- */}
        <h2 className={`${orbitron.className} text-2xl font-semibold mb-6 text-center`}>TEAMS</h2>
        <div className="relative mb-16 overflow-hidden">
          <div
            ref={scrollTeamsRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth justify-start px-12"
          >
            {teams.map((team, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveTeam(index)}
                onMouseLeave={() => setActiveTeam(null)}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden flex-shrink-0 min-w-[320px] snap-start transform transition duration-500 origin-center
                  ${
                    activeTeam === index
                      ? "scale-124 z-40 relative"
                      : activeTeam !== null
                      ? "scale-90 opacity-60"
                      : "scale-100"
                  }`}
              >
                {/* ✅ 1080p quality images */}
                <Image
                  src={team.image}
                  alt={team.name}
                  width={1920}
                  height={1080}
                  quality={100}
                  className="object-cover w-full h-[400px] md:h-[500px]"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 backdrop-blur-md bg-white/20 text-white text-center">
                  <h3 className="text-lg font-extrabold">{team.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scroll(scrollTeamsRef, "left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40"
          >
            <span className="text-xl">‹</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(scrollTeamsRef, "right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40"
          >
            <span className="text-xl">›</span>
          </button>
        </div>
      </div>

      {/* ✅ Global CSS to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ✅ Card Component
type CardProps = {
  member: any;
  big?: boolean;
  withDropdown?: boolean;
};

function Card({ member, big = false, withDropdown = false }: CardProps) {
  return (
    <div className={`group flex flex-col items-center ${big ? "w-full" : "min-w-[250px] snap-start"}`}>
      {/* --- Main Card --- */}
      <div
        className={`relative rounded-2xl overflow-hidden shadow-lg ${
          withDropdown ? "transform transition duration-300 hover:scale-105 hover:shadow-xl" : ""
        }`}
      >
        <Image
          src={member.image}
          alt={member.name}
          width={300}
          height={350}
          className={`object-cover ${big ? "w-full h-[320px]" : "w-[250px] h-[320px]"}`}
        />

        {/* Always visible name + socials */}
        <div className="absolute bottom-0 left-0 w-full p-3 backdrop-blur-md bg-white/20 text-white rounded-t-2xl z-20">
          <h2 className="text-xs tracking-wide uppercase font-semibold">{member.role}</h2>
          <p className="text-lg font-semibold">{member.name}</p>
          <div className="flex gap-3 mt-1">
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
              {InstagramIcon}
            </a>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              {LinkedInIcon}
            </a>
          </div>
        </div>
      </div>

      {/* --- Dropdown below card --- */}
      {withDropdown && member.members && (
        <div className="w-full bg-[#1a1f4b] text-sm text-gray-200 max-h-0 overflow-hidden group-hover:max-h-72 group-hover:py-3 transition-all duration-500 ease-in-out rounded-b-2xl shadow-lg mt-2 overflow-y-auto">
          <h4 className="font-semibold mb-1 px-3">Team Members:</h4>
          <ul className="list-disc list-inside space-y-1 px-5">
            {member.members.map((m: string, i: number) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ✅ Section with Scroll
type SectionProps = {
  title: string;
  members: any[];
  scrollRef: any;
  scroll: any;
  withDropdown?: boolean;
};

function SectionWithScroll({ title, members, scrollRef, scroll, withDropdown = false }: SectionProps) {
  return (
    <>
      <h2 className={`${orbitron.className} text-2xl font-semibold mb-6 text-center`}>{title}</h2>
      <div className="relative mb-12 overflow-hidden">
        <div ref={scrollRef} className="flex gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth">
          {members.map((member, index) => (
            <Card key={index} member={member} withDropdown={withDropdown} />
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => scroll(scrollRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40"
        >
          <span className="text-xl">‹</span>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(scrollRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40"
        >
          <span className="text-xl">›</span>
        </button>
      </div>
    </>
  );
}
