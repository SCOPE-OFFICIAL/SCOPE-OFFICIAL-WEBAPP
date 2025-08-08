// tailwind.config.js
import type { Config } from "tailwindcss";

export default {
  content: [
    // These paths are correct for your 'app' directory structure in Next.js
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // This covers your layout.tsx, page.tsx, etc.
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // --- ADDED THESE LINES FOR ORBITRON AND DM SANS FONTS, AND CUSTOM SIZES ---
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"], // Defines 'font-orbitron' utility
        "dm-sans": ["DM Sans", "sans-serif"], // Defines 'font-dm-sans' utility
      },
      fontSize: {
        "50px": "50px", // Defines 'text-52px' utility
        "24px": "24px", // Defines 'text-24px' utility
        "28px": "28px",
        "124px": "122.4px",
      },
      // -------------------------------------------------------------------------
    },
  },
  plugins: [],
} satisfies Config;
