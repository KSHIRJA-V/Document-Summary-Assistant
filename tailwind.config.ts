import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        unthinkable: {
          bg: "#0b0f17",
          panel: "#11161f",
          card: "#161d28",
          cardHover: "#1d2736",
          border: "#243242",
          borderLight: "#2e3f53",
          green: "#5dd667",
          greenHover: "#4ec257",
          greenDark: "#2d7534",
          greenSoft: "rgba(93, 214, 103, 0.12)",
          greenGlow: "rgba(93, 214, 103, 0.25)",
          textPrimary: "#f1f5f9",
          textMuted: "#94a3b8",
          textDim: "#64748b",
          lightBg: "#f8fafc",
          lightPanel: "#ffffff",
          lightCard: "#ffffff",
          lightBorder: "#e2e8f0",
          lightTextPrimary: "#0f172a",
          lightTextMuted: "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-jakarta)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "emerald-glow": "0 0 25px -5px rgba(93, 214, 103, 0.3)",
        "emerald-sm": "0 0 12px -2px rgba(93, 214, 103, 0.25)",
        "dark-card": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        "light-card": "0 10px 30px -10px rgba(15, 23, 42, 0.08)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
