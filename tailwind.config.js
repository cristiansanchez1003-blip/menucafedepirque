/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6EC',
        coffee: '#6B3A2A',
        amber: '#C4843A',
        ink: '#2C1A0E',
        muted: '#8C6A4E',
        border: '#E8D5B7',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(44, 26, 14, 0.08)',
        cardHover: '0 10px 24px rgba(44, 26, 14, 0.16)',
      },
    },
  },
  plugins: [],
}
