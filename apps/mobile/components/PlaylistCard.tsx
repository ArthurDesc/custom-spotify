import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

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
      style={[styles.playlistCard, { backgroundColor: colors.background.card }]}
      onPress={onPress}
    >
      <View style={[styles.likedTracksIcon, { backgroundColor: colors.primary.purple }]}>
        <Text style={styles.likedTracksIconText}>💚</Text>
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.playlistDescription, { color: colors.text.secondary }]}>
          {description}
        </Text>
        <Text style={[styles.playlistTracks, { color: colors.primary.purple }]}>
          {trackCount} titres
        </Text>
      </View>
      <Text style={[styles.playlistArrow, { color: colors.text.secondary }]}>▶️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playlistCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  likedTracksIcon: {
    width: 60,
    height: 60,
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
    marginBottom: 5,
  },
  playlistDescription: {
    fontSize: 12,
    marginBottom: 5,
  },
  playlistTracks: {
    fontSize: 12,
  },
  playlistArrow: {
    fontSize: 16,
    marginLeft: 10,
  },
}); 