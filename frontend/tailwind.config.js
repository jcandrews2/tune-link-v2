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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%, 25%": {
            transform: "translateX(0%)",
          },
          "75%, 100%": {
            transform: "translateX(calc(-1 * var(--marquee-distance, 20%)))",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        marquee: "marquee 4s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
