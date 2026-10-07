/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#12302A', deep: '#0E2420', night: '#0A1B18', 2: '#1A3F37', 3: '#24524A' },
        stone: { DEFAULT: '#EDE8DF', 2: '#E2DBCE' },
        paper: '#F7F4EE',
        brass: { DEFAULT: '#C9A15A', light: '#DCC08A', ink: '#7A5A22' },
        terabai: '#9E3B2E',
        moss: { DEFAULT: '#4F5C56', dark: '#A9BDB5' },
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
