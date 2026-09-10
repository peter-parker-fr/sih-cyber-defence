module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B0F17',
        'navy-light': '#1a202c',
        'electric-blue': '#00D4FF',
        'electric-blue-dark': '#3B82F6',
        'alert-amber': '#FFA500',
        'alert-red': '#FF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['Monaco', 'monospace'],
      },
      backdropBlur: {
        'md': '10px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
