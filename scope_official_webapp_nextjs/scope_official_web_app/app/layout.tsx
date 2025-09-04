import "./globals.css";
import { Orbitron, Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "./navbar"; // ✅ import navbar

// Load fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["600"], variable: "--font-orbitron" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "SCOPE Club",
  description:
    "Wired for Innovation, Powered by Passion. Learn more about SCOPE and our mission, what we do, and our teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#040A28] text-white font-inter">
        <Navbar /> {/* ✅ Navbar handles pathname */}
        <main className="flex-grow">{children}</main>
        <footer className="bg-[#040A28] text-white py-6 mt-10 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-4 text-gray-300">Connect with us</p>
            <div className="flex justify-center space-x-6">
              <a href="https://www.instagram.com/your-username" target="_blank" rel="noopener noreferrer">
                <img src="/assets/instagram.png" alt="Instagram" className="h-6 w-6 hover:opacity-80 transition-opacity duration-200" />
              </a>
              <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer">
                <img src="/assets/x.png" alt="X (Twitter)" className="h-6 w-6 hover:opacity-80 transition-opacity duration-200" />
              </a>
              <a href="https://www.linkedin.com/company/scope-reva-university/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/linkedin.png" alt="LinkedIn" className="h-6 w-6 hover:opacity-80 transition-opacity duration-200" />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
