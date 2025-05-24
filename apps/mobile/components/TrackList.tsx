import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Track } from '../types/spotify';
import { formatDuration } from '../utils/formatters';

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
          isCurrentTrack && styles.currentTrackCard
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
            isCurrentTrack && styles.currentTrackText
          ]} numberOfLines={1}>
            {track.name}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artists.map(a => a.name).join(', ')}
          </Text>
          <Text style={styles.trackAlbum} numberOfLines={1}>
            {track.album.name}
          </Text>
        </View>
        <View style={styles.trackMeta}>
          <Text style={styles.trackDuration}>
            {formatDuration(track.duration_ms)}
          </Text>
          {isLoading && (
            <ActivityIndicator size="small" color="#1DB954" style={{ marginTop: 5 }} />
          )}
          {isCurrentTrack && isPlaying && !isLoading && (
            <Text style={styles.playingIndicator}>🎵</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#1DB954" />
        <Text style={styles.loadingText}>Chargement...</Text>
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
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  currentTrackCard: {
    backgroundColor: '#333',
    borderColor: '#1DB954',
    borderWidth: 1,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  trackImageLoading: {
    opacity: 0.6,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  currentTrackText: {
    color: '#1DB954',
  },
  trackArtist: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  trackAlbum: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  trackMeta: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  trackDuration: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  playingIndicator: {
    fontSize: 16,
    color: '#1DB954',
    marginTop: 5,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#B3B3B3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
}); 