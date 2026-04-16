/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dusk: {
          DEFAULT: '#0E1B3A',
          deep: '#070F24',
          soft: '#1A2A56',
        },
        sunset: {
          yellow: '#FFD27A',
          orange: '#FF8A4C',
          coral: '#FF6A88',
          pink: '#FFB3C6',
          plum: '#6B4B8A',
        },
        cream: '#F8F1E4',
        ink: '#1B1710',
      },
      fontFamily: {
        // Serif for elegant display type, sans for UI/body.
        serif: ['"Fraunces"', '"Cormorant Garamond"', 'ui-serif', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'gradient-slow': 'gradient 18s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
