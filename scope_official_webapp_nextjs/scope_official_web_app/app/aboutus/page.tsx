"use client";

import React from "react";
import AboutUs from "./sections/AboutUs/AboutUs";
import WhatWeDo from "./sections/WhatWeDo/WhatWeDo";

export default function HomePage() {
  return (
    <div style={{ 
      overflow: 'visible', 
      height: 'auto', 
      width: '100%',
      position: 'relative',
      padding: 0,
      margin: 0
    }}>
      <AboutUs />
      <WhatWeDo />
    </div>
  );
}
