import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(var(--bg))",
          subtle: "hsl(var(--bg-subtle))",
          card: "hsl(var(--bg-card))",
        },
        fg: {
          DEFAULT: "hsl(var(--fg))",
          muted: "hsl(var(--fg-muted))",
        },
        border: "hsl(var(--border))",
        accent: {
          from: "hsl(var(--accent-from))",
          via: "hsl(var(--accent-via))",
          to: "hsl(var(--accent-to))",
        },
        status: {
          active: "hsl(142 76% 45%)",
          busy: "hsl(38 92% 55%)",
          paused: "hsl(220 14% 70%)",
          inactive: "hsl(220 9% 40%)",
          error: "hsl(0 72% 55%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, hsl(var(--accent-from)), hsl(var(--accent-via)) 50%, hsl(var(--accent-to)))",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.36)",
      },
    },
  },
  plugins: [],
};

export default config;
