import { useState } from 'react';
import { Alert } from 'react-native';
import { LikedTracksInfo, Track } from '../types/spotify';
import { playlistService } from '../services';

export const useLikedTracks = () => {
  const [likedTracksInfo, setLikedTracksInfo] = useState<LikedTracksInfo>({
    total: 0,
    tracks: [],
    hasMore: true,
    offset: 0
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchLikedTracks = async (offset: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await playlistService.getLikedTracks(offset, 50);
      const newTracks = data.items.map((item: any) => item.track).filter((track: any) => track);
      
      setLikedTracksInfo(prev => ({
        total: data.total,
        tracks: reset ? newTracks : [...prev.tracks, ...newTracks],
        hasMore: data.next !== null,
        offset: offset + newTracks.length
      }));
    } catch (error) {
      console.error('Erreur fetch liked tracks:', error);
      Alert.alert('Erreur', 'Impossible de récupérer vos titres likés');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreTracks = () => {
    if (!loadingMore && likedTracksInfo.hasMore) {
      fetchLikedTracks(likedTracksInfo.offset, false);
    }
  };

  const reset = () => {
    setLikedTracksInfo({
      total: 0,
      tracks: [],
      hasMore: true,
      offset: 0
    });
  };

  return {
    likedTracksInfo,
    loading,
    loadingMore,
    fetchLikedTracks,
    loadMoreTracks,
    reset
  };
}; 