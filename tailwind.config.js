/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#a259fa',
          500: '#7855ff',
          600: '#6200ff',
        },
        accent: {
          400: '#4dafff',
          500: '#1f9bff',
        },
        dark: {
          900: '#000000',
          800: '#13004d',
          700: '#1a0066',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.5',
        'relaxed': '1.6',
        'loose': '1.7',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0em',
        'wide': '0.01em',
        'wider': '0.02em',
      },
      maxWidth: {
        'text-content': '65ch',
        'prose': '75ch',
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'spin-slow': 'spin 120s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0)' },
          '50%': { opacity: 1, transform: 'scale(1)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};