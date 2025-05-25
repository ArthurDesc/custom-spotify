import React, { useState } from 'react';
import { View, Image, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { colors } from '../utils/colors';
import { MusicPlayerWithModal } from './MusicPlayerWithModal';
import { AnimatedBackground } from './AnimatedBackground';
import { SearchModal } from './SearchModal';
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
  onSearchPress?: () => void;
  onTrackPress?: (trackUri: string, tracks: Track[]) => void;
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
  onSearchPress,
  onTrackPress,
  showMusicPlayer = true,
  playbackMethod,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    }
    setShowSearchModal(true);
  };

  const handleSearchTrackPress = (trackUri: string, tracks: Track[]) => {
    if (onTrackPress) {
      onTrackPress(trackUri, tracks);
    }
    setShowSearchModal(false);
  };

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background.primary }}
    >
      <AnimatedBackground />
      
      {/* Header avec logo et recherche */}
      <View className="flex-row items-center justify-between py-4 px-4">
        <View className="w-10" />
        <TouchableOpacity onPress={onLogoPress} disabled={!onLogoPress}>
          <Image 
            source={require('../assets/logo.png')} 
            className="w-16 h-16"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSearchPress}
          disabled={!onSearchPress}
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: onSearchPress ? colors.background.secondary : 'transparent' }}
        >
          <Text className="text-white text-xl">🔍</Text>
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

      {/* Modal de recherche */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onTrackPress={handleSearchTrackPress}
      />
    </SafeAreaView>
  );
}; 