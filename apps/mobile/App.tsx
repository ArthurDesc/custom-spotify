import './global.css';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';

// Hooks personnalisés
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useLikedTracks } from './hooks/useLikedTracks';
import { usePlayback } from './hooks/usePlayback';
import { usePlaylists } from './hooks/usePlaylists';

// Composants
import { LoadingSpinner } from './components/LoadingSpinner';
import { MusicPlayerCard } from './components/MusicPlayerCard';
import { MainLayout } from './components/MainLayout';
import { HomeContent } from './components/HomeContent';
import { LikedTracksContent } from './components/LikedTracksContent';
import { AnimatedBackground } from './components/AnimatedBackground';

// Couleurs
import { colors } from './utils/colors';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [showLikedTracks, setShowLikedTracks] = useState(false);

  // Hooks personnalisés
  const auth = useSpotifyAuth();
  const likedTracks = useLikedTracks();
  const playback = usePlayback();
  const playlists = usePlaylists();

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
      // Charger les playlists
      await playlists.fetchPlaylists();
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
    playlists.reset();
    setShowLikedTracks(false);
  };

  const handleTrackPress = (trackUri: string) => {
    playback.playTrack(trackUri, likedTracks.likedTracksInfo.tracks);
  };

  const handlePlaylistPress = (playlist: any) => {
    // TODO: Implémenter la navigation vers la playlist
    console.log('Playlist sélectionnée:', playlist.name);
  };

  // Écran de chargement
  if (auth.loading || likedTracks.loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <AnimatedBackground />
        <LoadingSpinner />
        <StatusBar style="light" />
      </View>
    );
  }

  // Écran de connexion
  if (!auth.isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <AnimatedBackground />
        <View style={styles.loginContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary.purple }]}
            onPress={auth.login}
            disabled={!auth.request}
          >
            <Text style={[styles.loginButtonText, { color: colors.text.primary }]}>
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
      <MainLayout
        currentTrack={displayCurrentTrack}
        playbackState={playback.playbackState}
        onPlaylistPress={handleLikedTracksPress}
        onPause={playback.pausePlayback}
        onResume={playback.resumePlayback}
        onNext={playback.skipToNext}
        onPrevious={playback.skipToPrevious}
        onToggleShuffle={playback.toggleShuffle}
        onToggleRepeat={playback.toggleRepeat}
        onSeek={(position) => {
          // TODO: Implémenter la fonction seek dans usePlayback
          console.log('Seek to position:', position);
        }}
        onVolumeChange={(volume) => {
          // TODO: Implémenter la fonction setVolume dans usePlayback
          console.log('Volume change:', volume);
        }}
        onLogoPress={handleBackToHome}
      >
        <LikedTracksContent
          currentTrack={displayCurrentTrack || null}
          playbackState={playback.playbackState || null}
          likedTracksInfo={likedTracks.likedTracksInfo}
          loadingTrackId={playback.loadingTrackId}
          loadingMore={likedTracks.loadingMore}
          onBackPress={handleBackToHome}
          onPause={playback.pausePlayback}
          onResume={playback.resumePlayback}
          onNext={playback.skipToNext}
          onPrevious={playback.skipToPrevious}
          onToggleShuffle={playback.toggleShuffle}
          onToggleRepeat={playback.toggleRepeat}
          onTrackPress={handleTrackPress}
          onLoadMore={likedTracks.loadMoreTracks}
        />
        <StatusBar style="light" />
      </MainLayout>
    );
  }

  // Page d'accueil avec le nouveau design
  const displayCurrentTrack = playback.getDisplayCurrentTrack();
  
  return (
    <MainLayout
      currentTrack={displayCurrentTrack}
      playbackState={playback.playbackState}
      onPlaylistPress={handleLikedTracksPress}
      onPause={playback.pausePlayback}
      onResume={playback.resumePlayback}
      onNext={playback.skipToNext}
      onPrevious={playback.skipToPrevious}
      onToggleShuffle={playback.toggleShuffle}
      onToggleRepeat={playback.toggleRepeat}
      onSeek={(position) => {
        // TODO: Implémenter la fonction seek dans usePlayback
        console.log('Seek to position:', position);
      }}
      onVolumeChange={(volume) => {
        // TODO: Implémenter la fonction setVolume dans usePlayback
        console.log('Volume change:', volume);
      }}
      onLogoPress={() => {}}
    >
      <HomeContent 
        playlists={playlists.playlistsInfo.playlists}
        loading={playlists.loading}
        onPlaylistPress={handlePlaylistPress}
      />
      <StatusBar style="light" />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutButtonText: {
    fontSize: 14,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    fontSize: 14,
  },
  placeholder: {
    width: 80,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
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