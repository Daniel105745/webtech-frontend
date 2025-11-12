/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 🔥 Dark Mode aktivieren (per Klasse)
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Helle Farben (Default)
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        dark: 'var(--dark)',
        'gray-text': 'var(--gray-text)',
        'gray-bg': 'var(--gray-bg)',
        'gray-border': 'var(--gray-border)',

        // Dunkle Farben (Dark Mode)
        'dark-bg': '#0f172a',           // Hintergrund
        'dark-card': '#1e293b',         // Karten / Panels
        'dark-border': '#334155',       // Rahmenfarbe
        'dark-text': '#e2e8f0',         // Helle Schrift
        'dark-text-muted': '#94a3b8',   // Graue Schrift
        'dark-primary': '#3b82f6',      // Blau-Akzent
        'dark-success': '#22c55e',      // Grün-Akzent
        'dark-warning': '#facc15',      // Gelb-Akzent
        'dark-danger': '#ef4444'        // Rot-Akzent
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        'sm-custom': '0 1px 2px rgba(0,0,0,0.05)',
        'md-custom': '0 3px 8px rgba(0,0,0,0.08)',
        'lg-primary': '0 6px 16px rgba(37, 99, 235, 0.12)',
        'dark-card': '0 4px 12px rgba(0,0,0,0.4)' // Schatten im Dark Mode
      },
    },
  },
  plugins: [],
}
