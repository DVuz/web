/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or 'media' or 'class'
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // darkBg: '#0D1B2A', 0a0a0a
        // darkBg: '#0F2330',
        darkBg: '#1a202c  ',
        // darkBg: '#0a0a0a',
        bgDiv: '#0e2229',
        bgGreen: '#042f2c',
        mainGreen: '#16512e',
        // mainGreen:"#004e3e",
        mainYellow: '#efbf04',
        darkBgbodyAdmin: '#0a0a0a',
        darkBgDivAdmin: '#262626',
        adminWhite: '#f5f5f5',
      },
      animation: {
        bounce: 'bounce 4s infinite',
        typing: 'typing 1.2s infinite ease-in-out',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-50px)' }, // Đóng ngoặc } bị thiếu
        },
        typing: {
          '0%': { transform: 'translateY(0px)', opacity: 0.6 },
          '50%': { transform: 'translateY(-4px)', opacity: 1 },
          '100%': { transform: 'translateY(0px)', opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
