'use client'

import Image from 'next/image';

export default function FooterComponent() {

  return (
    <footer className="relative w-full bg-white/5 backdrop-blur-xl text-white border-t border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-6 min-h-[6rem]">
          <div className="text-center">
            <p className="mb-4 text-base text-gray-100">Connect with us</p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://www.instagram.com/your-username" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Image src="/assets/instagram.png" alt="Instagram" width={24} height={24} className="h-6 w-6 hover:opacity-80 transition-opacity duration-200" />
              </a>
              <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Image src="/assets/x.png" alt="X (Twitter)" width={24} height={24} className="h-6 w-6 opacity-80 hover:opacity-100 transition-opacity duration-200" />
              </a>
              <a href="https://www.linkedin.com/company/scope-reva-university/" target="_blank" rel="noopener noreferrer" className="inline-block hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Image src="/assets/linkedin.png" alt="LinkedIn" width={24} height={24} className="h-6 w-6 hover:opacity-80 transition-opacity duration-200" />
              </a>
            </div>
            
            {/* Copyright and Credits */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-gray-300 font-semibold mb-1">
                © SCOPE - ALL RIGHTS RESERVED
              </p>
              <p className="text-xs text-gray-400">
                Developed by SCOPE Web Dev Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
