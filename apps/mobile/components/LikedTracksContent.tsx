import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { PlayerControls } from './PlayerControls';
import { TrackList } from './TrackList';
import { Track, PlaybackState, LikedTracksInfo } from '../types/spotify';

interface LikedTracksContentProps {
  currentTrack: Track | null;
  playbackState: PlaybackState | null;
  likedTracksInfo: LikedTracksInfo;
  loadingTrackId?: string | null;
  loadingMore: boolean;
  onBackPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onTrackPress: (trackUri: string) => void;
  onLoadMore: () => void;
}

export const LikedTracksContent: React.FC<LikedTracksContentProps> = ({
  currentTrack,
  playbackState,
  likedTracksInfo,
  loadingTrackId,
  loadingMore,
  onBackPress,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onTrackPress,
  onLoadMore,
}) => {
  return (
    <View className="flex-1">
      {/* Header avec bouton retour */}
      <View className="flex-row justify-between items-center px-4 py-4">
        <Text 
          className="text-text-primary text-xl font-bold flex-1 text-center"
          style={{ color: colors.text.primary }}
        >
          Titres likés
        </Text>
        <View />
      </View>

      {/* Lecteur de musique */}
      <View className="px-4">
        <PlayerControls
          currentTrack={currentTrack}
          playbackState={playbackState}
          onPause={onPause}
          onResume={onResume}
          onNext={onNext}
          onPrevious={onPrevious}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
        />
      </View>

      {/* Liste des titres */}
      <View className="flex-1 px-4">
        <Text 
          className="text-text-primary text-lg font-semibold mb-4"
          style={{ color: colors.text.primary }}
        >
          {likedTracksInfo.total} titres
        </Text>
        
        <TrackList
          tracks={likedTracksInfo.tracks}
          currentTrackId={currentTrack?.id}
          loadingTrackId={loadingTrackId}
          isPlaying={playbackState?.is_playing}
          onTrackPress={onTrackPress}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
          hasMore={likedTracksInfo.hasMore}
        />
      </View>
    </View>
  );
}; 