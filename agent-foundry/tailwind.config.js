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
        // Medical theme color system
        medical: {
          // Trust & Professional Blues
          primary: "#0077B6",
          primaryDark: "#005F8F",
          primaryLight: "#00A8E8",
          
          // Health & Vitality Greens
          success: "#10B981",
          successDark: "#059669",
          successLight: "#34D399",
          
          // Urgent & Critical Reds
          urgent: "#EF4444",
          urgentDark: "#DC2626",
          urgentGlow: "#FCA5A5",
          
          // Warning & Caution Ambers
          warning: "#F59E0B",
          warningDark: "#D97706",
          warningLight: "#FCD34D",
          
          // Calm & Background
          calm: "#E0F2FE",
          calmDark: "#BAE6FD",
          
          // AI & Tech Accents (refined blurple)
          ai: "#6366F1",
          aiDark: "#4F46E5",
          aiLight: "#818CF8",
        },
        
        // Legacy blurple (for backward compatibility)
        blurple: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#0077B6", // Now medical primary
          600: "#005F8F",
          700: "#004D73",
          800: "#003D5C",
          900: "#002E45",
        },
        
        // Neutral grays with warmth
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        
        navyDeep: "#020617",
      },
      
      backdropBlur: {
        xs: "2px",
      },
      
      boxShadow: {
        "glass-soft": "0 0 0 1px rgba(0, 119, 182, 0.1), 0 18px 45px rgba(15, 23, 42, 0.9)",
        "neon-glow": "0 0 0 1px rgba(0, 119, 182, 0.4), 0 0 18px rgba(0, 119, 182, 0.75)",
        "medical-glow": "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)",
        "urgent-glow": "0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)",
        "success-soft": "0 4px 14px rgba(16, 185, 129, 0.25)",
      },
      
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2rem",
      },
      
      animation: {
        "gradient-slow": "gradientShift 18s ease infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "ekg-line": "ekgLine 2s ease-in-out infinite",
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
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.05)" },
          "28%": { transform: "scale(1)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        ekgLine: {
          "0%, 100%": { transform: "scaleX(1)", opacity: "0.7" },
          "10%": { transform: "scaleX(1.2) translateY(-2px)", opacity: "1" },
          "20%": { transform: "scaleX(0.8) translateY(2px)", opacity: "0.8" },
          "30%": { transform: "scaleX(1)", opacity: "0.7" },
        },
      },
      
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
