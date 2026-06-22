/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D9A178',
          hover: '#E7B48E',
          dark: '#B8825A',
        },
        background: {
          DEFAULT: '#000000',
          secondary: '#0A0A0A',
        },
        card: {
          DEFAULT: '#111111',
          border: '#222222',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CFCFCF',
          muted: '#8A8A8A',
        },
        divider: '#2A2A2A',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '8px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(217, 161, 120, 0.3)',
        'glow-sm': '0 0 10px rgba(217, 161, 120, 0.2)',
        'glow-lg': '0 0 40px rgba(217, 161, 120, 0.4)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
        'gradient-warm': 'linear-gradient(135deg, #D9A178, #B8825A)',
        'gradient-dark': 'linear-gradient(180deg, #000000, #0A0A0A)',
        'hero-glow': 'radial-gradient(ellipse at center, rgba(217, 161, 120, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(217, 161, 120, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(217, 161, 120, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
