/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kirang: ["Kirang Haerang", "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        morph: "morph 15s ease-in-out infinite",
        "morph-delay": "morph 15s ease-in-out infinite 5s",
        "morph-delay-2": "morph 15s ease-in-out infinite 10s",
      },
      keyframes: {
        morph: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(90deg) scale(1.1)" },
          "50%": { transform: "rotate(180deg) scale(1)" },
          "75%": { transform: "rotate(270deg) scale(0.9)" },
        },
      },
    },
  },
  plugins: [],
};
