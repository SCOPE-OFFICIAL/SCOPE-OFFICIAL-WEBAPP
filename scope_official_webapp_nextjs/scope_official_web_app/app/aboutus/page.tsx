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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full opacity-5"
            style={{
              background: `linear-gradient(45deg, #F24DC2, #2C97FF)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <AboutUs />
        <WhatWeDo />
      </div>
    </div>
  );
}
