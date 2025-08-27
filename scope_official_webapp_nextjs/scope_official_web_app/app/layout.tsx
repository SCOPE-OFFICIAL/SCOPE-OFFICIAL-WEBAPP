import "./globals.css";
import Link from "next/link";
import { Orbitron, Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

// Load fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "600"], variable: "--font-orbitron" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });

// Consolidated Metadata
export const metadata: Metadata = {
  title: {
    default: "SCOPE Club",
    template: "%s | SCOPE Club"
  },
  description: "Wired for Innovation, Powered by Passion. Learn more about SCOPE and our mission, what we do, and our teams.",
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#040A28] text-white font-inter">
        {/* ✅ NAVBAR with hover effects */}
        <header className="bg-[#040A28] shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/" passHref>
                {/* Increased logo size */}
                <img 
                  src="/assets/logo.png" 
                  alt="SCOPE Club Logo" 
                  className="h-20 w-20 transition-transform duration-300 hover:scale-105 cursor-pointer" 
                />
              </Link>
            </div>
            <nav className="space-x-6 text-gray-200">
              <Link
                href="/"
                className="nav-link-hover-effect"
              >
                Home
              </Link>
              <Link href="/events" className="nav-link-hover-effect">Events</Link>
              <Link href="/aboutus" className="nav-link-hover-effect">About Us</Link>
              <Link href="/gallery" className="nav-link-hover-effect">Gallery</Link>
              <Link href="/teams" className="nav-link-hover-effect">Team</Link>
              <Link href="/faq" className="nav-link-hover-effect">FAQ</Link>
            </nav>
          </div>
        </header>

        {/* ✅ PAGE CONTENT */}
        <main className="flex-grow">{children}</main>

        {/* ✅ FOOTER with hover effects and corrected links */}
        <footer className="bg-[#040A28] text-white py-6 mt-10 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-4 text-gray-300">Connect with us</p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.instagram.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src="/assets/instagram.png" alt="Instagram" className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src="/assets/x.png" alt="X (Twitter)" className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/scope-reva-university/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src="/assets/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}