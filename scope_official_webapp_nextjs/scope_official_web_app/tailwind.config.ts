// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        dmSans: ["var(--font-dm-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
