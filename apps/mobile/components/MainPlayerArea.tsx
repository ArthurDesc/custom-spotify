import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Track, PlaybackState } from '../types/spotify';
import { colors } from '../utils/colors';

interface MainPlayerAreaProps {
  currentTrack: Track;
  playbackState?: PlaybackState | null;
  onPlayPause: () => void;
  currentSource?: string; // Nom de l'album/playlist en cours
}

const { width: screenWidth } = Dimensions.get('window');

export const MainPlayerArea: React.FC<MainPlayerAreaProps> = ({
  currentTrack,
  playbackState,
  onPlayPause,
  currentSource,
}) => {
  const isPlaying = playbackState?.is_playing || false;
  
  // Utiliser le vrai nom de l'album/playlist ou un fallback
  const displaySource = currentSource || currentTrack.album.name || "Lecture en cours";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}
    >
      {/* Section du haut - Header et Informations - Repositionnée pour être plus compacte */}
      <View style={{ alignItems: 'center', marginBottom: 20, position: 'absolute', top: 90, left: 20, right: 20 }}>
        {/* Header "En cours de lecture" */}
        <Text
          style={{
            fontSize: 14,
            color: colors.primary.purple,
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: 15,
          }}
        >
          *{displaySource}*
        </Text>

        {/* Informations de la piste - Layout centré */}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          {/* Artiste */}
          <Text
            style={{
              fontSize: 16,
              color: colors.text.primary,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </Text>

          {/* Titre du son */}
          <Text
            style={{
              fontSize: 20,
              color: colors.text.primary,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {currentTrack.name}
          </Text>
          
          {/* Album */}
          <Text
            style={{
              fontSize: 14,
              color: colors.text.secondary,
              textAlign: 'center',
              fontWeight: '500',
            }}
            numberOfLines={2}
          >
            {currentTrack.album.name}
          </Text>
        </View>
      </View>

      {/* Image de l'album/track cliquable pour play/pause - Parfaitement centrée */}
      <TouchableOpacity
        onPress={onPlayPause}
        style={{ alignItems: 'center' }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[
            `${colors.primary.purple}30`,
            `${colors.primary.lightPurple}20`,
            `${colors.primary.darkPurple}40`,
          ]}
          style={{
            width: screenWidth * 0.9,
            height: screenWidth * 0.9,
            borderRadius: 25,
            padding: 3,
            shadowColor: colors.primary.purple,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 22,
              overflow: 'hidden',
              backgroundColor: colors.background.card,
            }}
          >
          {currentTrack.album.images?.[0]?.url ? (
            <Image
              source={{ uri: currentTrack.album.images[0].url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.background.secondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="musical-notes" size={60} color={colors.text.muted} />
            </View>
          )}
          
          {/* Overlay pour indiquer l'état play/pause */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isPlaying ? 0 : 0.9,
            }}
          >
            <LinearGradient
              colors={[
                `${colors.primary.purple}80`,
                `${colors.primary.lightPurple}60`,
              ]}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary.purple,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={35}
                color={colors.text.primary}
                style={{ marginLeft: isPlaying ? 0 : 3 }}
              />
            </LinearGradient>
          </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}; 