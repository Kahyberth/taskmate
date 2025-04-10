import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float-delay": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.5" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(1.2)", opacity: "0" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(-8px)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-badge": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(139, 92, 246, 0.2)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 15s ease-in-out infinite",
        "float-delay": "float-delay 18s ease-in-out infinite 2s",
        "float-delay-long": "float-delay 20s ease-in-out infinite 3s",
        "float-slow": "float-slow 12s ease-in-out infinite",
        "pulse-slow": "pulse-slow 12s ease-in-out infinite",
        "pulse-slower": "pulse-slow 15s ease-in-out infinite 2s",
        "spin-slow": "spin 30s linear infinite",
        "spin-reverse-slow": "spin 40s linear infinite reverse",
        "spin-very-slow": "spin 60s linear infinite",
        "spin-reverse-very-slow": "spin 70s linear infinite reverse",
        "ping-slow": "ping-slow 10s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-slow": "bounce-slow 12s infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "pulse-badge": "pulse-badge 3s infinite",
        shine: "shine 3s infinite",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      utilities: {
        ".animation-delay-100": {
          "animation-delay": "100ms",
        },
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
        ".animation-delay-400": {
          "animation-delay": "400ms",
        },
        ".animation-delay-500": {
          "animation-delay": "500ms",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".animation-delay-100": {
          "animation-delay": "100ms",
        },
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
        ".animation-delay-400": {
          "animation-delay": "400ms",
        },
        ".animation-delay-500": {
          "animation-delay": "500ms",
        },
      }
      addUtilities(newUtilities)
    },
  ],
} satisfies Config

export default config

