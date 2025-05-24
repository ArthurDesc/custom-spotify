import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface SpotifyLoginButtonProps {
  onBack?: () => void;
}

export function SpotifyLoginButton({ onBack }: SpotifyLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { loginWithSpotify } = useAuth();

  const handleSpotifyLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithSpotify();
      
      if (result.success) {
        Alert.alert('Succès', result.message);
        // La navigation sera gérée automatiquement par le changement d'état dans App.tsx
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Spotify:', error);
      Alert.alert('Erreur', 'Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Connexion Spotify</Text>
      <Text style={styles.description}>
        Connectez-vous avec votre compte Spotify pour accéder à vos playlists et contrôler votre musique
      </Text>
      
      <TouchableOpacity 
        style={[styles.spotifyButton, loading && styles.buttonDisabled]} 
        onPress={handleSpotifyLogin} 
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.buttonText}>Connexion en cours...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.spotifyIcon}>♫</Text>
            <Text style={styles.buttonText}>Se connecter avec Spotify</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {onBack && (
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton} 
          disabled={loading}
        >
          <Text style={[styles.backButtonText, loading && styles.disabledText]}>
            Retour
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 12,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1db954',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  spotifyButton: {
    padding: 16,
    backgroundColor: '#1db954',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spotifyIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
  disabledText: {
    color: '#cbd5e1',
  },
}); 