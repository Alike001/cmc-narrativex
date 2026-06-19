/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A0F",
          900: "#0A0E14",
          850: "#0D1219",
          800: "#11161F",
          700: "#161C28",
          600: "#1D2433",
          500: "#2A3245",
        },
        mist: {
          100: "#E8EAED",
          300: "#B7BECC",
          500: "#8B95A7",
          700: "#5B6477",
        },
        signal: {
          400: "#6F92FF",
          500: "#4F7CFF",
          600: "#3A63E0",
          900: "#152254",
        },
        pulse: {
          300: "#6FF0D9",
          400: "#36E6C4",
          500: "#00D9B5",
          900: "#063F35",
        },
        amber: {
          400: "#FFC354",
          500: "#FFB020",
          900: "#4A3308",
        },
        danger: {
          400: "#FF7D7D",
          500: "#FF5C5C",
          900: "#4A1414",
        },
      },
      fontFamily: {
        display: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgba(7,10,15,0.9) 85%), repeating-linear-gradient(0deg, rgba(139,149,167,0.06) 0px, rgba(139,149,167,0.06) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(139,149,167,0.06) 0px, rgba(139,149,167,0.06) 1px, transparent 1px, transparent 48px)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 40%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(79,124,255,0.15), 0 8px 30px -8px rgba(79,124,255,0.25)",
        "glow-pulse":
          "0 0 0 1px rgba(0,217,181,0.15), 0 8px 30px -8px rgba(0,217,181,0.25)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 30px -16px rgba(0,0,0,0.6)",
      },
      animation: {
        ticker: "ticker 28s linear infinite",
        pulseLine: "pulseLine 3.2s ease-in-out infinite",
        rise: "rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
