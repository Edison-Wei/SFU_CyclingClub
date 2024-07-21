/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ["Roboto", "sans-serif"],
      },
      colors: {
        primary: {
          white: "#FFFFFF",
          red: "#890B29"
        },
        secondary: {
          black: "000000"
        }
      }
    },
  },
  plugins: [],
}
