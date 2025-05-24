import { colors } from './colors';

export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getRepeatIcon = (repeatState?: 'off' | 'track' | 'context'): string => {
  switch (repeatState) {
    case 'track':
      return '🔂'; // Répéter le titre
    case 'context':
      return '🔁'; // Répéter la playlist
    default:
      return '🔁'; // Pas de répétition (icône grisée)
  }
};

export const getRepeatColor = (repeatState?: 'off' | 'track' | 'context'): string => {
  switch (repeatState) {
    case 'track':
    case 'context':
      return colors.primary.purple; // Violet quand activé
    default:
      return colors.text.secondary; // Gris quand désactivé
  }
};

export const getRepeatLabel = (repeatState?: 'off' | 'track' | 'context'): string => {
  switch (repeatState) {
    case 'track':
      return 'Répéter 1';
    case 'context':
      return 'Répéter';
    default:
      return 'Répéter';
  }
}; 