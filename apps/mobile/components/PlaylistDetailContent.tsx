import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../utils/colors';
import { PlayerControls } from './PlayerControls';
import { TrackList } from './TrackList';
import { Track, PlaybackState, PlaylistDetailInfo } from '../types/spotify';

interface PlaylistDetailContentProps {
  currentTrack: Track | null;
  playbackState: PlaybackState | null;
  playlistDetailInfo: PlaylistDetailInfo;
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

export const PlaylistDetailContent: React.FC<PlaylistDetailContentProps> = ({
  currentTrack,
  playbackState,
  playlistDetailInfo,
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
  const { playlist, tracks } = playlistDetailInfo;

  return (
    <View className="flex-1">
      {/* Header avec bouton retour et info playlist */}
      <View className="px-4 py-4">

        {/* Info de la playlist */}
        <View className="flex-row items-center mb-4">
          <View 
            className="w-20 h-20 rounded-xl mr-4 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {playlist.images?.[0]?.url ? (
              <Image 
                source={{ uri: playlist.images[0].url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View 
                className="w-full h-full justify-center items-center"
                style={{ 
                  backgroundColor: colors.background.tertiary,
                  borderWidth: 1,
                  borderColor: colors.border.secondary,
                }}
              >
                <Text className="text-3xl">🎵</Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text 
              className="text-xl font-bold mb-1"
              style={{ color: colors.text.primary }}
              numberOfLines={2}
            >
              {playlist.name}
            </Text>
            {playlist.description && (
              <Text 
                className="text-sm mb-1"
                style={{ color: colors.text.secondary }}
                numberOfLines={2}
              >
                {playlist.description}
              </Text>
            )}
            <Text 
              className="text-xs"
              style={{ color: colors.text.muted }}
            >
              Par {playlist.owner.display_name}
            </Text>
          </View>
        </View>
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
          {playlist.tracks.total} titre{playlist.tracks.total > 1 ? 's' : ''}
        </Text>
        
        <TrackList
          tracks={tracks}
          currentTrackId={currentTrack?.id}
          loadingTrackId={loadingTrackId}
          isPlaying={playbackState?.is_playing}
          onTrackPress={onTrackPress}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
          hasMore={playlistDetailInfo.hasMore}
        />
      </View>
    </View>
  );
}; 