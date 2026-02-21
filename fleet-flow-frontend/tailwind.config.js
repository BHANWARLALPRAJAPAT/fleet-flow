import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#3B82F6",
        "background-light": "#F8FAFC",
        "background-dark": "#020617",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
  plugins: [forms, typography],
};
