import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { MusicPlayerWithModal } from './MusicPlayerWithModal';
import { Track, PlaybackState } from '../types/spotify';

// Exemple d'utilisation du composant MusicPlayerWithModal
export const ExampleUsage: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  // Exemple de données de test (remplacez par vos vraies données)
  useEffect(() => {
    // Simuler des données de test
    const mockTrack: Track = {
      id: '1',
      name: 'Exemple de Chanson',
      artists: [{ name: 'Artiste Exemple' }],
      album: {
        name: 'Album Exemple',
        images: [
          {
            url: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Album'
          }
        ]
      },
      duration_ms: 210000, // 3:30
      preview_url: null,
      uri: 'spotify:track:example'
    };

    const mockPlaybackState: PlaybackState = {
      is_playing: false,
      item: mockTrack,
      progress_ms: 45000, // 0:45
      device: {
        id: 'device1',
        name: 'Mon Téléphone',
        type: 'smartphone',
        volume_percent: 75
      },
      shuffle_state: false,
      repeat_state: 'off'
    };

    setCurrentTrack(mockTrack);
    setPlaybackState(mockPlaybackState);
  }, []);

  // Handlers pour les actions de lecture
  const handlePlaylistPress = () => {
    console.log('Playlist pressed');
    // Naviguer vers la playlist ou ouvrir un modal de playlist
  };

  const handlePause = () => {
    console.log('Pause pressed');
    setPlaybackState(prev => prev ? { ...prev, is_playing: false } : null);
    // Appeler l'API Spotify pour mettre en pause
  };

  const handleResume = () => {
    console.log('Resume pressed');
    setPlaybackState(prev => prev ? { ...prev, is_playing: true } : null);
    // Appeler l'API Spotify pour reprendre la lecture
  };

  const handleNext = () => {
    console.log('Next pressed');
    // Appeler l'API Spotify pour passer à la piste suivante
  };

  const handlePrevious = () => {
    console.log('Previous pressed');
    // Appeler l'API Spotify pour revenir à la piste précédente
  };

  const handleToggleShuffle = () => {
    console.log('Shuffle toggled');
    setPlaybackState(prev => 
      prev ? { ...prev, shuffle_state: !prev.shuffle_state } : null
    );
    // Appeler l'API Spotify pour toggle shuffle
  };

  const handleToggleRepeat = () => {
    console.log('Repeat toggled');
    setPlaybackState(prev => {
      if (!prev) return null;
      
      let newRepeatState: 'off' | 'track' | 'context';
      switch (prev.repeat_state) {
        case 'off':
          newRepeatState = 'context';
          break;
        case 'context':
          newRepeatState = 'track';
          break;
        case 'track':
          newRepeatState = 'off';
          break;
        default:
          newRepeatState = 'off';
      }
      
      return { ...prev, repeat_state: newRepeatState };
    });
    // Appeler l'API Spotify pour changer le mode repeat
  };

  const handleSeek = (position: number) => {
    console.log('Seek to position:', position);
    setPlaybackState(prev => 
      prev ? { ...prev, progress_ms: position } : null
    );
    // Appeler l'API Spotify pour changer la position
  };

  const handleVolumeChange = (volume: number) => {
    console.log('Volume changed to:', volume);
    setPlaybackState(prev => 
      prev && prev.device 
        ? { ...prev, device: { ...prev.device, volume_percent: volume } }
        : null
    );
    // Appeler l'API Spotify pour changer le volume
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Votre contenu principal ici */}
      
      {/* Lecteur musical avec modal de détail */}
      <MusicPlayerWithModal
        currentTrack={currentTrack}
        playbackState={playbackState}
        onPlaylistPress={handlePlaylistPress}
        onPause={handlePause}
        onResume={handleResume}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        isInLayout={true} // ou false selon votre layout
      />
    </View>
  );
};

// Exemple d'intégration dans votre composant principal existant
export const IntegrateInExistingComponent = () => {
  // Si vous avez déjà un composant qui gère la musique,
  // remplacez simplement votre MusicPlayerCard existant par :
  
  /*
  // Ancien code :
  <MusicPlayerCard
    currentTrack={currentTrack}
    playbackState={playbackState}
    onPlaylistPress={handlePlaylistPress}
    onPause={handlePause}
    onResume={handleResume}
    onNext={handleNext}
    onPrevious={handlePrevious}
    onToggleShuffle={handleToggleShuffle}
    isInLayout={isInLayout}
  />
  
  // Nouveau code :
  <MusicPlayerWithModal
    currentTrack={currentTrack}
    playbackState={playbackState}
    onPlaylistPress={handlePlaylistPress}
    onPause={handlePause}
    onResume={handleResume}
    onNext={handleNext}
    onPrevious={handlePrevious}
    onToggleShuffle={handleToggleShuffle}
    onToggleRepeat={handleToggleRepeat} // Nouvelle prop
    onSeek={handleSeek} // Nouvelle prop optionnelle
    onVolumeChange={handleVolumeChange} // Nouvelle prop optionnelle
    isInLayout={isInLayout}
  />
  */
  
  return null;
}; 