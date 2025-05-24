import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlaybackState, Track } from '../types/spotify';
import { getRepeatIcon, getRepeatColor, getRepeatLabel } from '../utils/formatters';

interface PlayerControlsProps {
  currentTrack: Track | null;
  playbackState: PlaybackState | null;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTrack,
  playbackState,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  if (!currentTrack || !playbackState) return null;

  // Fonction pour obtenir l'icône de répétition appropriée
  const getRepeatIconName = (repeatState: string | undefined) => {
    switch (repeatState) {
      case 'track':
        return 'repeat-outline' as const;
      case 'context':
        return 'repeat' as const;
      default:
        return 'repeat-outline' as const;
    }
  };

  return (
    <View style={styles.playerSection}>
      <Text style={styles.sectionTitle}>En cours de lecture</Text>
      <View style={styles.playerCard}>
        {currentTrack.album.images?.[0] && (
          <Image 
            source={{ uri: currentTrack.album.images[0].url }} 
            style={styles.playerImage}
          />
        )}
        <View style={styles.playerInfo}>
          <Text style={styles.playerTrackName} numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text style={styles.playerArtistName} numberOfLines={1}>
            {currentTrack.artists.map(a => a.name).join(', ')}
          </Text>
          <Text style={styles.playerAlbumName} numberOfLines={1}>
            {currentTrack.album.name}
          </Text>
        </View>
      </View>
      
      {/* Contrôles de lecture */}
      <View style={styles.playerControls}>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
          <Ionicons 
            name="play-skip-back" 
            size={24} 
            color="#B3B3B3" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.playPauseButton]} 
          onPress={playbackState.is_playing ? onPause : onResume}
        >
          <Ionicons 
            name={playbackState.is_playing ? "pause" : "play"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={onNext}>
          <Ionicons 
            name="play-skip-forward" 
            size={24} 
            color="#B3B3B3" 
          />
        </TouchableOpacity>
      </View>

      {/* Contrôles supplémentaires */}
      <View style={styles.extraControls}>
        <TouchableOpacity 
          style={styles.extraControlButton} 
          onPress={onToggleShuffle}
        >
          <Ionicons
            name="shuffle"
            size={20}
            color={playbackState?.shuffle_state ? '#1DB954' : '#B3B3B3'}
          />
          <Text style={[
            styles.extraControlLabel,
            { color: playbackState?.shuffle_state ? '#1DB954' : '#B3B3B3' }
          ]}>
            Aléatoire
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.extraControlButton} 
          onPress={onToggleRepeat}
        >
          <Ionicons
            name={getRepeatIconName(playbackState?.repeat_state)}
            size={20}
            color={getRepeatColor(playbackState?.repeat_state)}
          />
          <Text style={[
            styles.extraControlLabel,
            { color: getRepeatColor(playbackState?.repeat_state) }
          ]}>
            {getRepeatLabel(playbackState?.repeat_state)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerTrackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  playerArtistName: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  playerAlbumName: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  extraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 40,
  },
  extraControlButton: {
    alignItems: 'center',
    padding: 10,
  },
  extraControlLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
}); 