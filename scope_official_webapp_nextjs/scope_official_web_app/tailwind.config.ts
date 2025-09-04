// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        dmSans: ["var(--font-dm-sans)"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        float: 'float 3s ease-in-out infinite',
        'spin-y-slow': 'spin-y 10s linear infinite',
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-y': {
          from: { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;