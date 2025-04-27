/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      colors: {
        customPurple: "#6D7AB5",
        customPurpleDark: "#5A678F",
      },
      fontFamily: {
        concert: ['"Concert One"', 'cursive'],
        poetsen: ['"Poetsen One"', 'sans-serif'],
        winky: ['"Winky Rough"', 'cursive'],
      },
    },
  },
  plugins: [],
}
// Thức đã chỉnh sửa một chút để code có thể chạy được animation