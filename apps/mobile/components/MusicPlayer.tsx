import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from './Icon';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

  return (
    <View style={styles.container}>
      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>Nom de la chanson</Text>
        <Text style={styles.artistName}>Nom de l'artiste</Text>
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <Icon
          name="play-skip-back"
          size={32}
          color="#FFFFFF"
          onPress={() => console.log('Previous track')}
        />
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="#000000" 
          />
        </TouchableOpacity>
        
        <Icon
          name="play-skip-forward"
          size={32}
          color="#FFFFFF"
          onPress={() => console.log('Next track')}
        />
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        <Icon
          name="shuffle"
          size={20}
          color={isShuffled ? "#1DB954" : "#B3B3B3"}
          onPress={toggleShuffle}
        />
        
        <Icon
          name={isLiked ? "heart" : "heart-outline"}
          size={20}
          color={isLiked ? "#FF6B6B" : "#B3B3B3"}
          onPress={toggleLike}
        />
        
        <Icon
          name={repeatMode > 0 ? "repeat" : "repeat-outline"}
          size={20}
          color={repeatMode > 0 ? "#1DB954" : "#B3B3B3"}
          onPress={toggleRepeat}
        />
        
        <Icon
          name="volume-high"
          size={20}
          color="#B3B3B3"
          onPress={() => console.log('Volume control')}
        />
        
        <Icon
          name="ellipsis-horizontal"
          size={20}
          color="#B3B3B3"
          onPress={() => console.log('More options')}
        />
      </View>

      {/* Progress Bar Placeholder */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '30%' }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>1:23</Text>
          <Text style={styles.timeText}>3:45</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191414',
    padding: 20,
    borderRadius: 12,
    margin: 20,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 30,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#B3B3B3',
  },
}); 