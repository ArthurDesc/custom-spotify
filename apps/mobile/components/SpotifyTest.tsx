import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { API_CONFIG } from '../config';

interface SpotifyTestData {
  success: boolean;
  message: string;
  data?: {
    artist: {
      name: string;
      followers: { total: number };
      genres: string[];
      popularity: number;
      external_urls: { spotify: string };
    } | null;
    timestamp: string;
  };
  error?: string;
  details?: string;
}

export function SpotifyTest({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<SpotifyTestData | null>(null);

  const testSpotifyConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || API_CONFIG.BASE_URL;
      const url = `${apiUrl}${API_CONFIG.ENDPOINTS.SPOTIFY_TEST}`;
      
      console.log("Test de connexion Spotify à:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data: SpotifyTestData = await response.json();
      setTestResult(data);
      
      if (data.success) {
        Alert.alert("Succès ✅", "Connexion à l'API Spotify réussie !");
      } else {
        Alert.alert("Erreur ❌", data.error || "Erreur lors du test Spotify");
      }
      
    } catch (error) {
      console.error("Erreur de connexion Spotify:", error);
      const errorResult: SpotifyTestData = {
        success: false,
        message: "Erreur de connexion",
        error: "Impossible de contacter le serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      };
      setTestResult(errorResult);
      Alert.alert(
        "Erreur de connexion ❌", 
        "Impossible de contacter le serveur. Vérifiez que l'API est démarrée."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎵 Test API Spotify</Text>
        <Text style={styles.description}>
          Ce test vérifie la connexion à l'API Spotify et récupère des données d'exemple.
        </Text>

        <TouchableOpacity 
          style={[styles.testButton, loading && styles.buttonDisabled]} 
          onPress={testSpotifyConnection}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Test en cours...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>🚀 Tester la connexion Spotify</Text>
          )}
        </TouchableOpacity>

        {testResult && (
          <View style={[styles.resultContainer, testResult.success ? styles.successResult : styles.errorResult]}>
            <Text style={styles.resultTitle}>
              {testResult.success ? "✅ Résultat du test" : "❌ Erreur"}
            </Text>
            
            <Text style={styles.resultMessage}>{testResult.message}</Text>
            
            {testResult.success && testResult.data?.artist && (
              <View style={styles.artistInfo}>
                <Text style={styles.artistTitle}>🎤 Artiste trouvé :</Text>
                <Text style={styles.artistName}>{testResult.data.artist.name}</Text>
                <Text style={styles.artistDetail}>
                  👥 Followers: {testResult.data.artist.followers.total.toLocaleString()}
                </Text>
                <Text style={styles.artistDetail}>
                  🔥 Popularité: {testResult.data.artist.popularity}/100
                </Text>
                {testResult.data.artist.genres.length > 0 && (
                  <Text style={styles.artistDetail}>
                    🎼 Genres: {testResult.data.artist.genres.join(', ')}
                  </Text>
                )}
              </View>
            )}
            
            {testResult.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>Erreur: {testResult.error}</Text>
                {testResult.details && (
                  <Text style={styles.errorDetails}>Détails: {testResult.details}</Text>
                )}
              </View>
            )}
            
            <Text style={styles.timestamp}>
              ⏰ {new Date(testResult.data?.timestamp || Date.now()).toLocaleString('fr-FR')}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1db954', // Couleur verte Spotify
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  testButton: {
    backgroundColor: '#1db954',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  successResult: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 1,
  },
  errorResult: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  resultMessage: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 15,
  },
  artistInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  artistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  artistDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  errorDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
}); 