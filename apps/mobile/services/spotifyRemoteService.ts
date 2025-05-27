import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { SpotifyProfile, Track, PlaybackState, AuthTokens } from '../types/spotify';
import { authService } from './authService';
import { playerService } from './playerService';
import { deviceService } from './deviceService';

export interface SpotifyRemoteSession {
  accessToken: string;
  refreshToken: string | null;
  expirationDate: number;
  scopes: string[];
}

export interface SpotifyRemoteConfig {
  scopes: string[];
  tokenSwapURL?: string;
  tokenRefreshURL?: string;
}

class SpotifyRemoteService {
  private session: SpotifyRemoteSession | null = null;
  private isConnected: boolean = false;

  // Vérifier si l'app Spotify est installée (simulation)
  isSpotifyAppAvailable(): boolean {
    // Pour l'instant, on assume que Spotify est disponible
    // Dans une vraie implémentation, on pourrait vérifier avec Linking.canOpenURL
    return true;
  }

  // Authentification avec l'API backend existante ou utilisation d'un token existant
  async authenticate(config?: SpotifyRemoteConfig): Promise<SpotifyRemoteSession> {
    try {
      // Vérifier d'abord si on a déjà un token valide via authService
      const existingToken = authService.getAccessToken();
      
      if (existingToken) {
        console.log('🔍 Token existant trouvé, réutilisation...');
        
        // Créer une session avec le token existant
        this.session = {
          accessToken: existingToken,
          refreshToken: null,
          expirationDate: Date.now() + (3600 * 1000), // 1 heure par défaut
          scopes: config?.scopes || this.getDefaultConfig().scopes,
        };
        
        console.log('✅ Authentification réussie avec token existant !');
        console.log('🔍 Token réutilisé:', this.session.accessToken.substring(0, 20) + '...');
        return this.session;
      }
      
      // Si pas de token existant, procéder à l'authentification normale
      const defaultConfig = this.getDefaultConfig();
      const finalConfig = { ...defaultConfig, ...config };
      
      // Configuration Spotify - utiliser la même méthode que l'auth existante
      const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'custom-spotify',
        path: 'auth'
      });
      
