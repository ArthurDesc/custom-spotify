import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

console.log('🔍 API_URL utilisée:', API_URL);

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  country: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  // Générer l'URL de redirection
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'custom-spotify',
    path: 'auth'
  });

  // Debug: Afficher l'URL de redirection
  console.log('🔍 URL de redirection générée:', redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID!,
      scopes: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-library-read',
        'user-top-read',
        'user-read-recently-played'
      ],
      usePKCE: false,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleAuthSuccess(code);
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);
      Alert.alert('Erreur d\'authentification', response.error?.message || 'Erreur inconnue');
    }
  }, [response]);

  const handleAuthSuccess = async (code: string) => {
    try {
      setLoading(true);
      
      console.log('🔍 Code reçu:', code);
      console.log('🔍 Redirect URI utilisée:', redirectUri);
      
      // Échanger le code contre un token via notre API backend (endpoint public)
      const tokenResponse = await fetch(`${API_URL}/api/spotify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          redirectUri
        }),
      });
      
      console.log('🔍 Response status:', tokenResponse.status);
      const responseText = await tokenResponse.text();
      console.log('🔍 Response text:', responseText.substring(0, 200));
      
      if (tokenResponse.ok) {
        const tokenData = JSON.parse(responseText);
        setAccessToken(tokenData.access_token);
        setIsAuthenticated(true);
        await fetchUserData(tokenData.access_token);
      } else {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: 'Invalid response', raw: responseText };
        }
        console.error('Token exchange error:', errorData);
        Alert.alert('Erreur', 'Échec de l\'authentification: ' + (errorData.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      Alert.alert('Erreur', 'Problème de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      setLoading(true);
      
      // Récupérer le profil directement depuis Spotify
      const profileResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }

      // Récupérer les playlists directement depuis Spotify
      const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (playlistsResponse.ok) {
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData.items);
      }
    } catch (error) {
      console.error('Erreur fetch data:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    promptAsync();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setPlaylists([]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>🎵 Custom Spotify</Text>
          <Text style={styles.subtitle}>
            Connectez-vous avec votre compte Spotify pour accéder à vos données
          </Text>
          
          {/* Debug: Afficher l'URL de redirection */}
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => Alert.alert('URL de redirection', redirectUri)}
          >
            <Text style={styles.debugButtonText}>
              🔍 Voir URL de redirection
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={!request}
          >
            <Text style={styles.loginButtonText}>
              Se connecter avec Spotify
            </Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Custom Spotify</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {profile && (
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.profileCard}>
            {profile.images?.[0] && (
              <Image 
                source={{ uri: profile.images[0].url }} 
                style={styles.profileImage}
              />
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.display_name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profileStats}>
                {profile.followers?.total} abonnés • {profile.country}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.playlistsSection}>
        <Text style={styles.sectionTitle}>Mes Playlists ({playlists.length})</Text>
        {playlists.map((playlist) => (
          <View key={playlist.id} style={styles.playlistCard}>
            {playlist.images?.[0] && (
              <Image 
                source={{ uri: playlist.images[0].url }} 
                style={styles.playlistImage}
              />
            )}
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName}>{playlist.name}</Text>
              <Text style={styles.playlistDescription} numberOfLines={2}>
                {playlist.description || 'Aucune description'}
              </Text>
              <Text style={styles.playlistTracks}>
                {playlist.tracks?.total} pistes
              </Text>
            </View>
          </View>
        ))}
      </View>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DB954',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  profileSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  profileStats: {
    fontSize: 12,
    color: '#1DB954',
  },
  playlistsSection: {
    padding: 20,
  },
  playlistCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
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
  debugButton: {
    backgroundColor: '#333',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  debugButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
});
