import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/config';

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  product: string;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyProfileProps {
  onLogout: () => void;
}

export default function SpotifyProfile({ onLogout }: SpotifyProfileProps) {
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpotifyProfile();
  }, []);

  const loadSpotifyProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la session Spotify depuis le stockage
      const sessionData = await AsyncStorage.getItem('@custom_spotify_session');
      
      if (!sessionData) {
        setError('Aucune session Spotify trouvée');
        return;
      }

      const session = JSON.parse(sessionData);
      
      if (!session.accessToken) {
        setError('Token d\'accès Spotify manquant');
        return;
      }

      // Appeler l'API Spotify pour récupérer le profil
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API Spotify: ${response.status}`);
      }

      const userData = await response.json();
      setSpotifyUser(userData);
      
      console.log('✅ Profil Spotify chargé:', {
        name: userData.display_name,
        email: userData.email,
        product: userData.product
      });

    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const testSpotifyAPI = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('@custom_spotify_session');
      if (!sessionData) return;

      const session = JSON.parse(sessionData);
      
      // Test: récupérer les playlists
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=5', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          '🎵 Test API Spotify',
          `Vous avez ${data.total} playlists.\nPremière playlist: ${data.items[0]?.name || 'Aucune'}`
        );
      } else {
        Alert.alert('❌ Erreur', 'Impossible de récupérer les playlists');
      }
    } catch (error) {
      Alert.alert('❌ Erreur', 'Erreur lors du test API');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement du profil Spotify...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSpotifyProfile}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!spotifyUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune donnée utilisateur</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Profil Spotify</Text>
      </View>

      <View style={styles.profileCard}>
        {spotifyUser.images && spotifyUser.images.length > 0 && (
          <Image 
            source={{ uri: spotifyUser.images[0].url }} 
            style={styles.avatar}
          />
        )}
        
        <Text style={styles.displayName}>{spotifyUser.display_name}</Text>
        <Text style={styles.email}>{spotifyUser.email}</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID Spotify</Text>
            <Text style={styles.infoValue}>{spotifyUser.id}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pays</Text>
            <Text style={styles.infoValue}>{spotifyUser.country}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Abonnement</Text>
            <Text style={styles.infoValue}>{spotifyUser.product}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Followers</Text>
            <Text style={styles.infoValue}>{spotifyUser.followers.total}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.testButton} onPress={testSpotifyAPI}>
          <Text style={styles.testButtonText}>🧪 Tester API Spotify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoGrid: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  actions: {
    gap: 15,
  },
  testButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff4444',
    marginTop: 50,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 