import Image from "next/image";

const teamMembers = [
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
  // ... add rest of team
];

// --- SVG Icons ---
const InstagramIcon = (
  <svg
    className="w-5 h-5"
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
);

const LinkedInIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 
    2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 
    1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

export default function TeamPage() {
  return (
    <div className="bg-[#0a0f2c] min-h-screen text-white">
      {/* --- Heading --- */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold">MEET OUR TEAM</h1>
        <p className="text-gray-400 mt-2">
          Introducing the core members of SCOPE
        </p>
      </section>

      {/* --- Team Grid --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="relative rounded-2xl overflow-hidden shadow-lg group"
          >
            {/* Background Image */}
            <Image
              src={member.image}
              alt={member.name}
              width={400}
              height={400}
              className="object-cover w-full h-80"
            />

            {/* Glassmorphism Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 backdrop-blur-md bg-white/20 text-white rounded-t-2xl">
              <h2 className="text-sm font-semibold">{member.role}</h2>
              <p className="text-lg font-bold">{member.name}</p>

              {/* Social Links */}
              <div className="flex gap-3 mt-2">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}