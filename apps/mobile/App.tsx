import './global.css';
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import SimpleNativeWindTest from "./components/SimpleNativeWindTest";
import NativeWindVerification from "./components/NativeWindVerification";

WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

console.log("🔍 API_URL utilisée:", API_URL);

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

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
  uri: string;
}

interface PlaybackState {
  is_playing: boolean;
  item: Track | null;
  progress_ms: number;
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  } | null;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  // Générer l'URL de redirection
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "custom-spotify",
    path: "auth",
  });

  // Debug: Afficher l'URL de redirection
  console.log("🔍 URL de redirection générée:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID!,
      scopes: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-library-read",
        "user-top-read",
        "user-read-recently-played",
      ],
      usePKCE: false,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleAuthSuccess(code);
    } else if (response?.type === "error") {
      console.error("Auth error:", response.error);
      Alert.alert(
        "Erreur d'authentification",
        response.error?.message || "Erreur inconnue"
      );
    }
  }, [response]);

  const handleAuthSuccess = async (code: string) => {
    try {
      setLoading(true);

      console.log("🔍 Code reçu:", code);
      console.log("🔍 Redirect URI utilisée:", redirectUri);

      // Échanger le code contre un token via notre API backend (endpoint public)
      const tokenResponse = await fetch(`${API_URL}/api/spotify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          redirectUri,
        }),
      });

      console.log("🔍 Response status:", tokenResponse.status);
      const responseText = await tokenResponse.text();
      console.log("🔍 Response text:", responseText.substring(0, 200));

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
          errorData = { error: "Invalid response", raw: responseText };
        }
        console.error("Token exchange error:", errorData);
        Alert.alert(
          "Erreur",
          "Échec de l'authentification: " +
            (errorData.error || "Erreur inconnue")
        );
      }
    } catch (error) {
      console.error("Erreur auth:", error);
      Alert.alert("Erreur", "Problème de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      setLoading(true);

      // Récupérer le profil directement depuis Spotify
      const profileResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }

      // Récupérer les playlists directement depuis Spotify
      const playlistsResponse = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (playlistsResponse.ok) {
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData.items);
      }

      // Récupérer l'état de lecture actuel
      await fetchPlaybackState(token);
    } catch (error) {
      console.error("Erreur fetch data:", error);
      Alert.alert("Erreur", "Impossible de récupérer les données utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const tracks = data.items
          .map((item: any) => item.track)
          .filter((track: any) => track);
        setPlaylistTracks(tracks);
      }
    } catch (error) {
      console.error("Erreur fetch tracks:", error);
      Alert.alert("Erreur", "Impossible de récupérer les pistes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaybackState = async (token: string) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok && response.status !== 204) {
        const data = await response.json();
        setPlaybackState(data);
        setCurrentTrack(data.item);
      }
    } catch (error) {
      console.error("Erreur fetch playback:", error);
    }
  };

  const playTrack = async (trackUri: string) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        }
      );

      if (response.ok || response.status === 204) {
        // Attendre un peu puis récupérer le nouvel état
        setTimeout(() => fetchPlaybackState(accessToken), 1000);
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de lire cette piste. Assurez-vous qu'un appareil Spotify est actif."
        );
      }
    } catch (error) {
      console.error("Erreur play track:", error);
      Alert.alert("Erreur", "Problème lors de la lecture");
    }
  };

  const pausePlayback = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/pause",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setTimeout(() => fetchPlaybackState(accessToken), 500);
      }
    } catch (error) {
      console.error("Erreur pause:", error);
    }
  };

  const resumePlayback = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setTimeout(() => fetchPlaybackState(accessToken), 500);
      }
    } catch (error) {
      console.error("Erreur resume:", error);
    }
  };

  const skipToNext = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/next",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setTimeout(() => fetchPlaybackState(accessToken), 1000);
      }
    } catch (error) {
      console.error("Erreur skip:", error);
    }
  };

  const skipToPrevious = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/previous",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setTimeout(() => fetchPlaybackState(accessToken), 1000);
      }
    } catch (error) {
      console.error("Erreur previous:", error);
    }
  };

  const handleLogin = () => {
    promptAsync();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setPlaylists([]);
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
    setCurrentTrack(null);
    setPlaybackState(null);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    fetchPlaylistTracks(playlist.id);
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
          <Text style={styles.title}>🎵 Bienvenu fréro ! </Text>
          <Text style={styles.subtitle}>
            Connectez-vous avec votre compte Spotify pour accéder à vos données
          </Text>

          <SimpleNativeWindTest />
          
          {/* Composant de vérification complet */}
          <ScrollView style={{ maxHeight: 300 }} className="w-full">
            <NativeWindVerification />
          </ScrollView>

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
        <Text style={styles.title}>🎵 Bienvenu fréro !</Text>
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

      {/* Lecteur de musique actuel */}
      {currentTrack && playbackState && (
        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>En cours de lecture</Text>
          <View style={styles.playerCard}>
            {currentTrack.album.images?.[0] && (
              <Image
                source={{ uri: currentTrack.album.images[0].url }}
                style={styles.playerImage}
              />
            )}
            <View style={styles.playerInfo}>
              <Text style={styles.playerTrackName} numberOfLines={1}>
                {currentTrack.name}
              </Text>
              <Text style={styles.playerArtistName} numberOfLines={1}>
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </Text>
              <Text style={styles.playerAlbumName} numberOfLines={1}>
                {currentTrack.album.name}
              </Text>
            </View>
          </View>

          {/* Contrôles de lecture */}
          <View style={styles.playerControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={skipToPrevious}
            >
              <Text style={styles.controlButtonText}>⏮️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.playPauseButton]}
              onPress={
                playbackState.is_playing ? pausePlayback : resumePlayback
              }
            >
              <Text style={styles.controlButtonText}>
                {playbackState.is_playing ? "⏸️" : "▶️"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
              <Text style={styles.controlButtonText}>⏭️</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Navigation: Playlists ou Tracks */}
      {!selectedPlaylist ? (
        <View style={styles.playlistsSection}>
          <Text style={styles.sectionTitle}>
            Mes Playlists ({playlists.length})
          </Text>
          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistCard}
              onPress={() => handlePlaylistSelect(playlist)}
            >
              {playlist.images?.[0] && (
                <Image
                  source={{ uri: playlist.images[0].url }}
                  style={styles.playlistImage}
                />
              )}
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={styles.playlistDescription} numberOfLines={2}>
                  {playlist.description || "Aucune description"}
                </Text>
                <Text style={styles.playlistTracks}>
                  {playlist.tracks?.total} pistes
                </Text>
              </View>
              <Text style={styles.playlistArrow}>▶️</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.tracksSection}>
          <View style={styles.tracksHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToPlaylists}
            >
              <Text style={styles.backButtonText}>◀️ Retour</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{selectedPlaylist.name}</Text>
          </View>

          {playlistTracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackCard,
                currentTrack?.id === track.id && styles.currentTrackCard,
              ]}
              onPress={() => playTrack(track.uri)}
            >
              {track.album.images?.[0] && (
                <Image
                  source={{ uri: track.album.images[0].url }}
                  style={styles.trackImage}
                />
              )}
              <View style={styles.trackInfo}>
                <Text
                  style={[
                    styles.trackName,
                    currentTrack?.id === track.id && styles.currentTrackText,
                  ]}
                  numberOfLines={1}
                >
                  {track.name}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {track.artists.map((a) => a.name).join(", ")}
                </Text>
                <Text style={styles.trackAlbum} numberOfLines={1}>
                  {track.album.name}
                </Text>
              </View>
              <View style={styles.trackMeta}>
                <Text style={styles.trackDuration}>
                  {formatDuration(track.duration_ms)}
                </Text>
                {currentTrack?.id === track.id && playbackState?.is_playing && (
                  <Text style={styles.playingIndicator}>🎵</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1DB954",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutButtonText: {
    color: "#B3B3B3",
    fontSize: 14,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  profileSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
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
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  profileStats: {
    fontSize: 12,
    color: "#1DB954",
  },
  playlistsSection: {
    padding: 20,
  },
  playlistCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
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
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  playlistDescription: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  playlistTracks: {
    fontSize: 12,
    color: "#1DB954",
  },
  playlistArrow: {
    fontSize: 16,
    color: "#B3B3B3",
    marginLeft: 10,
  },
  playerSection: {
    padding: 20,
  },
  playerCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerTrackName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  playerArtistName: {
    fontSize: 14,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  playerAlbumName: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlButtonText: {
    color: "#B3B3B3",
    fontSize: 14,
  },
  playPauseButton: {
    backgroundColor: "#1DB954",
  },
  tracksSection: {
    padding: 20,
  },
  tracksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    color: "#B3B3B3",
    fontSize: 14,
  },
  trackCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  currentTrackCard: {
    backgroundColor: "#333",
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  currentTrackText: {
    color: "#1DB954",
  },
  trackArtist: {
    fontSize: 14,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  trackAlbum: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 5,
  },
  trackMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackDuration: {
    fontSize: 12,
    color: "#B3B3B3",
  },
  playingIndicator: {
    fontSize: 16,
    color: "#1DB954",
    marginLeft: 10,
  },
  debugButton: {
    backgroundColor: "#333",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  debugButtonText: {
    color: "#B3B3B3",
    fontSize: 14,
  },
});