      console.log('🔍 Client ID:', clientId);
      console.log('🔍 Redirect URI utilisée:', redirectUri);
      
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(finalConfig.scopes.join(' '))}`;

      console.log('🔐 Ouverture de l\'authentification Spotify (sans PKCE)...');
      
      // Ouvrir l'authentification dans le navigateur
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        console.log('🔍 Code reçu:', code?.substring(0, 50) + '...');
        
        if (code) {
          // Échanger le code contre un token via l'API backend existante
          const tokenResponse = await this.exchangeCodeForToken(code, redirectUri);
          
          this.session = {
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token || null,
            expirationDate: Date.now() + (tokenResponse.expires_in * 1000),
            scopes: finalConfig.scopes,
          };
          
          // Configurer le authService avec le nouveau token
          authService.setAccessToken(tokenResponse.access_token);
          
          console.log('✅ Authentification réussie !');
          console.log('🔍 Token reçu:', this.session.accessToken.substring(0, 20) + '...');
          console.log('🔧 SpotifyService configuré avec le nouveau token');
          return this.session;
        }
      }
      
      throw new Error('Authentification annulée ou échouée');
    } catch (error) {
      console.error('❌ Erreur d\'authentification Spotify Remote:', error);
      throw error;
    }
  }

  // Échanger le code d'autorisation contre un token via l'API backend existante
  private async exchangeCodeForToken(code: string, redirectUri: string) {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    
    console.log('🔄 Échange du code contre un token via API backend...');
    
    // Utiliser l'endpoint existant qui gère déjà l'échange de tokens
    const response = await fetch(`${API_URL}/api/spotify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code, 
        redirectUri
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur échange token:', response.status, errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Invalid response', raw: errorText };
      }
      throw new Error(errorData.error || `Échec de l'échange de token: ${response.status}`);
    }

    const tokenData = await response.json();
    console.log('✅ Token échangé avec succès via API backend');
    return tokenData;
  }

  // Obtenir la session actuelle
  getSession(): SpotifyRemoteSession | null {
    return this.session;
  }

  // Vérifier si connecté
  isRemoteConnected(): boolean {
    return this.isConnected;
  }

  // Configuration par défaut avec les scopes nécessaires pour le Remote SDK
  getDefaultConfig(): SpotifyRemoteConfig {
    return {
      scopes: [
        'app-remote-control',
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-read-currently-playing',
        'streaming',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-library-read',
        'user-library-modify',
        'user-follow-read',
        'user-follow-modify',
        'user-top-read',
        'user-read-recently-played'
      ]
    };
  }

  // Connexion Remote (simulation + tentative de deep linking)
  async connectRemote(): Promise<void> {
    if (!this.session) {
      throw new Error('Aucune session d\'authentification. Veuillez vous authentifier d\'abord.');
    }

    try {
      // Tenter d'ouvrir Spotify avec un deep link
      const spotifyUrl = 'spotify://';
      const canOpen = await Linking.canOpenURL(spotifyUrl);
      
      if (canOpen) {
        console.log('🎵 Ouverture de Spotify...');
        await Linking.openURL(spotifyUrl);
        
        // Attendre un peu pour que Spotify s'ouvre
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      this.isConnected = true;
      console.log('✅ Connexion Remote établie (utilise maintenant l\'API Web Spotify)');
    } catch (error) {
      console.error('❌ Erreur de connexion Remote:', error);
      throw error;
    }
  }

  async disconnectRemote(): Promise<void> {
    try {
      this.isConnected = false;
      console.log('✅ Déconnexion Remote');
    } catch (error) {
      console.error('❌ Erreur de déconnexion Remote:', error);
      throw error;
    }
  }

  // Contrôles de lecture avec l'API Web Spotify et gestion automatique des appareils
  async playTrack(uri: string, contextUri?: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log(`🎵 Lecture via API Web Spotify: ${uri}`);
      console.log(`🎵 Context URI: ${contextUri}`);
      
      // Utiliser deviceService avec gestion automatique des appareils
      await deviceService.playTracksWithDeviceCheck([uri], { position: 0 }, contextUri);
      
      console.log(`✅ Lecture lancée via API Web Spotify: ${uri}`);
      
      // Tenter aussi le deep link en parallèle
      try {
        const spotifyUrl = `spotify:track:${uri.split(':').pop()}`;
        const canOpen = await Linking.canOpenURL(spotifyUrl);
        if (canOpen) {
          await Linking.openURL(spotifyUrl);
          console.log(`🔗 Deep link ouvert: ${spotifyUrl}`);
        }
      } catch (deepLinkError) {
        console.log('⚠️ Deep link échoué, mais API Web fonctionne');
      }
    } catch (error) {
      console.error(`❌ Erreur lecture: ${error}`);
      throw error;
    }
  }

  async pausePlayback(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log('⏸️ Pause via API Web Spotify');
      await playerService.pausePlayback();
      console.log('✅ Pause réussie');
    } catch (error) {
      console.error(`❌ Erreur pause: ${error}`);
      throw error;
    }
  }

  async resumePlayback(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log('▶️ Reprise via API Web Spotify');
      await playerService.resumePlayback();
      console.log('✅ Reprise réussie');
    } catch (error) {
      console.error(`❌ Erreur reprise: ${error}`);
      throw error;
    }
  }

  async skipToNext(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log('⏭️ Piste suivante via API Web Spotify');
      await playerService.skipToNext();
      console.log('✅ Piste suivante réussie');
    } catch (error) {
      console.error(`❌ Erreur piste suivante: ${error}`);
      throw error;
    }
  }

  async skipToPrevious(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log('⏮️ Piste précédente via API Web Spotify');
      await playerService.skipToPrevious();
      console.log('✅ Piste précédente réussie');
    } catch (error) {
      console.error(`❌ Erreur piste précédente: ${error}`);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log(`🔊 Volume via API Web Spotify: ${volume}%`);
      await playerService.setVolume(volume);
      console.log(`✅ Volume réglé: ${volume}%`);
    } catch (error) {
      console.error(`❌ Erreur volume: ${error}`);
      throw error;
    }
  }

  async setShuffle(enabled: boolean): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log(`🔀 Shuffle via API Web Spotify: ${enabled ? 'ON' : 'OFF'}`);
      await playerService.setShuffle(enabled);
      console.log(`✅ Shuffle réglé: ${enabled ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error(`❌ Erreur shuffle: ${error}`);
      throw error;
    }
  }

  async setRepeat(mode: 'off' | 'track' | 'context'): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Remote non connecté');
    }
    
    try {
      console.log(`🔁 Repeat via API Web Spotify: ${mode}`);
      await playerService.setRepeat(mode);
      console.log(`✅ Repeat réglé: ${mode}`);
    } catch (error) {
      console.error(`❌ Erreur repeat: ${error}`);
      throw error;
    }
  }

  // Méthode pour nettoyer la session
  clearSession(): void {
    this.session = null;
    this.isConnected = false;
  }
}

export default new SpotifyRemoteService(); 