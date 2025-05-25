import { useState, useEffect, useCallback } from 'react';
import SpotifyRemoteService, { SpotifyRemoteSession, SpotifyRemoteConfig } from '../services/spotifyRemoteService';

interface UseSpotifyRemoteReturn {
  // État
  session: SpotifyRemoteSession | null;
  isAuthenticated: boolean;
  isConnected: boolean;
  isSpotifyAppAvailable: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  authenticate: (config?: Partial<SpotifyRemoteConfig>) => Promise<void>;
  connectRemote: () => Promise<void>;
  disconnectRemote: () => Promise<void>;
  clearSession: () => void;
  clearError: () => void;

  // Contrôles de lecture
  playTrack: (uri: string) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setShuffle: (enabled: boolean) => Promise<void>;
  setRepeat: (mode: 'off' | 'track' | 'context') => Promise<void>;
}

export const useSpotifyRemote = (): UseSpotifyRemoteReturn => {
  const [session, setSession] = useState<SpotifyRemoteSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'app Spotify est disponible
  const isSpotifyAppAvailable = SpotifyRemoteService.isSpotifyAppAvailable();

  // Initialiser l'état depuis le service
  useEffect(() => {
    const currentSession = SpotifyRemoteService.getSession();
    const currentConnectionStatus = SpotifyRemoteService.isRemoteConnected();
    
    setSession(currentSession);
    setIsConnected(currentConnectionStatus);
  }, []);

  // Authentification
  const authenticate = useCallback(async (config?: Partial<SpotifyRemoteConfig>) => {
    setIsLoading(true);
    setError(null);

    try {
      const defaultConfig = SpotifyRemoteService.getDefaultConfig();
      const finalConfig = { ...defaultConfig, ...config };

      const newSession = await SpotifyRemoteService.authenticate(finalConfig);
      setSession(newSession);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur d\'authentification inconnue';
      setError(errorMessage);
      console.error('Erreur d\'authentification:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return {
    // État
    session,
    isAuthenticated: !!session,
    isConnected,
    isSpotifyAppAvailable,
    isLoading,
    error,

    // Actions
    authenticate,
    connectRemote,
    disconnectRemote,
    clearSession,
    clearError,

    // Contrôles de lecture
    playTrack,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    setVolume,
    setShuffle,
    setRepeat,
  };
}; 