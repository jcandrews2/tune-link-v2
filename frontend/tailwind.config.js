/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kirang: ['"Kirang Haerang"', "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-20%)" },
        },
      },
      animation: {
        marquee: "marquee 5s linear infinite alternate",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
