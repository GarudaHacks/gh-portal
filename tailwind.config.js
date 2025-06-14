/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#001745",
        primary: "#B25F5F",
        secondary: "#9e3737",
        var1: "A83E36",
      },
    },
  },
  plugins: [],
};
