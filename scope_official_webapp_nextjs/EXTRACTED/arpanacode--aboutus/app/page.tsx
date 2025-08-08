import Navbar from "../components/Navbar/Navbar";
import AboutUs from "../sections/AboutUs/AboutUs";
import WhatWeDo from "../sections/WhatWeDo/WhatWeDo";
import OurTeams from "../sections/OurTeams/OurTeams";
import Footer from "../sections/Footer/Footer";

// This is your main About Us page component for the App Router
export default function HomePage() {
  return (
    <div>
      {/* The Navbar will stick to the top */}
      <Navbar />

      {/* Main sections of the page */}
      <AboutUs />
      <WhatWeDo />
      <OurTeams />

      {/* The Footer section */}
      <Footer />
    </div>
  );
}
