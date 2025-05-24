import { useState } from 'react';
import { Alert } from 'react-native';
import { PlaybackState, Track } from '../types/spotify';
import spotifyService from '../services/spotifyService';

export const usePlayback = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [optimisticCurrentTrack, setOptimisticCurrentTrack] = useState<Track | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  const fetchPlaybackState = async () => {
    try {
      const data = await spotifyService.getPlaybackState();
      if (data) {
        setPlaybackState(data);
        setCurrentTrack(data.item);
        // Synchroniser l'optimistic update avec la vraie donnée
        setOptimisticCurrentTrack(null);
      }
    } catch (error) {
      console.error('Erreur fetch playback:', error);
    }
  };

  const playTrack = async (trackUri: string, allTracks: Track[]) => {
    try {
      // Trouver l'index du titre sélectionné
      const selectedIndex = allTracks.findIndex(track => track.uri === trackUri);
      
      if (selectedIndex === -1) {
        Alert.alert('Erreur', 'Titre non trouvé dans la playlist');
        return;
      }

      const selectedTrack = allTracks[selectedIndex];
      
      // 🚀 OPTIMISTIC UPDATE : Mettre à jour l'UI immédiatement
      setOptimisticCurrentTrack(selectedTrack);
      setLoadingTrackId(selectedTrack.id);

      // Sauvegarder l'état shuffle actuel
      const wasShuffleOn = playbackState?.shuffle_state || false;
      
      // Si le shuffle est activé, on doit d'abord le désactiver temporairement
      if (wasShuffleOn) {
        await spotifyService.setShuffle(false);
        // Petit délai pour que Spotify traite la commande
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Créer la liste des URIs à partir du titre sélectionné
      const urisFromSelected = allTracks.slice(selectedIndex).map(track => track.uri);
      
      await spotifyService.playTracks(urisFromSelected, { position: 0 });
      
      // Si le shuffle était activé, le réactiver après un délai
      if (wasShuffleOn) {
        setTimeout(async () => {
          await spotifyService.setShuffle(true);
        }, 1000);
      }
      
      // Récupérer le nouvel état après un délai
      setTimeout(() => {
        fetchPlaybackState();
        setLoadingTrackId(null);
      }, 1000);
    } catch (error) {
      console.error('Erreur play track:', error);
      // En cas d'erreur, annuler l'optimistic update
      setOptimisticCurrentTrack(null);
      setLoadingTrackId(null);
      Alert.alert('Erreur', 'Problème lors de la lecture');
    }
  };

  const pausePlayback = async () => {
    try {
      await spotifyService.pausePlayback();
      setTimeout(() => fetchPlaybackState(), 500);
    } catch (error) {
      console.error('Erreur pause:', error);
    }
  };

  const resumePlayback = async () => {
    try {
      await spotifyService.resumePlayback();
      setTimeout(() => fetchPlaybackState(), 500);
    } catch (error) {
      console.error('Erreur resume:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await spotifyService.skipToNext();
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (error) {
      console.error('Erreur skip:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await spotifyService.skipToPrevious();
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (error) {
      console.error('Erreur previous:', error);
    }
  };

  const toggleShuffle = async () => {
    if (!playbackState) return;
    
    try {
      const newShuffleState = !playbackState.shuffle_state;
      await spotifyService.setShuffle(newShuffleState);
      setTimeout(() => fetchPlaybackState(), 500);
    } catch (error) {
      console.error('Erreur toggle shuffle:', error);
    }
  };

  const toggleRepeat = async () => {
    if (!playbackState) return;
    
    try {
      let newRepeatState: 'off' | 'track' | 'context';
      
      switch (playbackState.repeat_state) {
        case 'off':
          newRepeatState = 'context'; // Répéter la playlist
          break;
        case 'context':
          newRepeatState = 'track'; // Répéter le titre
          break;
        case 'track':
          newRepeatState = 'off'; // Arrêter la répétition
          break;
        default:
          newRepeatState = 'off';
      }
      
      await spotifyService.setRepeat(newRepeatState);
      setTimeout(() => fetchPlaybackState(), 500);
    } catch (error) {
      console.error('Erreur toggle repeat:', error);
    }
  };

  // Fonction helper pour déterminer le titre actuellement "actif" (optimistic ou réel)
  const getDisplayCurrentTrack = () => {
    return optimisticCurrentTrack || currentTrack;
  };

  const reset = () => {
    setCurrentTrack(null);
    setOptimisticCurrentTrack(null);
    setLoadingTrackId(null);
    setPlaybackState(null);
  };

  return {
    currentTrack,
    optimisticCurrentTrack,
    loadingTrackId,
    playbackState,
    fetchPlaybackState,
    playTrack,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
    getDisplayCurrentTrack,
    reset
  };
}; 