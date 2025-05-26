import { useState, useEffect, useCallback } from 'react';
import SpotifyRemoteService, { SpotifyRemoteSession, SpotifyRemoteConfig } from '../services/spotifyRemoteService';
import { deviceService } from '../services';

interface UseSpotifyRemoteReturn {
  // État
  session: SpotifyRemoteSession | null;
  isAuthenticated: boolean;
  isConnected: boolean;
  isSpotifyAppAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  devices: any[];

  // Actions
  authenticate: (config?: Partial<SpotifyRemoteConfig>) => Promise<void>;
  connectRemote: () => Promise<void>;
  disconnectRemote: () => Promise<void>;
  clearSession: () => void;
  clearError: () => void;
  loadDevices: () => Promise<void>;
  selectDevice: (deviceId: string, deviceName: string) => Promise<void>;

  // Contrôles de lecture
  playTrack: (uri: string) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setShuffle: (enabled: boolean) => Promise<void>;
  setRepeat: (mode: 'off' | 'track' | 'context') => Promise<void>;

  // Diagnostic
  runDiagnostic: () => Promise<void>;
}

export const useSpotifyRemote = (): UseSpotifyRemoteReturn => {
  const [session, setSession] = useState<SpotifyRemoteSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);

  // Vérifier si l'app Spotify est disponible
  const isSpotifyAppAvailable = SpotifyRemoteService.isSpotifyAppAvailable();

  // Initialiser l'état depuis le service
  useEffect(() => {
    const currentSession = SpotifyRemoteService.getSession();
    const currentConnectionStatus = SpotifyRemoteService.isRemoteConnected();
    
    setSession(currentSession);
    setIsConnected(currentConnectionStatus);
  }, []);

  // Charger les appareils disponibles
  const loadDevices = useCallback(async () => {
    if (!session) {
      console.log(`⚠️ [useSpotifyRemote] loadDevices - Pas de session active`);
      return;
    }
    
    const timestamp = new Date().toISOString();
    console.log(`🔍 [useSpotifyRemote] ${timestamp} - loadDevices démarré`);
    
    try {
      console.log('🔍 [useSpotifyRemote] Récupération des appareils...');
      const devicesResponse = await deviceService.getAvailableDevices();
      const devicesList = devicesResponse.devices;
      
      console.log(`📡 [useSpotifyRemote] Réponse brute deviceService:`, devicesList);
      
      // Filtrer les appareils valides (pas les anciens objets en cache)
      const validDevices = devicesList.filter((device: any) => 
        device && device.id && device.name && device.type
      );
      
      console.log(`📱 [useSpotifyRemote] Appareils avant filtrage: ${devicesList.length}`);
      console.log(`📱 [useSpotifyRemote] Appareils après filtrage: ${validDevices.length}`);
      
      setDevices(validDevices);
      
      console.log('📱 [useSpotifyRemote] Appareils valides trouvés:', validDevices.length);
      validDevices.forEach((device: any, index: number) => {
        console.log(`📱 [useSpotifyRemote] Appareil ${index + 1}: ${device.name} (${device.type}) - Actif: ${device.is_active}`);
        console.log(`  - ID: ${device.id}`);
        console.log(`  - Volume: ${device.volume_percent}%`);
        console.log(`  - Restreint: ${device.is_restricted}`);
        console.log(`  - Session privée: ${device.is_private_session}`);
      });
      
      // Si aucun appareil valide trouvé, effacer l'erreur précédente s'il y en avait une
      if (validDevices.length === 0 && error?.includes('appareils')) {
        console.log(`🧹 [useSpotifyRemote] Aucun appareil trouvé, nettoyage de l'erreur précédente`);
        setError(null);
      }
    } catch (err) {
      const timestamp2 = new Date().toISOString();
      console.error(`❌ [useSpotifyRemote] ${timestamp2} - Erreur liste appareils:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Impossible de récupérer les appareils';
      setError(errorMessage);
    }
  }, [session, error]);

  // S'assurer que la lecture est prête
  const ensurePlaybackReadiness = useCallback(async () => {
    const timestamp = new Date().toISOString();
    console.log(`🔧 [useSpotifyRemote] ${timestamp} - ensurePlaybackReadiness démarré`);
    
    try {
      console.log('🔧 [useSpotifyRemote] Vérification de la disponibilité de lecture...');
      
      // Charger les appareils pour voir s'il y en a un d'actif
      const devicesResponse = await deviceService.getAvailableDevices();
      const devices = devicesResponse.devices;
      
      console.log(`🔍 [useSpotifyRemote] Appareils trouvés pour readiness: ${devices.length}`);
      
      if (devices.length > 0) {
        const activeDevice = devices.find((device: any) => device.is_active);
        
        if (!activeDevice) {
          console.log('⚠️ [useSpotifyRemote] Aucun appareil actif, initialisation automatique...');
          await deviceService.ensureActiveDevice();
          setTimeout(() => {
            console.log(`🔄 [useSpotifyRemote] Rechargement appareils après initialisation`);
            loadDevices();
          }, 1000);
        } else {
          console.log(`✅ [useSpotifyRemote] Appareil actif trouvé: ${activeDevice.name}`);
        }
      } else {
        console.log('⚠️ [useSpotifyRemote] Aucun appareil disponible pour readiness');
      }
    } catch (err) {
      console.warn('⚠️ [useSpotifyRemote] Impossible d\'initialiser automatiquement la lecture:', err);
      // Ne pas bloquer l'authentification si ça échoue
    }
  }, [loadDevices]);

  // Sélectionner un appareil directement avec retry
  const selectDevice = useCallback(async (deviceId: string, deviceName: string) => {
    const timestamp = new Date().toISOString();
    console.log(`🔄 [useSpotifyRemote] ${timestamp} - selectDevice démarré`);
    console.log(`🔄 [useSpotifyRemote] Appareil cible: ${deviceName} (ID: ${deviceId})`);
    
    try {
      console.log(`🔄 [useSpotifyRemote] État avant transfert:`);
      console.log(`  - Session active: ${!!session}`);
      console.log(`  - Remote connecté: ${isConnected}`);
      console.log(`  - Nombre d'appareils: ${devices.length}`);
      
      // Afficher l'état actuel des appareils
      devices.forEach((device, index) => {
        console.log(`  - Appareil ${index + 1}: ${device.name} (${device.id}) - Actif: ${device.is_active}`);
      });
      
      console.log(`🔄 [useSpotifyRemote] Transfert automatique vers l'appareil: ${deviceName}`);
      
      // Vérifier que l'appareil existe toujours dans la liste avant le transfert
      const deviceExists = devices.find(d => d.id === deviceId);
      if (!deviceExists) {
        console.log(`⚠️ [useSpotifyRemote] Appareil ${deviceName} non trouvé, rechargement...`);
        await loadDevices();
        // Attendre un peu puis réessayer
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedDeviceExists = devices.find(d => d.id === deviceId);
        if (!updatedDeviceExists) {
          throw new Error(`Appareil ${deviceName} introuvable. Il se peut que Spotify ait été fermé sur cet appareil.`);
        }
      }
      
      // Essayer d'abord le transfert sécurisé avec validation
      try {
        console.log(`🛡️ [useSpotifyRemote] Tentative de transfert sécurisé...`);
        await deviceService.safeTransferPlayback(deviceId, deviceName, true);
        console.log(`✅ [useSpotifyRemote] Transfert sécurisé réussi`);
      } catch (safeTransferError) {
        console.log(`❌ [useSpotifyRemote] Échec transfert sécurisé:`, safeTransferError);
        
        // Si le transfert sécurisé échoue, fallback sur l'ancien système avec retry
        console.log(`🔄 [useSpotifyRemote] Fallback sur transfert classique avec retry...`);
        
        let transferSuccess = false;
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`🔄 [useSpotifyRemote] Tentative de transfert ${attempt}/3`);
            await deviceService.transferPlayback(deviceId, true);
            console.log(`✅ [useSpotifyRemote] Transfert réussi à la tentative ${attempt}`);
            transferSuccess = true;
            break;
          } catch (err) {
            lastError = err as Error;
            console.log(`❌ [useSpotifyRemote] Tentative ${attempt} échouée:`, err);
            
            // Gestion spécifique des erreurs 500
            if (err instanceof Error && err.message.includes('état invalide')) {
              console.log(`🚨 [useSpotifyRemote] Erreur 500 détectée - appareil en état invalide`);
              console.log(`💡 [useSpotifyRemote] Suggestion: Ouvrez l'app Spotify sur ${deviceName} et démarrez une musique manuellement`);
              
              // Pour les erreurs 500, on arrête les retries car ça ne sert à rien
              throw new Error(`Appareil ${deviceName} en état invalide. Ouvrez Spotify sur cet appareil et démarrez une musique manuellement, puis réessayez.`);
            }
            
            if (attempt < 3) {
              // Attendre avant de réessayer
              const waitTime = attempt * 1000;
              console.log(`⏳ [useSpotifyRemote] Attente ${waitTime}ms avant retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              
              // Recharger les appareils pour voir s'il y a eu des changements
              console.log(`🔄 [useSpotifyRemote] Rechargement appareils avant retry...`);
              await loadDevices();
            }
          }
        }
        
        if (!transferSuccess && lastError) {
          throw lastError;
        }
      }
      
      console.log(`✅ [useSpotifyRemote] Transfert terminé sans erreur`);
      
      // Attendre que le transfert se termine
      console.log(`⏳ [useSpotifyRemote] Attente 2s pour finalisation du transfert`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`🔍 [useSpotifyRemote] Rechargement des appareils après transfert`);
      // Recharger les appareils pour voir le changement
      setTimeout(() => {
        console.log(`🔄 [useSpotifyRemote] Déclenchement loadDevices différé`);
        loadDevices();
      }, 500);
      
    } catch (err) {
      const timestamp2 = new Date().toISOString();
      console.error(`❌ [useSpotifyRemote] ${timestamp2} - Erreur transfert appareil:`, err);
      console.error(`❌ [useSpotifyRemote] Type d'erreur:`, typeof err);
      console.error(`❌ [useSpotifyRemote] Stack trace:`, err instanceof Error ? err.stack : 'Pas de stack');
      
      const errorMessage = err instanceof Error ? err.message : 'Impossible de transférer la lecture';
      setError(errorMessage);
      
      // Recharger les appareils même en cas d'erreur pour voir l'état actuel
      setTimeout(() => {
        console.log(`🔄 [useSpotifyRemote] Rechargement appareils après erreur`);
        loadDevices();
      }, 1000);
    }
  }, [loadDevices, devices, session, isConnected]);

  // Authentification
  const authenticate = useCallback(async (config?: Partial<SpotifyRemoteConfig>) => {
    setIsLoading(true);
    setError(null);

    try {
      const defaultConfig = SpotifyRemoteService.getDefaultConfig();
      const finalConfig = { ...defaultConfig, ...config };

      const newSession = await SpotifyRemoteService.authenticate(finalConfig);
      setSession(newSession);
      
      // Connecter automatiquement le remote après authentification
      try {
        await SpotifyRemoteService.connectRemote();
        setIsConnected(true);
        
        // Charger automatiquement les appareils après connexion
        setTimeout(async () => {
          await loadDevices();
          // Tenter d'initialiser automatiquement un appareil si possible
          await ensurePlaybackReadiness();
        }, 1000);
      } catch (remoteErr) {
        console.error('Connexion remote échouée après auth:', remoteErr);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur d\'authentification inconnue';
      setError(errorMessage);
      console.error('Erreur d\'authentification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadDevices]);

  // Connexion Remote
  const connectRemote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await SpotifyRemoteService.connectRemote();
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion Remote';
      setError(errorMessage);
      console.error('Erreur de connexion Remote:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Déconnexion Remote
  const disconnectRemote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await SpotifyRemoteService.disconnectRemote();
      setIsConnected(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de déconnexion Remote';
      setError(errorMessage);
      console.error('Erreur de déconnexion Remote:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Nettoyer la session
  const clearSession = useCallback(() => {
    SpotifyRemoteService.clearSession();
    setSession(null);
    setIsConnected(false);
    setError(null);
  }, []);

  // Nettoyer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Contrôles de lecture simplifiés
  const playTrack = useCallback(async (uri: string) => {
    setError(null);
    try {
      await SpotifyRemoteService.playTrack(uri);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de lecture';
      setError(errorMessage);
      console.error('Erreur de lecture:', err);
    }
  }, []);

  const pausePlayback = useCallback(async () => {
    setError(null);
    try {
      await SpotifyRemoteService.pausePlayback();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de pause';
      setError(errorMessage);
      console.error('Erreur de pause:', err);
    }
  }, []);

  const resumePlayback = useCallback(async () => {
    setError(null);
    try {
      await SpotifyRemoteService.resumePlayback();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de reprise';
      setError(errorMessage);
      console.error('Erreur de reprise:', err);
    }
  }, []);

  const skipToNext = useCallback(async () => {
    setError(null);
    try {
      await SpotifyRemoteService.skipToNext();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de saut';
      setError(errorMessage);
      console.error('Erreur de saut:', err);
    }
  }, []);

  const skipToPrevious = useCallback(async () => {
    setError(null);
    try {
      await SpotifyRemoteService.skipToPrevious();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de saut';
      setError(errorMessage);
      console.error('Erreur de saut:', err);
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    setError(null);
    try {
      await SpotifyRemoteService.setVolume(volume);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de volume';
      setError(errorMessage);
      console.error('Erreur de volume:', err);
    }
  }, []);

  const setShuffle = useCallback(async (enabled: boolean) => {
    setError(null);
    try {
      await SpotifyRemoteService.setShuffle(enabled);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de shuffle';
      setError(errorMessage);
      console.error('Erreur de shuffle:', err);
    }
  }, []);

  const setRepeat = useCallback(async (mode: 'off' | 'track' | 'context') => {
    setError(null);
    try {
      await SpotifyRemoteService.setRepeat(mode);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de repeat';
      setError(errorMessage);
      console.error('Erreur de repeat:', err);
    }
  }, []);

  // Méthode de diagnostic pour le hook
  const runDiagnostic = useCallback(async () => {
    console.log('🔍 [useSpotifyRemote] === DIAGNOSTIC HOOK DÉMARRÉ ===');
    
    // État du hook
    console.log('📊 [useSpotifyRemote] État du hook:');
    console.log('  - session:', !!session);
    console.log('  - isAuthenticated:', !!session);
    console.log('  - isConnected:', isConnected);
    console.log('  - isSpotifyAppAvailable:', isSpotifyAppAvailable);
    console.log('  - isLoading:', isLoading);
    console.log('  - error:', error);
    console.log('  - devices.length:', devices.length);
    
    if (session) {
      console.log('🔑 [useSpotifyRemote] Session détails:');
      console.log('  - accessToken longueur:', session.accessToken.length);
      console.log('  - accessToken début:', session.accessToken.substring(0, 20) + '...');
      console.log('  - expirationDate:', new Date(session.expirationDate).toLocaleString());
      console.log('  - scopes:', session.scopes.join(', '));
      console.log('  - refreshToken:', !!session.refreshToken);
    }
    
    if (devices.length > 0) {
      console.log('📱 [useSpotifyRemote] Appareils dans le state:');
      devices.forEach((device, index) => {
        console.log(`  - Appareil ${index + 1}: ${device.name} (${device.type})`);
        console.log(`    ID: ${device.id}`);
        console.log(`    Actif: ${device.is_active}`);
        console.log(`    Volume: ${device.volume_percent}%`);
        console.log(`    Restreint: ${device.is_restricted}`);
      });
    }
    
    console.log('🔍 [useSpotifyRemote] === DIAGNOSTIC HOOK TERMINÉ ===');
  }, [session, isConnected, isSpotifyAppAvailable, isLoading, error, devices]);

  return {
    // État
    session,
    isAuthenticated: !!session,
    isConnected,
    isSpotifyAppAvailable,
    isLoading,
    error,
    devices,

    // Actions
    authenticate,
    connectRemote,
    disconnectRemote,
    clearSession,
    clearError,
    loadDevices,
    selectDevice,

    // Contrôles de lecture
    playTrack,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    setVolume,
    setShuffle,
    setRepeat,

    // Diagnostic
    runDiagnostic,
  };
}; 