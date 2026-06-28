import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A1628",
          900: "#0F2244",
          800: "#142C56",
          700: "#1E3A5F",
          500: "#3B5C82",
          300: "#7C95B5",
          100: "#E4E9F0",
        },
        brass: {
          DEFAULT: "#C99B4A",
          light: "#E0C386",
          dark: "#9C7530",
        },
        paper: "#F7F8FA",
        ink: "#14213D",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        panel: "0 10px 40px -10px rgba(10, 22, 40, 0.25)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(201,155,74,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(201,155,74,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(201,155,74,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
