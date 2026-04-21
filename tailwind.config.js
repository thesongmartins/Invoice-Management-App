/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        spartan: ['"League Spartan"', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#7C5DFA',
          light: '#9277FF',
        },
        navy: {
          DEFAULT: '#0C0E16',
          medium: '#1E2139',
          light: '#252945',
          muted: '#373B53',
        },
        blue: {
          gray: '#DFE3FA',
          muted: '#888EB0',
          soft: '#7E88C3',
        },
        invoice: {
          draft: {
            bg: '#F4F4F5',
            text: '#373B53',
          },
          pending: {
            bg: '#FF8F0026',
            text: '#FF8F00',
          },
          paid: {
            bg: '#33D69F26',
            text: '#33D69F',
          },
        },
        danger: {
          DEFAULT: '#EC5757',
          light: '#FF9797',
        },
      },
      borderRadius: {
        brand: '20px',
        badge: '6px',
        btn: '24px',
        card: '8px',
      },
      boxShadow: {
        card: '0 10px 20px -6px rgba(72, 84, 159, 0.1)',
        'card-dark': '0 10px 20px -6px rgba(0, 0, 0, 0.25)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}
