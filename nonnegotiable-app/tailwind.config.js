/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        nn: {
          bg:        '#0B0B0C',
          card:      '#1A1A1D',
          primary:   '#F5F5F5',
          secondary: '#9A9AA0',
          success:   '#4CAF50',
          failure:   '#E04F4F',
          accent:    '#3A6EA5',
        },
      },
      fontFamily: {
        // Swap in Inter if you add expo-google-fonts/inter
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
