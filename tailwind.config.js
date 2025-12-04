/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#24558eff',
          dark: '#357ABD',
          light: '#7FB3E8',
        },
      },
    },
  },
}
