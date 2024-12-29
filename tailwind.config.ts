import { nextui } from '@nextui-org/react';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#72BF44",    // Lime Green
        secondary: "#f9f9f9",  // White updateable
        accent: "#0E0E0E",     // Jet Black
        background: "#CCCCCC", // Light Gray
        lightBackground: "#F5F5F5", // Softer Gray
        border: "#E0E0E0",     // Light Gray for borders
        hoverPrimary: "#2c4b1a",      // Darker Lime Green for hover effects
        textPrimary: "#0E0E0E", // Main text color
        textSecondary: "#555555", // Subtle text color
        success: "#4CAF50",    // Green for success messages
        warning: "#FFC107",    // Yellow for warnings
        error: "#F44336",      // Red for errors
        info: "#2196F3",       // Blue for informational text
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;