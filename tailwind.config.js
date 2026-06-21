/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Roboto", "Arial", "sans-serif"] },
      colors: {
        orange: { 50: "#fff7ed", 100: "#fff2eb", 300: "#ffa87d", 500: "#f15a24", 600: "#d94f20" },
        gray: { 50: "#fafafa", 100: "#f7f7f7", 200: "#e9e9e9", 300: "#d6d6d6", 500: "#8f8f8f", 600: "#6b6b6b", 700: "#333333", 900: "#2d2d2d" }
      },
      borderRadius: { full: "999px" },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,.08)", card: "0 16px 36px rgba(0,0,0,.08)" }
    }
  },
  plugins: []
};
