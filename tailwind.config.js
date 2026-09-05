/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#dde8ff",
          200: "#c1d6ff",
          300: "#95b9ff",
          400: "#6191ff",
          500: "#3d6bff",
          600: "#2547f5",
          700: "#1d36e0",
          800: "#1f2eb5",
          900: "#1f2c8f",
          950: "#161a56",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b8c8",
          400: "#8690a8",
          500: "#67708c",
          600: "#525973",
          700: "#43485d",
          800: "#393d4d",
          900: "#333642",
          950: "#1c1e26",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)",
        popover: "0 12px 40px -12px rgba(15, 23, 42, 0.25)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
