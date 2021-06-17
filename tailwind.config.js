module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [ 'IBM Plex Sans Condensed', 'sans-serif' ],
        headline: [ 'Bebas Neue', 'sans-serif' ]
      },
      fontSize: {
        '2xs': '.65rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
