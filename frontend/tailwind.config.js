/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "380px",
        sm: "500px",
        md: "600px",
        lg: "800px",
        xl: "1280px",
      },
      fontFamily: {
        kirang: ["Kirang Haerang", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%, 25%": {
            transform: "translateY(-50%) translateX(0%)",
          },
          "75%, 100%": {
            transform:
              "translateY(-50%) translateX(calc(-1 * var(--marquee-distance)))",
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        marquee:
          "marquee var(--marquee-duration, 4s) ease-in-out infinite alternate",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
