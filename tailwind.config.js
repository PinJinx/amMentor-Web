/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#FEC430',
        'dark-bg': '#1E1E1E',
        'light-grey-bg': 'rgba(217, 217, 217, 0.02)',
        'white-text': '#FFFFFF',
        'red': '#FF5252',
        'dark-red': '#B25503',
        'green': '#00FF09',
        'dark-green': '#008000',
        'grey': '#777777',
        'muted-grey': '#C7C7C7',
        'deep-grey': '#464646',
        'deeper-grey':'#2B2B2B',
        'dark-grey': '#303030',
        'container-grey': 'rgba(217, 217, 217, 0.05)', 
        'charcoal': '#333333',
        
        /* ===== New colors ===== */
        "v1-primary-yellow": "#FEC430",
        "v1-primary-yellow-hover": "#F59E0B",
        "v1-bg-main": "#1E1E1E",
        "v1-bg-input": "#18181B",
        "v1-bg-hover": "#27272A",
        "v1-bg-hover-strong": "#3F3F46",
        "v1-container-light": "rgba(217,217,217,0.02)",
        "v1-container": "rgba(217,217,217,0.05)",
        "v1-text-white": "#FFFFFF",
        "v1-text-muted": "#6B7280",
        "v1-text-placeholder": "#52525B",
        "v1-text-muted-strong": "#3F3F46",
        "v1-red": "#FF5252",
        "v1-dark-red": "#B25503",
        "v1-green": "#00FF09",
        "v1-dark-green": "#008000",
        "v1-grey": "#777777",
        "v1-muted-grey": "#C7C7C7",
        "v1-deep-grey": "#464646",
        "v1-deeper-grey": "#2B2B2B",
        "v1-dark-grey": "#303030",
        "v1-charcoal": "#333333",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}