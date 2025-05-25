import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '../utils/colors';
import { Track, PlaybackState } from '../types/spotify';

interface MusicDetailModalProps {
  visible: boolean;
  onClose: () => void;
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MusicDetailModal: React.FC<MusicDetailModalProps> = ({
  visible,
  onClose,
  currentTrack,
  playbackState,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onVolumeChange,
}) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [progressValue, setProgressValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const isPlaying = playbackState?.is_playing || false;
  const isShuffled = playbackState?.shuffle_state || false;
  const repeatState = playbackState?.repeat_state || 'off';

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (playbackState && currentTrack && !isDragging) {
      const progress = (playbackState.progress_ms / currentTrack.duration_ms) * 100;
      setProgressValue(progress);
    }
  }, [playbackState, currentTrack, isDragging]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number) => {
    setProgressValue(value);
    if (currentTrack && onSeek) {
      const position = (value / 100) * currentTrack.duration_ms;
      onSeek(position);
    }
  };

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

  const getRepeatColor = () => {
    return repeatState !== 'off' ? colors.primary.purple : colors.text.secondary;
  };

  if (!currentTrack) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Background avec image floue */}
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {currentTrack.album.images?.[0]?.url ? (
            <Image
              source={{ uri: currentTrack.album.images[0].url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[colors.primary.purple, colors.background.primary]}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          <BlurView
            intensity={80}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: Platform.OS === 'ios' ? 60 : 40,
              paddingBottom: 20,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-down" size={28} color={colors.text.primary} />
            </TouchableOpacity>
            
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              En cours de lecture
            </Text>
            
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Image de l'album */}
          <View style={{ alignItems: 'center', paddingHorizontal: 40, marginBottom: 40 }}>
            <View
              style={{
                width: screenWidth - 80,
                height: screenWidth - 80,
                borderRadius: 20,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.3,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              {currentTrack.album.images?.[0]?.url ? (
                <Image
                  source={{ uri: currentTrack.album.images[0].url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: colors.text.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="musical-notes" size={80} color={colors.background.primary} />
                </View>
              )}
            </View>
          </View>

          {/* Informations de la piste */}
          <View style={{ paddingHorizontal: 30, marginBottom: 30 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 8,
              }}
              numberOfLines={2}
            >
              {currentTrack.name}
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 18,
                textAlign: 'center',
                marginBottom: 8,
              }}
              numberOfLines={1}
            >
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 16,
                textAlign: 'center',
              }}
              numberOfLines={1}
            >
              {currentTrack.album.name}
            </Text>
          </View>

          {/* Barre de progression */}
          <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
            <View
              style={{
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 2,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progressValue}%`,
                  backgroundColor: colors.text.primary,
                  borderRadius: 2,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                {formatTime(playbackState?.progress_ms || 0)}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                {formatTime(currentTrack.duration_ms)}
              </Text>
            </View>
          </View>

          {/* Contrôles principaux */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 40,
              marginBottom: 30,
            }}
          >
            {/* Shuffle */}
            <TouchableOpacity onPress={onToggleShuffle}>
              <Ionicons
                name="shuffle"
                size={24}
                color={isShuffled ? colors.primary.purple : colors.text.secondary}
              />
            </TouchableOpacity>

            {/* Précédent */}
            <TouchableOpacity onPress={onPrevious}>
              <Ionicons name="play-skip-back" size={32} color={colors.text.primary} />
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={onPlayPause}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: colors.text.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color={colors.background.primary}
                style={{ marginLeft: isPlaying ? 0 : 3 }}
              />
            </TouchableOpacity>

            {/* Suivant */}
            <TouchableOpacity onPress={onNext}>
              <Ionicons name="play-skip-forward" size={32} color={colors.text.primary} />
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity onPress={onToggleRepeat}>
              <Ionicons
                name={getRepeatIcon()}
                size={24}
                color={getRepeatColor()}
              />
            </TouchableOpacity>
          </View>

          {/* Contrôles secondaires */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 30,
              marginBottom: 40,
            }}
          >
            {/* Volume */}
            <TouchableOpacity
              onPress={() => setShowVolumeControl(!showVolumeControl)}
            >
              <Ionicons name="volume-medium" size={24} color={colors.text.secondary} />
            </TouchableOpacity>

            {/* Partager */}
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color={colors.text.secondary} />
            </TouchableOpacity>

            {/* Ajouter aux favoris */}
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color={colors.text.secondary} />
            </TouchableOpacity>

            {/* Queue */}
            <TouchableOpacity>
              <Ionicons name="list" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Contrôle de volume (conditionnel) */}
          {showVolumeControl && (
            <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 15,
                  padding: 15,
                }}
              >
                <Ionicons name="volume-low" size={20} color={colors.text.secondary} />
                <View
                  style={{
                    flex: 1,
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 2,
                    marginHorizontal: 15,
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${volume}%`,
                      backgroundColor: colors.text.primary,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Ionicons name="volume-high" size={20} color={colors.text.secondary} />
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}; 