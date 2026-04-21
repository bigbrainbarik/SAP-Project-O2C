/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Public Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: '#004da4',
        'on-primary': '#ffffff',
        'primary-container': '#0064d2',
        'primary-fixed': '#d6e3ff',
        'primary-fixed-dim': '#a9c8ff',
        surface: '#f8f9fa',
        'surface-dim': '#d8dadb',
        'surface-variant': '#dfe2eb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f3f4',
        'surface-container': '#eceef0',
        outline: '#727785',
        'outline-variant': '#c2c7d6',
        'on-surface': '#191c1d',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#eff1f2',
      },
      boxShadow: {
        soft: '0 16px 32px rgba(25, 28, 29, 0.08)',
      },
    },
  },
  plugins: [],
}

