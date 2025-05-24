import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlaybackState, Track } from '../types/spotify';
import { getRepeatIcon, getRepeatColor, getRepeatLabel } from '../utils/formatters';
import { colors } from '../utils/colors';

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


};

const styles = StyleSheet.create({
  playerSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerCard: {
    flexDirection: 'row',
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
    marginBottom: 5,
  },
  playerArtistName: {
    fontSize: 14,
    marginBottom: 5,
  },
  playerAlbumName: {
    fontSize: 12,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
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