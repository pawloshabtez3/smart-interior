import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        warm: {
          primary: "#D4A574",
          secondary: "#8B4513",
          accent: "#CD853F",
        },
        cool: {
          primary: "#4A90A4",
          secondary: "#2C5F75",
          accent: "#7FB3D5",
        },
        neutral: {
          primary: "#A8A8A8",
          secondary: "#5A5A5A",
          accent: "#D3D3D3",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
