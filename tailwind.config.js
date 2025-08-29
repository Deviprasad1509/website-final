/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        'text-heading': 'var(--text-heading)',
        'text-body': 'var(--text-body)',
        'text-muted': 'var(--text-muted)',
        'button-background': 'var(--button-background)',
        'button-text': 'var(--button-text)',
        'button-hover-background': 'var(--button-hover-background)',
        'input-border': 'var(--input-border)',
        'input-text': 'var(--input-text)',
        'input-placeholder': 'var(--input-placeholder)',
        'input-background': 'var(--input-background)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'heading': '24px',
        'body': '16px',
        'small': '14px',
      },
      borderRadius: {
        'button': '8px',
        'input': '6px',
        'card': '12px',
      },
      padding: {
        'button': '12px 20px',
        'input': '10px 14px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.05)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
