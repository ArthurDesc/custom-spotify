import { useState } from 'react';
import { Alert } from 'react-native';
import { PlaylistDetailInfo, Playlist } from '../types/spotify';
import { playlistService } from '../services';

export const usePlaylistDetail = () => {
  const [playlistDetailInfo, setPlaylistDetailInfo] = useState<PlaylistDetailInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPlaylistTracks = async (playlistId: string, offset: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Récupérer les détails de la playlist et ses tracks
      const [playlistData, tracksData] = await Promise.all([
        playlistService.getPlaylist(playlistId),
        playlistService.getPlaylistTracks(playlistId, offset, 50)
      ]);

      const newTracks = tracksData.items
        .map((item: any) => item.track)
        .filter((track: any) => track && track.id); // Filtrer les tracks nulles ou invalides
      
      setPlaylistDetailInfo(prev => {
        if (reset || !prev) {
          return {
            playlist: playlistData,
            tracks: newTracks,
            hasMore: tracksData.next !== null,
            offset: offset + newTracks.length
          };
        } else {
          return {
            ...prev,
            tracks: [...prev.tracks, ...newTracks],
            hasMore: tracksData.next !== null,
            offset: offset + newTracks.length
          };
        }
      });
    } catch (error) {
      console.error('Erreur fetch playlist tracks:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les titres de la playlist');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreTracks = () => {
    if (!loadingMore && playlistDetailInfo?.hasMore && playlistDetailInfo.playlist) {
      fetchPlaylistTracks(playlistDetailInfo.playlist.id, playlistDetailInfo.offset, false);
    }
  };

  const reset = () => {
    setPlaylistDetailInfo(null);
  };

  return {
    playlistDetailInfo,
    loading,
    loadingMore,
    fetchPlaylistTracks,
    loadMoreTracks,
    reset
  };
}; 