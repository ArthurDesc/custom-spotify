import { useState, useCallback } from 'react';
import { PlaylistsInfo, Playlist } from '../types/spotify';
import spotifyService from '../services/spotifyService';

export const usePlaylists = () => {
  const [playlistsInfo, setPlaylistsInfo] = useState<PlaylistsInfo>({
    total: 0,
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await spotifyService.getPlaylists(50);
      
      setPlaylistsInfo({
        total: response.total,
        playlists: response.items || [],
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des playlists:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlaylistsInfo({
      total: 0,
      playlists: [],
    });
    setError(null);
  }, []);

  return {
    playlistsInfo,
    loading,
    error,
    fetchPlaylists,
    reset,
  };
}; 