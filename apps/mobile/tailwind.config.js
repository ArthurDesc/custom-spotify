/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        primary: {
          purple: '#6366F1',
          'dark-purple': '#4F46E5',
          'light-purple': '#8B5CF6',
        },
        
        // Couleurs de fond
        background: {
          primary: '#0F0F23',
          secondary: '#1A1A2E',
          tertiary: '#16213E',
          card: '#1E1E3F',
        },
        
        // Couleurs de texte
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          muted: '#6B7280',
          accent: '#8B5CF6',
        },
        
        // Couleurs d'état
        state: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        
        // Couleurs des boutons
        button: {
          primary: '#6366F1',
          'primary-hover': '#4F46E5',
          secondary: '#374151',
          'secondary-hover': '#4B5563',
        },
        
        // Couleurs des bordures
        border: {
          primary: '#374151',
          secondary: '#4B5563',
          accent: '#6366F1',
        },
        
        // Couleurs Spotify
        spotify: {
          green: '#1DB954',
          black: '#191414',
        }
      },
    },
  },
  plugins: [],
}

