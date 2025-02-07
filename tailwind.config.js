/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zax: {
          bg: "#242a4d",
          secondary: "#2c3158",
          primary: "#794de2",
          button: "#3f4475",
          text: "#7f84b5",
        },
      },
    },
  },
  plugins: [],
};
