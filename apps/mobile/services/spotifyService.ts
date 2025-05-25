import { SpotifyProfile, Track, PlaybackState, LikedTracksInfo, AuthTokens } from '../types/spotify';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

class SpotifyService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Authentification
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<AuthTokens> {
    const response = await fetch(`${API_URL}/api/spotify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Invalid response', raw: errorText };
      }
      throw new Error(errorData.error || 'Échec de l\'authentification');
    }

    return response.json();
  }

  // Profil utilisateur
  async getUserProfile(): Promise<SpotifyProfile> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  // Titres likés
  async getLikedTracks(offset: number = 0, limit: number = 50): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch liked tracks');
    return response.json();
  }

  // Playlists de l'utilisateur
  async getPlaylists(limit: number = 50): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlists');
    const data = await response.json();
    
    // L'API Spotify retourne déjà les playlists triées par activité récente
    // Nous gardons cet ordre par défaut
    return data;
  }

  // État de lecture
  async getPlaybackState(): Promise<PlaybackState | null> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Failed to fetch playback state');
    return response.json();
  }

  // Contrôles de lecture
  async playTracks(uris: string[], offset?: { position: number }): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const body: any = { uris };
    if (offset) body.offset = offset;

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to play tracks');
    }
  }

  async pausePlayback(): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to pause playback');
    }
  }

  async resumePlayback(): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to resume playback');
    }
  }

  async skipToNext(): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to skip to next');
    }
  }

  async skipToPrevious(): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to skip to previous');
    }
  }

  async setShuffle(state: boolean): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set shuffle');
    }
  }

  async setRepeat(state: 'off' | 'track' | 'context'): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set repeat');
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set volume');
    }
  }

  // Obtenir les appareils disponibles
  async getAvailableDevices(): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
  }

  // Transférer la lecture vers un appareil
  async transferPlayback(deviceId: string, play: boolean = true): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: play,
      }),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to transfer playback');
    }
  }

  // Méthode améliorée pour jouer des pistes avec gestion automatique des appareils
  async playTracksWithDeviceCheck(uris: string[], offset?: { position: number }): Promise<void> {
    if (!this.accessToken) throw new Error('No access token');

    try {
      // Essayer de jouer directement d'abord
      await this.playTracks(uris, offset);
    } catch (error) {
      console.log('🔍 Échec de lecture directe, vérification des appareils...');
      
      // Si ça échoue, vérifier les appareils disponibles
      const devicesResponse = await this.getAvailableDevices();
      const devices = devicesResponse.devices;
      
      console.log('📱 Appareils trouvés:', devices.length);
      devices.forEach((device: any, index: number) => {
        console.log(`📱 Appareil ${index + 1}: ${device.name} (${device.type}) - Actif: ${device.is_active}`);
      });

      if (devices.length === 0) {
        throw new Error('Aucun appareil Spotify trouvé. Assurez-vous que Spotify est ouvert sur un appareil.');
      }

      // Chercher un appareil actif
      let activeDevice = devices.find((device: any) => device.is_active);
      
      if (!activeDevice) {
        // Si aucun appareil actif, prendre le premier disponible
        activeDevice = devices[0];
        console.log(`🔄 Transfert vers l'appareil: ${activeDevice.name}`);
        
        // Transférer la lecture vers cet appareil
        await this.transferPlayback(activeDevice.id, false);
        
        // Attendre un peu que le transfert se fasse
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`🎵 Tentative de lecture sur: ${activeDevice.name}`);
      
      // Réessayer de jouer
      await this.playTracks(uris, offset);
    }
  }

  // Détails d'une playlist
  async getPlaylist(playlistId: string): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlist');
    return response.json();
  }

  // Tracks d'une playlist
  async getPlaylistTracks(playlistId: string, offset: number = 0, limit: number = 50): Promise<any> {
    if (!this.accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlist tracks');
    return response.json();
  }
}

// Instance singleton
export const spotifyService = new SpotifyService();
export default spotifyService; 