/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF7F2",
        primary: "#9F3737",
        secondary: "#682424"
      }
    },
  },
  plugins: [],
}

