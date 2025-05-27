import { useState } from 'react';
import { Alert } from 'react-native';
import { PlaybackState, Track } from '../types/spotify';
import { playerService } from '../services';
import spotifyRemoteService from '../services/spotifyRemoteService';

export const usePlayback = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [optimisticCurrentTrack, setOptimisticCurrentTrack] = useState<Track | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [iPhoneErrorCount, setIPhoneErrorCount] = useState<number>(0);

  const fetchPlaybackState = async () => {
    try {
      const data = await playerService.getPlaybackState();
      if (data) {
        setPlaybackState(data);
        setCurrentTrack(data.item);
      } else {
        setPlaybackState(null);
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('❌ [usePlayback] Erreur fetchPlaybackState:', error);
      setPlaybackState(null);
      setCurrentTrack(null);
    }
  };

  // Détection et gestion intelligente des erreurs iPhone
  const handleiPhoneError = async (error: any, operation: string) => {
    const isRestrictionError = error?.message?.includes('Restriction violated') || 
                             error?.message?.includes('appareil n\'est peut-être plus actif');
    
    if (isRestrictionError) {
      const newCount = iPhoneErrorCount + 1;
      setIPhoneErrorCount(newCount);
      
      console.log(`🚨 [usePlayback] Erreur iPhone ${newCount}/3 pour ${operation}`);
      
      // Après 3 erreurs, proposer le Computer
      if (newCount >= 3) {
        console.log(`🆘 [usePlayback] Seuil atteint, proposition Computer automatique`);
        
        Alert.alert(
          "Problème de synchronisation iPhone",
          "L'iPhone semble avoir des difficultés. Voulez-vous basculer vers l'ordinateur pour une meilleure stabilité ?",
          [
            {
              text: "Continuer iPhone",
              style: "cancel",
              onPress: () => {
                setIPhoneErrorCount(0); // Reset du compteur
              }
            },
            {
              text: "Utiliser l'ordinateur",
              style: "default",
              onPress: async () => {
                try {
                  console.log(`🖥️ [usePlayback] Basculement Computer demandé`);
                  const success = await playerService.forceUseComputerDevice();
                  if (success) {
                    setIPhoneErrorCount(0); // Reset du compteur
                    console.log(`✅ [usePlayback] Basculement Computer réussi`);
                    // Refresh de l'état après basculement
                    setTimeout(() => fetchPlaybackState(), 1000);
                  } else {
                    console.log(`❌ [usePlayback] Échec basculement Computer`);
                  }
                } catch (computerError) {
                  console.error(`❌ [usePlayback] Erreur basculement Computer:`, computerError);
                }
              }
            }
          ]
        );
        return;
      }
    }
    
    // Erreur normale, pas de gestion spéciale
    throw error;
  };

  const playTrack = async (trackUri: string, allTracks: Track[], contextUri?: string) => {
    console.log(`🎵 [usePlayback] Début playTrack: ${trackUri}`);
    console.log(`🎵 [usePlayback] Nombre total de tracks: ${allTracks.length}`);
    console.log(`🎵 [usePlayback] Context URI: ${contextUri || 'Non fourni'}`);
    
    try {
      setLoadingTrackId(trackUri);
      
      const selectedIndex = allTracks.findIndex(track => track.uri === trackUri);
      console.log(`🎵 [usePlayback] Index sélectionné: ${selectedIndex}`);
      
      if (selectedIndex === -1) {
        throw new Error('Track not found in playlist');
      }

             // Pour l'instant, utiliser la méthode simple disponible
       console.log(`🎵 [usePlayback] Lecture du track: ${trackUri}`);
       await spotifyRemoteService.playTrack(trackUri, contextUri);

      // Mise à jour optimiste de l'état
      const selectedTrack = allTracks[selectedIndex];
      setOptimisticCurrentTrack(selectedTrack);
      console.log(`✅ [usePlayback] Lecture lancée avec succès: ${selectedTrack.name}`);

      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai pour synchroniser avec Spotify
      setTimeout(() => {
        fetchPlaybackState();
      }, 1500);
      
    } catch (error) {
      console.error('❌ [usePlayback] Erreur playTrack:', error);
      
      try {
        await handleiPhoneError(error, 'playTrack');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale playTrack:', finalError);
      }
    } finally {
      setLoadingTrackId(null);
    }
  };

  const pausePlayback = async () => {
    try {
      console.log('⏸️ [usePlayback] Début pause');
      await spotifyRemoteService.pausePlayback();
      
      // Mise à jour optimiste
      if (playbackState) {
        setPlaybackState({ ...playbackState, is_playing: false });
      }
      
      console.log('✅ [usePlayback] Pause réussie');
      
      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (error) {
      console.error('❌ [usePlayback] Erreur pause:', error);
      
      try {
        await handleiPhoneError(error, 'pause');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale pause:', finalError);
      }
    }
  };

  const resumePlayback = async () => {
    try {
      console.log('▶️ [usePlayback] Début reprise');
      await spotifyRemoteService.resumePlayback();
      
      // Mise à jour optimiste
      if (playbackState) {
        setPlaybackState({ ...playbackState, is_playing: true });
      }
      
      console.log('✅ [usePlayback] Reprise réussie');
      
      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (error) {
      console.error('❌ [usePlayback] Erreur reprise:', error);
      
      try {
        await handleiPhoneError(error, 'resume');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale reprise:', finalError);
      }
    }
  };

  const skipToNext = async () => {
    try {
      console.log('⏭️ [usePlayback] Début skip next');
      await spotifyRemoteService.skipToNext();
      
      console.log('✅ [usePlayback] Skip next réussi');
      
      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai
      setTimeout(() => fetchPlaybackState(), 1500);
    } catch (error) {
      console.error('❌ [usePlayback] Erreur skip next:', error);
      
      try {
        await handleiPhoneError(error, 'skip next');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale skip next:', finalError);
      }
    }
  };

  const skipToPrevious = async () => {
    try {
      console.log('⏮️ [usePlayback] Début skip previous');
      await spotifyRemoteService.skipToPrevious();
      
      console.log('✅ [usePlayback] Skip previous réussi');
      
      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai
      setTimeout(() => fetchPlaybackState(), 1500);
    } catch (error) {
      console.error('❌ [usePlayback] Erreur skip previous:', error);
      
      try {
        await handleiPhoneError(error, 'skip previous');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale skip previous:', finalError);
      }
    }
  };

  const toggleShuffle = async () => {
    try {
      const currentShuffle = playbackState?.shuffle_state || false;
      console.log(`🔀 [usePlayback] Toggle shuffle: ${!currentShuffle}`);
      
      await spotifyRemoteService.setShuffle(!currentShuffle);
      
      // Mise à jour optimiste
      if (playbackState) {
        setPlaybackState({ ...playbackState, shuffle_state: !currentShuffle });
      }
      
      console.log('✅ [usePlayback] Toggle shuffle réussi');
      
      // Reset du compteur d'erreurs en cas de succès
      setIPhoneErrorCount(0);
      
      // Refresh de l'état après un délai
      setTimeout(() => fetchPlaybackState(), 1000);
    } catch (error) {
      console.error('❌ [usePlayback] Erreur toggle shuffle:', error);
      
      try {
        await handleiPhoneError(error, 'toggle shuffle');
      } catch (finalError) {
        console.error('❌ [usePlayback] Erreur finale toggle shuffle:', finalError);
      }
    }
  };

  // Nouvelle fonction pour vérifier le statut du Remote SDK
  const getPlaybackMethod = () => {
    return spotifyRemoteService.isRemoteConnected() ? 'Remote SDK' : 'API Web';
  };

  return {
    currentTrack: optimisticCurrentTrack || currentTrack,
    playbackState,
    loadingTrackId,
    playTrack,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    fetchPlaybackState,
    getPlaybackMethod,
    iPhoneErrorCount, // Exposer le compteur pour debug
  };
}; 