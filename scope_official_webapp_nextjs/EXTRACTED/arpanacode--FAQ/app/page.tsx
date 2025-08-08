import Image from "next/image";
import React from "react";

// --- SVG Icon Components ---
// No need to install any icon libraries. These are now self-contained.

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0C112B] text-white font-sans">
      {/* Header Section */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Logo with specific dimensions */}
          <Image
            src="/scope-logo.png" // Make sure your logo is in public/scope-logo.png
            alt="SCOPE Logo"
            width={124}
            height={122.4}
          />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Events
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Team
            </a>
            {/* Updated FAQ Link with glowing underline */}
            <div className="relative">
              <a href="#" className="text-white">
                FAQ
              </a>
              <div
                className="absolute w-full h-[2px] -bottom-1 left-0 bg-pink-500"
                style={{ boxShadow: "0px 2px 8px 0px rgba(236, 72, 153, 0.7)" }}
              ></div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Form and Text */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-orbitron">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Navigating Your Queries with Precision. Explore answers to common
              questions about circuits, components, electronics fundamentals and
              the upcoming events. Need more help? Reach out to us!
            </p>

            {/* Contact Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Post Your Queries Here
                </label>
                <textarea
                  id="query"
                  rows={8}
                  className="w-full bg-gray-200 rounded-lg border border-transparent focus:border-blue-400 focus:ring-0 px-4 py-3 text-black placeholder-gray-500"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Right Column: Illustration with specific dimensions */}
          <div className="hidden lg:flex items-center justify-center">
            <Image
              src="/image.png" // UPDATED: This now points to your illustration file
              alt="Illustration of a person with a large question mark"
              width={380}
              height={409.7}
            />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center w-full max-w-md">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-4 text-gray-400">Connect with us</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XIcon />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
