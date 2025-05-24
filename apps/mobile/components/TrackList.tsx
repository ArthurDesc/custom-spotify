import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Track } from '../types/spotify';
import { formatDuration } from '../utils/formatters';
import { colors } from '../utils/colors';

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string | null;
  loadingTrackId?: string | null;
  isPlaying?: boolean;
  onTrackPress: (trackUri: string) => void;
  onLoadMore: () => void;
  loadingMore: boolean;
  hasMore: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackId,
  loadingTrackId,
  isPlaying,
  onTrackPress,
  onLoadMore,
  loadingMore,
  hasMore,
}) => {
  const renderTrackItem = ({ item: track }: { item: Track }) => {
    const isCurrentTrack = currentTrackId === track.id;
    const isLoading = loadingTrackId === track.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.trackCard,
          { backgroundColor: colors.background.card },
          isCurrentTrack && { 
            backgroundColor: colors.background.secondary,
            borderColor: colors.primary.purple,
            borderWidth: 1 
          }
        ]}
        onPress={() => onTrackPress(track.uri)}
        disabled={isLoading}
      >
        {track.album.images?.[0] && (
          <Image 
            source={{ uri: track.album.images[0].url }} 
            style={[
              styles.trackImage,
              isLoading && styles.trackImageLoading
            ]}
          />
        )}
        <View style={styles.trackInfo}>
          <Text style={[
            styles.trackName,
            { color: colors.text.primary },
            isCurrentTrack && { color: colors.primary.purple }
          ]} numberOfLines={1}>
            {track.name}
          </Text>
          <Text style={[styles.trackArtist, { color: colors.text.secondary }]} numberOfLines={1}>
            {track.artists.map(a => a.name).join(', ')}
          </Text>
        </View>
        <View style={styles.trackMeta}>
          <Text style={[styles.trackDuration, { color: colors.text.secondary }]}>
            {formatDuration(track.duration_ms)}
          </Text>
          {isLoading && (
            <ActivityIndicator size="small" color={colors.primary.purple} style={{ marginTop: 5 }} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary.purple} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Chargement...</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={tracks}
      renderItem={renderTrackItem}
      keyExtractor={(item) => item.id}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      style={styles.tracksList}
    />
  );
};

const styles = StyleSheet.create({
  tracksList: {
    flex: 1,
  },
  trackCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackImageLoading: {
    opacity: 0.6,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 13,
    marginBottom: 0,
  },
  trackMeta: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  trackDuration: {
    fontSize: 11,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
}); 