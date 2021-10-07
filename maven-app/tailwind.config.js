module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          950: '#006197',
          850: '#084E85',
          450: '#6098B7',
        },
        gray: {
          50: '#EFEFEF',
          75: '#DADADA',
          80: '#D8D8D8',
          950: '#161D25',
        },
        red: {
          150: '#FF0000',
        },
      },
      width: {
        videoxl: '704.5px',
        video: '630.5px',
      },
      minWidth: {
        btn: '200px',
        info: '330px',
        icon: '40px',
        product: '230px',
        videoxl: '704.5px',
        video: '620.5px',
      },
      maxWidth: {
        wrapper: '1100px',
        header: '970px',
        'consumer-input': '410px',
        'consumer-contact': '440px',
        title: '820px',
        card: '550px',
        success: '440px',
        list: '770px',
        brand: '200px',
        tile: '320px',
        72: '20rem',
        full: '100%',
        btn: '224.5px',
        'footer-logo': '212px',
        form: '730px',
        suggestion: '830px',
        register: '1015px',
        '1/2': '50%',
        product: '230px',
      },
      minHeight: {
        fullpage: '100vh',
        banner: '220px',
        video: '230px',
        9: '36px',
        'mobile-menu': '640px',
      },
      height: {
        video: '450px',
      },
      boxShadow: {
        2: '0 10px 20px 0 rgba(0, 0, 0, 0.1)',
      },
      maxHeight: {
        banner: '533px',
        fullpage: '100vh',
        sponsor: '144px',
      },
    },
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
  plugins: [],
}
