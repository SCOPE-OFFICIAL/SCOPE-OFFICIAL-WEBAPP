// app/layout.tsx

import "./globals.css";
import Link from "next/link";
import { Orbitron, Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

// ✅ Load fonts from Google Fonts
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "600"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: "SCOPE Club",
  description: "Wired for Innovation, Powered by Passion",
};

// ✅ Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#040A28] text-white font-inter">
        {/* ✅ NAVBAR */}
        <header className="bg-[#040A28] shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="Logo" className="h-16 w-16" />
            </div>
            <nav className="space-x-6 text-gray-200">
              <Link
                href="/"
                className="relative after:content-[''] after:absolute after:top-6 after:left-1/2 after:-translate-x-1/2 after:w-[40px] after:h-[1.5px] after:rounded-full after:bg-[linear-gradient(to_right,#040A28,#F24DC2,_#040A28)]"
              >
                Home
              </Link>
              <Link href="#events">Events</Link>
              <Link href="#about">About Us</Link>
              <Link href="#team">Team</Link>
              <Link href="#faq">FAQ</Link>
            </nav>
          </div>
        </header>

        {/* ✅ PAGE CONTENT */}
        <main className="flex-grow">{children}</main>

        {/* ✅ FOOTER */}
        <footer className="bg-[#040A28] text-white py-6 mt-10 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-4 text-gray-300">Connect with us</p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.instagram.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/instagram.png"
                  alt="Instagram"
                  className="h-6 w-6 hover:opacity-80 transition-opacity duration-200"
                />
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/x.png"
                  alt="X (Twitter)"
                  className="h-6 w-6 hover:opacity-80 transition-opacity duration-200"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/scope-reva-university/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/linkedin.png"
                  alt="LinkedIn"
                  className="h-6 w-6 hover:opacity-80 transition-opacity duration-200"
                />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
