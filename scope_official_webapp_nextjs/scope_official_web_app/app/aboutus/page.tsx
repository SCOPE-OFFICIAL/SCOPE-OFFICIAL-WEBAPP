"use client";

import React from "react";
import AboutUs from "./sections/AboutUs/AboutUs";
import WhatWeDo from "./sections/WhatWeDo/WhatWeDo";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <AboutUs />
        <WhatWeDo />
      </div>
    </div>
  );
}
