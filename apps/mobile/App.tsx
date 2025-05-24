import './global.css';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';

// Hooks personnalisés
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useLikedTracks } from './hooks/useLikedTracks';
import { usePlayback } from './hooks/usePlayback';

// Composants
import { PlayerControls } from './components/PlayerControls';
import { TrackList } from './components/TrackList';
import { PlaylistCard } from './components/PlaylistCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import SimpleNativeWindTest from "./components/SimpleNativeWindTest";
import NativeWindVerification from "./components/NativeWindVerification";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [showLikedTracks, setShowLikedTracks] = useState(false);

  // Hooks personnalisés
  const auth = useSpotifyAuth();
  const likedTracks = useLikedTracks();
  const playback = usePlayback();

  // Initialiser les données après authentification
  useEffect(() => {
    if (auth.isAuthenticated) {
      initializeData();
    }
  }, [auth.isAuthenticated]);

  const initializeData = async () => {
    try {
      // Charger les premiers titres likés
      await likedTracks.fetchLikedTracks(0, true);
      // Récupérer l'état de lecture actuel
      await playback.fetchPlaybackState();
    } catch (error) {
      console.error('Erreur initialisation:', error);
    }
  };

  const handleLikedTracksPress = () => {
    setShowLikedTracks(true);
  };

  const handleBackToHome = () => {
    setShowLikedTracks(false);
  };

  const handleLogout = () => {
    auth.logout();
    likedTracks.reset();
    playback.reset();
    setShowLikedTracks(false);
  };

  const handleTrackPress = (trackUri: string) => {
    playback.playTrack(trackUri, likedTracks.likedTracksInfo.tracks);
  };

  // Écran de chargement
  if (auth.loading || likedTracks.loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
        <StatusBar style="light" />
      </View>
    );
  }

  // Écran de connexion
  if (!auth.isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>🎵 Bienvenu fréro ! </Text>
          <Text style={styles.subtitle}>
            Connectez-vous avec votre compte Spotify pour accéder à vos titres likés
          </Text>

          <SimpleNativeWindTest />

          <ScrollView style={{ maxHeight: 300 }} className="w-full">
            <NativeWindVerification />
          </ScrollView>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={auth.login}
            disabled={!auth.request}
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

  // Vue détaillée des titres likés
  if (showLikedTracks) {
    const displayCurrentTrack = playback.getDisplayCurrentTrack();
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
            <Text style={styles.backButtonText}>◀️ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Titres likés</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Lecteur de musique */}
        <PlayerControls
          currentTrack={displayCurrentTrack}
          playbackState={playback.playbackState}
          onPause={playback.pausePlayback}
          onResume={playback.resumePlayback}
          onNext={playback.skipToNext}
          onPrevious={playback.skipToPrevious}
          onToggleShuffle={playback.toggleShuffle}
          onToggleRepeat={playback.toggleRepeat}
        />

        {/* Liste des titres */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>
            {likedTracks.likedTracksInfo.total} titres • {likedTracks.likedTracksInfo.tracks.length} chargés
          </Text>
          
          <TrackList
            tracks={likedTracks.likedTracksInfo.tracks}
            currentTrackId={displayCurrentTrack?.id}
            loadingTrackId={playback.loadingTrackId}
            isPlaying={playback.playbackState?.is_playing}
            onTrackPress={handleTrackPress}
            onLoadMore={likedTracks.loadMoreTracks}
            loadingMore={likedTracks.loadingMore}
            hasMore={likedTracks.likedTracksInfo.hasMore}
          />
        </View>

        <StatusBar style="light" />
      </View>
    );
  }

  // Page d'accueil
  const displayCurrentTrack = playback.getDisplayCurrentTrack();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Bienvenu fréro !</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Lecteur de musique */}
      <PlayerControls
        currentTrack={displayCurrentTrack}
        playbackState={playback.playbackState}
        onPause={playback.pausePlayback}
        onResume={playback.resumePlayback}
        onNext={playback.skipToNext}
        onPrevious={playback.skipToPrevious}
        onToggleShuffle={playback.toggleShuffle}
        onToggleRepeat={playback.toggleRepeat}
      />

      {/* Playlist des titres likés */}
      <View style={styles.playlistsSection}>
        <Text style={styles.sectionTitle}>Vos playlists</Text>
        
        <PlaylistCard
          title="Titres likés"
          description="Vos titres favoris sur Spotify"
          trackCount={likedTracks.likedTracksInfo.total}
          onPress={handleLikedTracksPress}
        />
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
    flex: 1,
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
  backButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  placeholder: {
    width: 80,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  playlistsSection: {
    padding: 20,
  },
  tracksSection: {
    flex: 1,
    padding: 20,
  },
});