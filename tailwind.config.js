const config = {
  darkMode: ['class'],
  theme: {
    extend: {
      screens: {
        'h-screen': { raw: '(max-height: 800px)' },
        'sm-h': { raw: '(min-height: 600px)' },
        'md-h': { raw: '(min-height: 800px)' },
        'lg-h': { raw: '(min-height: 1000px)' },
      },
    },
  },
}
