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
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
          dark: '#d97706',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
        },
        secondary: {
          DEFAULT: '#262626',
          foreground: '#e5e5e5',
        },
        background: {
          DEFAULT: '#171717',
          secondary: '#1a1a1a',
          tertiary: '#262626',
        },
        foreground: '#e5e5e5',
        card: {
          DEFAULT: '#262626',
          solid: '#262626',
          border: '#404040',
          foreground: '#e5e5e5',
        },
        text: {
          primary: '#e5e5e5',
          secondary: '#a3a3a3',
          muted: '#737373',
        },
        divider: '#404040',
        border: '#404040',
        input: '#404040',
        ring: '#f59e0b',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        glow: '0 0 30px rgba(245, 158, 11, 0.2)',
        'glow-sm': '0 0 15px rgba(245, 158, 11, 0.15)',
        'glow-lg': '0 0 60px rgba(245, 158, 11, 0.3)',
        'glow-accent': '0 0 30px rgba(245, 158, 11, 0.2)',
        card: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'gradient-warm': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        'gradient-dark': 'linear-gradient(180deg, #171717, #1a1a1a)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(245, 158, 11, 0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(245, 158, 11, 0.04) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245, 158, 11, 0.03) 0px, transparent 50%)',
        'hero-glow': 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 40%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 0 50px rgba(245, 158, 11, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
