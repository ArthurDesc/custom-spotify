import { authService } from './authService';

class PlaylistService {
  // Titres likés
  async getLikedTracks(offset: number = 0, limit: number = 50): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch liked tracks');
    return response.json();
  }

  // Playlists de l'utilisateur
  async getPlaylists(limit: number = 50): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlists');
    const data = await response.json();
    
    // L'API Spotify retourne déjà les playlists triées par activité récente
    // Nous gardons cet ordre par défaut
    return data;
  }

  // Détails d'une playlist
  async getPlaylist(playlistId: string): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlist');
    return response.json();
  }

  // Tracks d'une playlist
  async getPlaylistTracks(playlistId: string, offset: number = 0, limit: number = 50): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlist tracks');
    return response.json();
  }
}

// Instance singleton
export const playlistService = new PlaylistService();
export default playlistService; 