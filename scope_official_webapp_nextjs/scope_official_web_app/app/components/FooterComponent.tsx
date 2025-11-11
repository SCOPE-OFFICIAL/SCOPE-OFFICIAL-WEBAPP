'use client'

import Link from 'next/link';
import Image from 'next/image';

export default function FooterComponent() {

  return (
    <footer className="relative w-full bg-white/5 backdrop-blur-xl text-white border-t border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-gray-300">
              {/* Left: Quick links */}
              <div className="flex flex-col items-center md:items-start">
                <h4 className="font-semibold text-gray-100 mb-3">Quick links</h4>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link href="/#home" className="flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-white/20 hover:bg-white/5 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true"><path d="M12 3l9 8h-3v8h-12v-8h-3l9-8z"/></svg>
                    <span className="text-gray-300 hover:text-white">Home</span>
                  </Link>
                  <Link href="/#about-us" className="flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-white/20 hover:bg-white/5 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <span className="text-gray-300 hover:text-white">About Us</span>
                  </Link>
                  <Link href="/#team" className="flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-white/20 hover:bg-white/5 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3s-1.33-3-2.99-3c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3s-1.33-3-2.99-3c-1.66 0-3 1.34-3 3s1.34 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13z"/></svg>
                    <span className="text-gray-300 hover:text-white">Teams</span>
                  </Link>
                  <Link href="/#events" className="flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-white/20 hover:bg-white/5 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.89-1.99 2L3 20c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 16H5V9h14v11z"/></svg>
                    <span className="text-gray-300 hover:text-white">Events</span>
                  </Link>
                  
                </nav>
              </div>

              {/* Center: Connect + social icons */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-base text-gray-100 font-semibold mb-1">Connect with us</h3>
               
                 {/* Copyright */}

                <div className="flex items-center gap-4">
                  <a href="https://github.com/SCOPE-OFFICIAL" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group inline-flex items-center justify-center h-14 w-14 rounded-full bg-transparent transform transition duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white transition-colors duration-200 group-hover:text-purple-400" fill="currentColor" aria-hidden="true">
                      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.285 3.438 9.77 8.205 11.357.6.111.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.301 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.62-5.48 5.92.43.37.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.067 24 17.583 24 12.297 24 5.67 18.627.297 12 .297z" />
                    </svg>
                  </a>

                  <a href="https://www.linkedin.com/company/scope-reva-university/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group inline-flex items-center justify-center h-14 w-14 rounded-full bg-transparent transform transition duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white transition-colors duration-200 group-hover:text-blue-400" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20h-2.5v-9h2.5v9zm-1.25-10.2c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm13 10.2h-2.5v-4.8c0-1.144-.856-2-2-2s-2 .856-2 2v4.8h-2.5v-9h2.5v1.2c.534-.82 1.598-1.2 2.5-1.2 1.93 0 3.5 1.57 3.5 3.5v5.5z"/></svg>
                  </a>
                </div>
                <div className="border-t border-white/10 pt-6 mt-8">
                  <p className="text-sm text-gray-300 font-semibold mb-1 text-center">© SCOPE - ALL RIGHTS RESERVED</p>
                  <p className="text-xs text-gray-400 mb-3 text-center">Developed with ❤️ by SCOPE Web Dev Team</p>
                </div>
              </div>

              {/* Right: Location */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <h4 className="font-semibold text-gray-100 mb-3">Location</h4>
                <a href="https://maps.app.goo.gl/id2wY8ewsPmjQBbj7" target="_blank" rel="noopener noreferrer" className="inline-flex items-start md:items-center gap-3 text-sm hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 md:h-6 md:w-6 text-white/90 flex-shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                  <span className="leading-tight">School of ECE, Reva University</span>
                </a>

                {/* Placeholder for Reva University logo - place your logo at /public/images/reva-university.png */}
                <div className="mt-4">
                  <Image
                    src="/images/reva-university.png"
                    alt="Reva University"
                    width={140}
                    height={28}
                    className="object-contain inline-block mx-auto md:ml-0"
                  />
                </div>
              
              </div>
            </div>
          </div>
        </div>
            
           
      </div>
    </footer>
  );
}
