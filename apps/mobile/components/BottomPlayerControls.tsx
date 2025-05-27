import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Track, PlaybackState } from '../types/spotify';
import { colors } from '../utils/colors';

interface BottomPlayerControlsProps {
  currentTrack: Track;
  playbackState?: PlaybackState | null;
  progressValue: number;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onAddToPlaylist?: () => void;
  onSelectDevice?: () => void;
}

export const BottomPlayerControls: React.FC<BottomPlayerControlsProps> = ({
  currentTrack,
  playbackState,
  progressValue,
  onToggleShuffle,
  onToggleRepeat,
  onAddToPlaylist,
  onSelectDevice,
}) => {
  const deviceButtonScale = useRef(new Animated.Value(1)).current;
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isShuffled = playbackState?.shuffle_state || false;
  const repeatState = playbackState?.repeat_state || 'off';

  const getRepeatIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (repeatState) {
      case 'track':
        return 'repeat';
      case 'context':
        return 'repeat';
      default:
        return 'repeat';
    }
  };

  return (
    <LinearGradient
      colors={[
        'transparent',
        `${colors.background.primary}CC`,
        `${colors.background.primary}FF`,
      ]}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        paddingBottom: 30,
        paddingTop: 15,
      }}
    >
      {/* Barre de progression */}
      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            height: 4,
            backgroundColor: `${colors.text.muted}40`,
            borderRadius: 2,
            marginBottom: 6,
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progressValue}%`,
              backgroundColor: colors.primary.purple,
              borderRadius: 2,
            }}
          />
        </View>
        
        {/* Temps */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
            {formatTime(playbackState?.progress_ms || 0)}
          </Text>
          <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
            {formatTime(currentTrack.duration_ms)}
          </Text>
        </View>
      </View>

      {/* Contrôles */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        {/* Shuffle */}
        <TouchableOpacity onPress={onToggleShuffle}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffled ? colors.primary.purple : colors.text.muted}
          />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity onPress={onToggleRepeat}>
          <Ionicons
            name={getRepeatIcon()}
            size={24}
            color={repeatState !== 'off' ? colors.primary.purple : colors.text.muted}
          />
        </TouchableOpacity>

        {/* Add to playlist */}
        <TouchableOpacity onPress={onAddToPlaylist}>
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={colors.text.primary}
          />
        </TouchableOpacity>



        {/* Select Device */}
        <TouchableOpacity 
          onPress={() => {
            console.log('🎯 [BottomPlayerControls] Clic sur bouton sélection appareil');
            
            // Animation de clic
            Animated.sequence([
              Animated.spring(deviceButtonScale, {
                toValue: 0.85,
                tension: 150,
                friction: 4,
                useNativeDriver: true,
              }),
              Animated.spring(deviceButtonScale, {
                toValue: 1,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
              }),
            ]).start();
            
            onSelectDevice?.();
          }}
        >
          <Animated.View style={{ transform: [{ scale: deviceButtonScale }] }}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color={colors.text.primary}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}; 