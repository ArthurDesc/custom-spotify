import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { createProxyUrl } from '../utils/apiProxy';
import { getApiUrl } from '../utils/config';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithSpotify: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@custom_spotify_user',
  TOKEN: '@custom_spotify_token',
  SESSION: '@custom_spotify_session',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger la session au démarrage
  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const [storedUser, storedToken, storedSession] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.SESSION),
      ]);

      if (storedSession) {
        const session = JSON.parse(storedSession);
        setUser(session.user);
        console.log('✅ Session Spotify restaurée depuis le stockage');
      } else if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log('✅ Session locale restaurée depuis le stockage');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder la session
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token),
        ]);

        setUser(data.user);
        setToken(data.token);

        console.log('✅ Connexion réussie et session sauvegardée');
        return { success: true, message: 'Connexion réussie !' };
      } else {
        console.log('❌ Échec de la connexion:', data.message);
        return { success: false, message: data.message || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return { 
        success: false, 
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.' 
      };
    }
  };

  const loginWithSpotify = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const apiUrl = getApiUrl();
      const redirectUrl = 'custom-spotify://auth';
      
      // URL de callback intermédiaire qui gère la redirection vers l'app mobile
      const callbackUrl = `${apiUrl}/api/auth/mobile-callback`;
      
      // URL de connexion Spotify via NextAuth
      const authUrl = `${apiUrl}/api/auth/signin/spotify?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      
      // Utiliser le proxy pour convertir les URLs 127.0.0.1 en IP locale
      const proxiedAuthUrl = createProxyUrl(authUrl);
      const proxiedCallbackUrl = createProxyUrl(callbackUrl);
      
      console.log('🔗 Ouverture de l\'authentification Spotify:', proxiedAuthUrl);
      console.log('🔗 URL de callback:', proxiedCallbackUrl);
      console.log('🔗 URL de redirection finale:', redirectUrl);
      
      // Ouvrir le navigateur pour l'authentification OAuth
      const result = await WebBrowser.openAuthSessionAsync(proxiedAuthUrl, redirectUrl);
      
      console.log('📱 Résultat de l\'authentification:', result);
      
      if (result.type === 'success' && result.url) {
        console.log('✅ Authentification réussie, URL de retour:', result.url);
        
        // Extraire les données de session de l'URL
        const url = new URL(result.url);
        const sessionParam = url.searchParams.get('session');
        const errorParam = url.searchParams.get('error');
        
        if (errorParam) {
          console.log('❌ Erreur dans la redirection:', errorParam);
          return { success: false, message: `Erreur d'authentification: ${errorParam}` };
        }
        
        if (sessionParam) {
          try {
            // Décoder les données de session (utiliser atob pour React Native)
            const sessionData = JSON.parse(atob(sessionParam));
            console.log('✅ Données de session reçues:', {
              userId: sessionData.user?.id,
              userName: sessionData.user?.name,
              hasAccessToken: !!sessionData.accessToken
            });
            
            // Sauvegarder la session Spotify complète
            await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
            
            setUser(sessionData.user);
            
            console.log('✅ Session Spotify sauvegardée');
            return { success: true, message: 'Connexion Spotify réussie !' };
          } catch (decodeError) {
            console.error('❌ Erreur lors du décodage de la session:', decodeError);
            return { success: false, message: 'Erreur lors du traitement des données de session' };
          }
        } else {
          console.log('❌ Aucune donnée de session reçue');
          return { success: false, message: 'Aucune donnée de session reçue' };
        }
      } else if (result.type === 'cancel') {
        console.log('❌ Connexion annulée par l\'utilisateur');
        return { success: false, message: 'Connexion annulée' };
      } else {
        console.log('❌ Erreur lors de l\'authentification:', result);
        return { success: false, message: 'Erreur lors de l\'authentification' };
      }
    } catch (error) {
      console.error('❌ Erreur de connexion Spotify:', error);
      return { 
        success: false, 
        message: 'Erreur lors de la connexion Spotify. Vérifiez votre connexion.' 
      };
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION),
      ]);

      setUser(null);
      setToken(null);

      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginWithSpotify,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
} 