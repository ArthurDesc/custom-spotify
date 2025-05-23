const isDev = __DEV__;

export const API_CONFIG = {
  // Pour le développement avec Expo Go, utilisez l'URL du tunnel ou votre IP locale
  BASE_URL: isDev 
    ? 'http://10.10.31.140:3000' // Votre IP locale actuelle
    : 'https://votre-domaine-production.com',
  
  ENDPOINTS: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 