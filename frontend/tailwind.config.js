/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.css"],
  theme: {
    extend: {
      colors: {
        // ✨ Warna coklat soft minimalis (untuk admin & existing)
        "soft-brown": {
          50: "#FDF8F2",
          100: "#F5E6D3",
          200: "#E6D5B8",
          300: "#D6C9B9",
          400: "#C4A484",
          500: "#B7A287",
          600: "#A67B5B",
          700: "#8B5A2B",
          800: "#6F4E37",
          900: "#4A3729",
        },
        clay: {
          50: "#F9F5F0",
          100: "#F0E9DE",
          200: "#E0D2C0",
        },
        // 🎨 Warna baru untuk customer redesign
        cream: "#FDF8F2",
        beige: "#F5E6D3",
        terracotta: "#A67B5B",
        "warm-brown": "#8B5A2B",
        "dark-brown": "#4A3729",
      },
      fontFamily: {
        // Font untuk customer
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Lato", "sans-serif"],
        // Font admin tetap Poppins (default)
      },
    },
  },
  plugins: [],
};
