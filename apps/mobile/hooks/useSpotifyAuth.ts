import { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';
import { SpotifyProfile } from '../types/spotify';
import { authService, profileService } from '../services';

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

export const useSpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'custom-spotify',
    path: 'auth'
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID!,
      scopes: [
        // Scopes de base
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-library-read',
        'user-library-modify',
        'user-top-read',
        'user-read-recently-played',
        'user-follow-read',
        'user-follow-modify',
        // Scopes pour Remote SDK
        'app-remote-control',
        'streaming'
      ],
      usePKCE: false,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleAuthSuccess(code);
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);
      Alert.alert('Erreur d\'authentification', response.error?.message || 'Erreur inconnue');
    }
  }, [response]);

  const handleAuthSuccess = async (code: string) => {
    try {
      setLoading(true);
      
      console.log('🔍 Code reçu:', code);
      console.log('🔍 Redirect URI utilisée:', redirectUri);
      
      const tokenData = await authService.exchangeCodeForToken(code, redirectUri);
      authService.setAccessToken(tokenData.access_token);
      
      setIsAuthenticated(true);
      await fetchUserProfile();
    } catch (error) {
      console.error('Erreur auth:', error);
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Problème de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profileData = await profileService.getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Erreur fetch profile:', error);
      Alert.alert('Erreur', 'Impossible de récupérer le profil utilisateur');
    }
  };

  const login = () => {
    promptAsync();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    authService.setAccessToken('');
  };

  return {
    isAuthenticated,
    profile,
    loading,
    login,
    logout,
    request
  };
}; 