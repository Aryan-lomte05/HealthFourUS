/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Blurple theme
        blurple: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4F46E5", // primary
          600: "#4338CA",
          700: "#3730A3",
          800: "#312E81",
          900: "#1E1B4B",
        },
        indigoSoft: "#6366F1",
        violetDeep: "#4338CA",
        electricSoft: "#818CF8",
        navyDeep: "#020617",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass-soft":
          "0 0 0 1px rgba(129, 140, 248, 0.1), 0 18px 45px rgba(15, 23, 42, 0.9)",
        "neon-glow":
          "0 0 0 1px rgba(129, 140, 248, 0.4), 0 0 18px rgba(99, 102, 241, 0.75)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      animation: {
        "gradient-slow": "gradientShift 18s ease infinite",
        "float-slow": "float 12s ease-in-out infinite",
      },
      keyframes: {
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0px, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
      },
    },
  },
  plugins: [],
};
