import React from 'react';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { MusicPlayerWithModal } from './MusicPlayerWithModal';
import { AnimatedBackground } from './AnimatedBackground';
import { Track, PlaybackState } from '../types/spotify';

interface MainLayoutProps {
  children: React.ReactNode;
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlaylistPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
  onLogoPress?: () => void;
  showMusicPlayer?: boolean;
  playbackMethod?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentTrack,
  playbackState,
  onPlaylistPress,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onVolumeChange,
  onLogoPress,
  showMusicPlayer = true,
  playbackMethod,
}) => {
  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <AnimatedBackground />
      
      {/* Header avec logo */}
      <View className="items-center py-4 px-4">
        <TouchableOpacity onPress={onLogoPress} disabled={!onLogoPress}>
          <Image 
            source={require('../assets/logo.png')} 
            className="w-16 h-16"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View className="flex-1">
        {children}
      </View>

      {/* Lecteur musical en bas (si activé) */}
      {showMusicPlayer && (
        <MusicPlayerWithModal
          currentTrack={currentTrack}
          playbackState={playbackState}
          onPlaylistPress={onPlaylistPress}
          onPause={onPause}
          onResume={onResume}
          onNext={onNext}
          onPrevious={onPrevious}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          isInLayout={true}
          playbackMethod={playbackMethod}
        />
      )}
    </SafeAreaView>
  );
}; 