import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        champagne: '#F3E7D3',
        rose: '#D8A7B1',
        sage: '#A8B5A2',
        gold: '#C6A86A',
        ink: '#2D2D2D',
        muted: '#666666',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px -20px rgba(45, 45, 45, 0.25)',
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
