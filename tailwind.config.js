/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background: "#0D1117",
        sidebar: "#161c26",
        "sidebar-hover": "#1e2634",
        primary: "#FFB80C",
        secondary: "#1d1b17",
        roulette: "#C52703"
      }
    },
  },
  plugins: [],
}