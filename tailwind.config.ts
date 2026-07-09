import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff8ff",
          100: "#dff0ff",
          200: "#b9e1ff",
          300: "#7bc5f6",
          400: "#3ba1ed",
          500: "#1683d8",
          600: "#0870bd",
          700: "#075a99",
          800: "#0b4d7e",
          900: "#0f4169"
        },
        accent: {
          400: "#f6a928",
          500: "#ee8b0b",
          600: "#d96906"
        },
        ink: "#17253b"
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(13, 67, 112, 0.28)",
        card: "0 10px 30px -18px rgba(13, 67, 112, 0.32)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    },
  },
  plugins: [],
};

export default config;
