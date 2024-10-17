/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.ts'],
  theme: {
    container: {
      center: true,
      padding: '2rem'
    }
  }
}

export default config
