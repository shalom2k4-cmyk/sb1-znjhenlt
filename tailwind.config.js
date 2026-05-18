/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#00A1DE',
        'navy': '#1A237E',
        'off-white': '#FDFCF8',
        'sun-yellow': '#FAD201',
        'light-yellow': '#FFFDE7',
        'text-dark': '#333333',
        'text-muted': '#555555',
      },
      fontFamily: {
        sans: ['Inter', 'Ubuntu', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
