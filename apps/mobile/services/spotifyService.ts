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