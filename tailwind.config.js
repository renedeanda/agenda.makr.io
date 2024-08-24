
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',  // Indigo
        secondary: '#8b5cf6',  // Purple
        accent: '#f59e0b',  // Amber
        background: {
          light: '#f3f4f6',  // Gray-100
          dark: '#1f2937',  // Gray-800
        },
        text: {
          light: '#1f2937',  // Gray-800
          dark: '#f3f4f6',  // Gray-100
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
