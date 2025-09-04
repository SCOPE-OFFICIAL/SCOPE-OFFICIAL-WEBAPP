"use client";

import Image from "next/image";
import ScrollAnimation from "../components/ScrollAnimationFixed";

export default function OriginalHomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      {/* High Quality Circuit Board Video Background */}
      <div className="absolute inset-0 opacity-70">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/circuitreversed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Subtle dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <ScrollAnimation>
        <div className="text-center space-y-6 px-4 relative z-10">
          <div className="group cursor-pointer relative mb-4">
            <Image 
              src="/images/officialScope11.png" 
              alt="SCOPE" 
              width={250}
              height={120}
              className="w-auto h-28 md:h-32 mx-auto transition-transform duration-300 ease-in-out group-hover:-translate-y-2"
              priority
            />
            <p className="text-sm md:text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute top-full -mt-1 text-center left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap">
              Society of Core Oriented Projects in Electronics
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            Wired for Innovation, Powered by Passion
          </p>
          
          <div className="text-lg text-gray-400 max-w-2xl mx-auto">
            Exploring the frontiers of electronics and circuit design
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
