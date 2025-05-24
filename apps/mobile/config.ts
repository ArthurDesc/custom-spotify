const isDev = __DEV__;

export const API_CONFIG = {
  // Pour le développement avec Expo Go, utilisez l'URL du tunnel ou votre IP locale
  BASE_URL: isDev 
    ? 'http://192.168.1.148:3000' // IP locale pour le développement mobile
    : 'https://votre-domaine-production.com',
  
  ENDPOINTS: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    SPOTIFY_TEST: '/api/spotify/test',
    SPOTIFY_SIGNIN: '/api/auth/signin/spotify',
    SPOTIFY_SESSION: '/api/auth/session',
    MOBILE_CALLBACK: '/api/auth/mobile-callback',
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 