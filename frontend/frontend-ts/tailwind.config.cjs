/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00b894",
        secondary: "#00cec9",
        accent: "#0984e3",
        dark: "#1e272e",
      },
    },
  },
  plugins: [],
};
