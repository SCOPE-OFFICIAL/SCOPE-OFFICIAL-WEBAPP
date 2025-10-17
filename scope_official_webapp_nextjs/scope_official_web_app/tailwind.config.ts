// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Mango Grotesque", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        orbitron: ["Mango Grotesque", "var(--font-orbitron)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        dmSans: ["Mango Grotesque", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
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
