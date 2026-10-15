/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F8E8EE",      // Blush Pink
        secondary: "#FDECEF",    // Pastel Pink
        background: "#FFFDFB",   // Warm White
        accent: "#EFC7D5",       // Dusty Rose
        cream: "#FAF5EF",
        champagne: "#F8F1E8",
        rosegold: "#D4A5A5",
        vintageText: "#4A3F46",
        darkText: "#2B2B2B",
        borderPink: "#F2D9E6",
        success: "#8FB996",
        warning: "#F2C57C",
        error: "#E57373",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        subtitle: ["'Cormorant Garamond'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        'soft-glow': '0 8px 30px rgb(242, 217, 230, 0.4)',
        'luxury': '0 10px 40px -10px rgba(74, 63, 70, 0.08)',
        'premium': '0 20px 50px -12px rgba(212, 165, 165, 0.15)',
      },
      borderRadius: {
        'premium-lg': '24px',
        'premium-md': '18px',
      }
    },
  },
  plugins: [],
}
