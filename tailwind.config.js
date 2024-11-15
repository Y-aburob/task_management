/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        columnsBackground1: 'rgb(240,241,245)',
        columnsBackground: 'rgb(226 231 253)',
        ticketBackground: 'rgb(250,250,251)',
        border: 'rgb(198, 204, 203)',
        textGray: 'rgb(89, 94, 93)',
        darkBlue: 'rgb(107,118,151)',
        darkBluelight: 'rgba(107,118,151, .2)',
        darkBlue2: 'rgba(107,118,151, .5)',
        transparentWhite: 'rgba(255, 255, 255, .7)',
      }
    },
  },
  plugins: [],
}