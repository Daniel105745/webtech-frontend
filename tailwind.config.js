/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        dark: 'var(--dark)',
        'gray-text': 'var(--gray-text)',
        'gray-bg': 'var(--gray-bg)',
        'gray-border': 'var(--gray-border)'
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        'sm-custom': '0 1px 2px rgba(0,0,0,0.05)',
        'md-custom': '0 3px 8px rgba(0,0,0,0.08)',
        'lg-primary': '0 6px 16px rgba(37, 99, 235, 0.12)'
      }
    }
  },
  plugins: [],
}

