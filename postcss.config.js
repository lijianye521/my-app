 /** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
      'postcss-flexbugs-fixes': {},
      '@tailwindcss/postcss': {},
      'postcss-preset-env': {
        features: {
          'nesting-rules': true,
          'custom-properties': true
        },
        autoprefixer: {
          grid: true,
          flexbox: 'no-2009'
        }
      },
      '@csstools/postcss-oklab-function': { preserve: true },
      'postcss-color-function': { preserve: true },
    },
  }
  
  export default config