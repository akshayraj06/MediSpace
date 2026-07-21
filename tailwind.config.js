/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        slateBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
        heading: '#0F172A',
        subtext: '#475569',
        mutedText: '#64748B',
        pastel: {
          blueBg: '#EFF6FF',
          blueText: '#2563EB',
          greenBg: '#DCFCE7',
          greenText: '#16A34A',
          purpleBg: '#F3E8FF',
          purpleText: '#9333EA',
          orangeBg: '#FFEDD5',
          orangeText: '#EA580C',
          pinkBg: '#FCE7F3',
          pinkText: '#DB2777',
          cyanBg: '#E0F2FE',
          cyanText: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(37, 99, 235, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -5px rgba(37, 99, 235, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'btn': '0 4px 14px 0 rgba(37, 99, 235, 0.35)',
      }
    },
  },
  plugins: [],
}
