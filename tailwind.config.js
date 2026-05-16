/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          light: '#4A7D76',
          DEFAULT: '#2D5A54',
          dark: '#1A2E2A',
        },
        pebble: {
          light: '#B4B8B6',
          DEFAULT: '#6D7275',
          dark: '#4A4E50',
        },
        morning: {
          light: '#FFFFFF',
          DEFAULT: '#FDFBF7',
          dark: '#E8EDEC',
        },
        accent: '#D4AF37', // Gold accent for premium feel
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        technical: ['Orbitron', 'sans-serif'],
        utilitarian: ['IBM Plex Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'mechanical-slide': 'mechanical-slide 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        'mechanical-slide': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
