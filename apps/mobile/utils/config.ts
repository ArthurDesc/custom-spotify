/**
 * Configuration pour différents environnements de développement
 * Permet de basculer facilement entre localhost, tunnel Expo, ngrok, etc.
 */

export type EnvironmentType = 'localhost' | 'tunnel' | 'ngrok' | 'local-ip';

interface EnvironmentConfig {
  apiUrl: string;
  description: string;
  recommended: boolean;
  requirements?: string[];
}

const ENVIRONMENTS: Record<EnvironmentType, EnvironmentConfig> = {
  localhost: {
    apiUrl: 'http://localhost:3000',
    description: 'Développement local standard',
    recommended: true,
    requirements: ['Serveur Next.js sur localhost:3000']
  },
  tunnel: {
    apiUrl: '', // Sera défini dynamiquement par Expo
    description: 'Tunnel Expo avec HTTPS',
    recommended: false,
    requirements: ['expo start --tunnel']
  },
  ngrok: {
    apiUrl: '', // À définir manuellement
    description: 'Tunnel ngrok avec HTTPS',
    recommended: false,
    requirements: ['ngrok http 3000', 'URL ngrok dans .env']
  },
  'local-ip': {
    apiUrl: 'http://192.168.1.148:3000',
    description: 'IP locale du réseau',
    recommended: false,
    requirements: ['Serveur accessible sur le réseau local']
  }
};

/**
 * Obtient l'URL de l'API selon l'environnement configuré
 */
export function getApiUrl(): string {
  // Priorité : variable d'environnement > localhost par défaut
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envApiUrl) {
    console.log('🔧 Utilisation de l\'URL API depuis .env:', envApiUrl);
    return envApiUrl;
  }
  
  // Fallback vers localhost
  const defaultUrl = ENVIRONMENTS.localhost.apiUrl;
  console.log('🔧 Utilisation de l\'URL API par défaut:', defaultUrl);
  return defaultUrl;
}

/**
 * Obtient la configuration pour un environnement spécifique
 */
export function getEnvironmentConfig(env: EnvironmentType): EnvironmentConfig {
  return ENVIRONMENTS[env];
}

/**
 * Liste tous les environnements disponibles
 */
export function getAllEnvironments(): Array<{ type: EnvironmentType; config: EnvironmentConfig }> {
  return Object.entries(ENVIRONMENTS).map(([type, config]) => ({
    type: type as EnvironmentType,
    config
  }));
}

/**
 * Valide si une URL est accessible
 */
export async function validateApiUrl(url: string): Promise<boolean> {
  try {
    // Utiliser AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('⚠️ URL API non accessible:', url, error);
    return false;
  }
}