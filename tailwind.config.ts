import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F58634",
          light: "#FFE5D2",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        "color-bg-canvas": "#E8ECF0",
        "color-bg-surface": "#FFFFFF",
        "color-text-heading": "#1E293B",
        "color-text-body": "#475569",
        "color-text-muted": "#94A3B8",
        "color-border": "#E2E8F0",
      },
      borderColor: {
        DEFAULT: "#E2E8F0",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
