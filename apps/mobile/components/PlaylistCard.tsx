import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface PlaylistCardProps {
  title: string;
  description: string;
  trackCount: number;
  onPress: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  description,
  trackCount,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.playlistCard}
      onPress={onPress}
    >
      <View style={styles.likedTracksIcon}>
        <Text style={styles.likedTracksIconText}>💚</Text>
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{title}</Text>
        <Text style={styles.playlistDescription}>
          {description}
        </Text>
        <Text style={styles.playlistTracks}>
          {trackCount} titres
        </Text>
      </View>
      <Text style={styles.playlistArrow}>▶️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playlistCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  likedTracksIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#1DB954',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  likedTracksIconText: {
    fontSize: 24,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  playlistDescription: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  playlistTracks: {
    fontSize: 12,
    color: '#1DB954',
  },
  playlistArrow: {
    fontSize: 16,
    color: '#B3B3B3',
    marginLeft: 10,
  },
}); 