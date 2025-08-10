import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      {/* --- Header Section --- */}
      <header className="header">
        <div className="logo-container">
          <Image
            src="/images/scope logo.png"
            alt="SCOPE Logo"
            width={50}
            height={50}
          />
          <span className="logo-text">SCOPE</span>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about-us">About Us</a>
          <a href="/team">Team</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>

      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="footer">
        <p className="connect-text">Connect with us</p>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {InstagramIcon}
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            {XIcon}
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LinkedInIcon}
          </a>
        </div>
      </footer>
    </div>
  );
}
import Image from "next/image"; // Import Next.js Image component for optimized images

// --- Data for Team Members ---
const teamMembers = [
  {
    role: "PRESIDENT",
    name: "Marisetty Nehasree",
    image: "/images/neha pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/", // Replace with actual link
    linkedin: "http://www.linkedin.com/in/marisettynehasree", // Replace with actual link
  },
  {
    role: "VICE PRESIDENT",
    name: "Brunda R",
    image: "/images/brundha pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/brunda._.17?igsh=dGFkb2dmZWF6OGVj",
    linkedin: "https://www.linkedin.com/in/brunda-reddy-r-02a149295",
  },
  {
    role: "STUDENT MENTOR",
    name: "Guraman Singh",
    image: "/images/guraman singh pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/sokhig1?igsh=bGdzeDBzODBpeHFl",
    linkedin: "https://www.linkedin.com/in/guraman-singh-sokhi-33884121b?",
  },
  {
    role: "STUDENT COORDINATOR HEAD",
    name: "Nandana Rajesh",
    image: "/images/nandana pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/nandana2628?igsh=MXQzMHBtNTY0ejZmYw==",
    linkedin: "https://www.linkedin.com/in/nandana-rajesh-583827294",
  },
  {
    role: "SECRETARY",
    name: "Monika S",
    image: "/images/monika pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/_m.o.n.i.k.a_16?igsh=MXNiaHd4cDl2ZWM4Zg==",
    linkedin: "http://linkedin.com/in/monika-s-85b275341",
  },
  {
    role: "TREASURER",
    name: "Pratham Gupta",
    image: "/images/pratham pick.png", // Replace with your image path
    instagram: "https://www.instagram.com/__pratham__01?igsh=aTFnb2k1YzBkeWJh",
    linkedin: "https://linkedin.com/in/pratham21gupta",
  },
  {
    role: "PROJECT MANAGER",
    name: "Kishore",
    image: "/images/kishor pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/mhskreddy_04?igsh=MWxtbWo5MDFvZTlhdA==",
    linkedin:
      "https://www.linkedin.com/in/m-hema-siva-kishore-reddy-26407734b/",
  },
  {
    role: "PR HEAD",
    name: "Dhanya Karnam",
    image: "/images/dhanya pick.jpg", // Replace with your image path
    instagram:
      " https://www.instagram.com/dhanyaaayyy?igsh=MXVnZGtmcWE4cWtuMg== ",
    linkedin: "https://www.linkedin.com/in/dhanya-karnam-3921a01bb?",
  },
  {
    role: "MARKETING HEAD",
    name: "Kadiri Akshaya",
    image: "/images/akshaya pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/borahae_hearts?igsh=eGs2bzEzcmV3NGJq",
    linkedin: "http://www.linkedin.com/in/kadiriakshaya",
  },
  {
    role: "EVENT MANAGEMENT HEAD",
    name: "Rohan Baiju",
    image: "/images/rohan biju pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "http://www.linkedin.com/in/rohanbaiju",
  },
  {
    role: "CONTENT HEAD",
    name: "Rayyan Ahamed",
    image: "/images/content-head.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    role: "DESIGN HEAD",
    name: "Ananta Sai Gudivada",
    image: "/images/ananth pick.jpg", // Replace with your image path
    instagram:
      "https://www.instagram.com/ananthasaigudivada?igsh=ZHlweXAxZXRxa2Qx",
    linkedin: "https://www.linkedin.com/in/ananthasaigudivada",
  },
  {
    role: "TECHNICAL HEAD",
    name: "Prasanna Kumaran",
    image: "/images/prasanna pick.jpg", // Replace with your image path
    instagram: "https://www.instagram.com/prasi2004/",
    linkedin: "https://www.linkedin.com/in/prasi2004",
  },
];

// --- SVG Icons (Simplified) ---
// You can replace these with icons from a library like react-icons if preferred.
const InstagramIcon = (
  <svg
    className="icon"
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
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

const XIcon = // Formerly Twitter
  (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153C18.256 0.479 17.387 0.057 16.484 0.003L16.417 0H7.583L7.516 0.003C6.613 0.057 5.744 0.479 5.099 1.153C4.455 1.827 4.026 2.698 3.972 3.601L3.904 4H1.5C0.672 4 0 4.672 0 5.5V7C0 7.828 0.672 8.5 1.5 8.5H3.725L3.904 20.398C3.958 21.301 4.387 22.172 5.031 22.846C5.676 23.52 6.545 23.942 7.448 23.996L7.516 24H16.484L16.552 23.996C17.455 23.942 18.324 23.52 18.969 22.846C19.613 22.172 20.042 21.301 20.096 20.398L20.275 8.5H22.5C23.328 8.5 24 7.828 24 7V5.5C24 4.672 23.328 4 22.5 4H20.096L20.028 3.601C19.974 2.698 19.545 1.827 18.901 1.153ZM12 11.5L8.5 18H6.5L10.5 11.5H12ZM13.5 11.5L17.5 18H15.5L11.5 11.5H13.5Z"></path>
    </svg>
  );

export default function TeamPage() {
  return (
    <div className="team-page-container">
      
      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

     
    </div>
  );
}


      {/* --- Main Our Team Section --- */}
      <section className="our-team-section">
        <div className="team-top-image-wrapper">
          <Image
            src="/images/3 pick.png" // <-- use correct file name here
            alt="Team Illustration"
            width={1000}
            height={400}
            className="team-top-image"
          />
        </div>
        {/* Left: Heading and paragraph */}
        <div className="intro-text">
          <h1 className="section-title"> OUR TEAM</h1>
          <p className="section-subtitle">
            Introducing the core members of SCOPE and their respectful roles.
          </p>
        </div>
        {/* Right: Image */}
          
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <h2 className="member-role">{member.role}</h2>
              <p className="member-name">{member.name}</p>
              <div className="member-image-container">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150} // Adjust width as needed
                  height={150} // Adjust height as needed, maintain aspect ratio if possible
                  className="member-image"
                  objectFit="cover" // Ensure image covers the area
                />
              </div>
              <div className="member-socials">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {InstagramIcon}
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}
