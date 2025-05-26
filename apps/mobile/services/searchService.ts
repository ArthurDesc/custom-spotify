import { SearchResults, Artist, Album } from '../types/spotify';
import { authService } from './authService';

class SearchService {
  // Recherche
  async search(query: string, types: string[] = ['artist', 'album', 'track'], limit: number = 20): Promise<SearchResults> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');
    if (!query.trim()) throw new Error('Query cannot be empty');

    const typeString = types.join(',');
    const encodedQuery = encodeURIComponent(query);
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=${typeString}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to search');
    return response.json();
  }

  // Obtenir les albums d'un artiste
  async getArtistAlbums(artistId: string, offset: number = 0, limit: number = 20): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch artist albums');
    return response.json();
  }

  // Obtenir les détails d'un artiste
  async getArtist(artistId: string): Promise<Artist> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch artist');
    return response.json();
  }

  // Obtenir les tracks d'un album
  async getAlbumTracks(albumId: string, offset: number = 0, limit: number = 50): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch album tracks');
    return response.json();
  }

  // Obtenir les détails d'un album
  async getAlbum(albumId: string): Promise<Album> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch album');
    return response.json();
  }
}

// Instance singleton
export const searchService = new SearchService();
export default searchService; 