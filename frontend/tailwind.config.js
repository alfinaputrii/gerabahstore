/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ✨ Warna coklat soft minimalis (Opsi C)
        "soft-brown": {
          50: "#FDF8F2", // background paling soft
          100: "#F5E6D3", // card background
          200: "#E6D5B8", // border
          300: "#D6C9B9", // hover state
          400: "#C4A484", // icon background
          500: "#B7A287", // secondary text
          600: "#A67B5B", // primary button
          700: "#8B5A2B", // headings
          800: "#6F4E37", // dark accent
          900: "#4A3729", // very dark
        },
        // Bisa juga tambah warna lain kalau perlu
        clay: {
          50: "#F9F5F0",
          100: "#F0E9DE",
          200: "#E0D2C0",
        },
      },
    },
  },
  plugins: [],
};
