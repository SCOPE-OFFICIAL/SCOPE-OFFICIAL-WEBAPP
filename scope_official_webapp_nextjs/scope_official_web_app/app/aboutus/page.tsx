"use client";

import React from "react";
import { motion } from "framer-motion";
import AboutUs from "./sections/AboutUs/AboutUs";
import WhatWeDo from "./sections/WhatWeDo/WhatWeDo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040a28] via-[#0d1b3d] to-[#040a28] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          // Static positions that don't change on re-render
          const positions = [
            { left: '15%', top: '10%' },
            { left: '75%', top: '20%' },
            { left: '25%', top: '70%' },
            { left: '80%', top: '75%' },
            { left: '45%', top: '25%' },
            { left: '10%', top: '60%' }
          ];
          const durations = [25, 30, 20, 28, 22, 26];
          
          return (
            <motion.div
              key={i}
              className="absolute w-72 h-72 rounded-full opacity-5"
              style={{
                background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
                left: positions[i].left,
                top: positions[i].top,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: durations[i],
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10">
        <AboutUs />
        <WhatWeDo />
      </div>
    </div>
  );
}
