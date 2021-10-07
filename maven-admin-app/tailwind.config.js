const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald,
      primary: {
        dark: '#053a63',
        DEFAULT: '#084E85',
      },
    },
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      opacity: ['group-hover'],
      fontWeight: ['hover', 'focus'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
