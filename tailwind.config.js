/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#12302A', 2: '#1A3F37', 3: '#24524A' },
        stone: { DEFAULT: '#EEEAE1', 2: '#E3DDD0' },
        paper: '#F8F6F1',
        brass: { DEFAULT: '#C9A15A', ink: '#7A5A22' },
        terabai: '#9E3B2E',
        moss: { DEFAULT: '#4F5C56', dark: '#A9BDB5' },
      },
      fontFamily: {
        display: ['Marcellus', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
