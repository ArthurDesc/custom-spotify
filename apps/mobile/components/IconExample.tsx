import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IconExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemples d'icônes Ionicons</Text>
      
      {/* Navigation Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        <View style={styles.iconRow}>
          <Ionicons name="home" size={24} color="#1DB954" />
          <Ionicons name="search" size={24} color="#1DB954" />
          <Ionicons name="person" size={24} color="#1DB954" />
          <Ionicons name="settings" size={24} color="#1DB954" />
        </View>
      </View>

      {/* Music Player Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lecteur Musical</Text>
        <View style={styles.iconRow}>
          <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
          <Ionicons name="play" size={40} color="#FFFFFF" />
          <Ionicons name="pause" size={40} color="#FFFFFF" />
          <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
        </View>
      </View>

      {/* Other Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Autres</Text>
        <View style={styles.iconRow}>
          <Ionicons name="heart" size={24} color="#FF6B6B" />
          <Ionicons name="musical-notes" size={24} color="#4ECDC4" />
          <Ionicons name="volume-high" size={24} color="#45B7D1" />
          <Ionicons name="download" size={24} color="#96CEB4" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#191414',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 12,
  },
}); 