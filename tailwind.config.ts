import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        carbon: {
          950: "#050709",
          900: "#080B10",
          850: "#0E131A",
          800: "#141B24",
          700: "#1C2430",
          600: "#2B3545",
        },
        cyan: {
          glow: "#00F0FF",
          accent: "#00D2FF",
          dark: "#0099B8",
        },
        gold: {
          glow: "#F59E0B",
          light: "#FDE68A",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "glow-lg": "0 0 45px -5px rgba(0, 240, 255, 0.45)",
        "gold-glow": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "carbon-gradient": "linear-gradient(180deg, #0E131A 0%, #080B10 100%)",
        "radial-glow": "radial-gradient(circle at center, rgba(0, 240, 255, 0.12) 0%, transparent 70%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
