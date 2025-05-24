export const colors = {
  // Couleurs principales
  primary: {
    purple: '#6366F1', // Violet principal
    darkPurple: '#4F46E5', // Violet foncé
    lightPurple: '#8B5CF6', // Violet clair
  },
  
  // Couleurs de fond
  background: {
    primary: '#0F0F23', // Noir/bleu très foncé
    secondary: '#1A1A2E', // Noir/bleu foncé
    tertiary: '#16213E', // Bleu foncé
    card: '#1E1E3F', // Fond des cartes
  },
  
  // Couleurs de texte
  text: {
    primary: '#FFFFFF', // Blanc
    secondary: '#B3B3B3', // Gris clair
    muted: '#6B7280', // Gris moyen
    accent: '#8B5CF6', // Violet pour les accents
  },
  
  // Couleurs d'état
  state: {
    success: '#10B981', // Vert
    warning: '#F59E0B', // Orange
    error: '#EF4444', // Rouge
    info: '#3B82F6', // Bleu
  },
  
  // Couleurs des boutons
  button: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#374151',
    secondaryHover: '#4B5563',
    ghost: 'transparent',
  },
  
  // Couleurs des bordures
  border: {
    primary: '#374151',
    secondary: '#4B5563',
    accent: '#6366F1',
  },
  
  // Couleurs spécifiques Spotify (pour compatibilité)
  spotify: {
    green: '#1DB954',
    black: '#191414',
  }
};

// Types pour TypeScript
export type ColorPalette = typeof colors;
export type ColorCategory = keyof ColorPalette;
export type ColorShade<T extends ColorCategory> = keyof ColorPalette[T]; 