import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { Track, PlaybackState } from '../types/spotify';

interface MusicPlayerCardProps {
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlaylistPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  isInLayout?: boolean;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({
  currentTrack,
  playbackState,
  onPlaylistPress,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onToggleShuffle,
  isInLayout = false,
}) => {
  const isPlaying = playbackState?.is_playing || false;
  const isShuffled = playbackState?.shuffle_state || false;

  // Version simplifiée pour le layout principal
  if (isInLayout) {
    return (
      <View>
        {/* Bouton playlist principal */}
        <View className="items-center mb-4">
          <TouchableOpacity 
            onPress={onPlaylistPress}
            className="bg-background-card px-6 py-3 rounded-full flex-row items-center"
            style={{ backgroundColor: colors.background.card }}
          >
            <Ionicons 
              name="heart" 
              size={20} 
              color={colors.text.primary} 
              style={{ marginRight: 8 }}
            />
            <Text 
              className="text-text-primary font-semibold text-base"
              style={{ color: colors.text.primary }}
            >
              Playlist principal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lecteur musical */}
        {currentTrack && (
          <View 
            className="bg-background-secondary rounded-3xl p-3 flex-row items-center"
            style={{ backgroundColor: colors.background.secondary }}
          >
            {/* Image de l'album */}
            <View className="w-10 h-10 rounded-lg bg-text-secondary mr-3 overflow-hidden">
              {currentTrack.album.images?.[0]?.url ? (
                <Image 
                  source={{ uri: currentTrack.album.images[0].url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View 
                  className="w-full h-full justify-center items-center"
                  style={{ backgroundColor: colors.text.secondary }}
                >
                  <Ionicons name="musical-notes" size={16} color={colors.background.primary} />
                </View>
              )}
            </View>

            {/* Informations du titre */}
            <View className="flex-1 mr-3">
              <Text 
                className="text-text-primary font-semibold text-sm"
                style={{ color: colors.text.primary }}
                numberOfLines={1}
              >
                {currentTrack.name}
              </Text>
              <Text 
                className="text-text-secondary text-xs"
                style={{ color: colors.text.secondary }}
                numberOfLines={1}
              >
                {currentTrack.artists.map(artist => artist.name).join(', ')}
              </Text>
            </View>

            {/* Contrôles de lecture */}
            <View className="flex-row items-center space-x-1">
              {/* Bouton shuffle */}
              <TouchableOpacity 
                onPress={onToggleShuffle}
                className="p-1.5"
              >
                <Ionicons 
                  name="shuffle" 
                  size={14} 
                  color={isShuffled ? colors.primary.purple : colors.text.secondary} 
                />
              </TouchableOpacity>

              {/* Bouton précédent */}
              <TouchableOpacity 
                onPress={onPrevious}
                className="p-1.5"
              >
                <Ionicons 
                  name="chevron-back" 
                  size={18} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>

              {/* Bouton play/pause */}
              <TouchableOpacity 
                onPress={isPlaying ? onPause : onResume}
                className="p-1.5"
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={20} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>

              {/* Bouton suivant */}
              <TouchableOpacity 
                onPress={onNext}
                className="p-1.5"
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>

              {/* Bouton Frame (icône personnalisée) */}
              <TouchableOpacity className="p-1.5">
                <View 
                  className="w-4 h-4 border-2 rounded border-primary-purple"
                  style={{ borderColor: colors.primary.purple }}
                >
                  <Text 
                    className="text-xs text-center"
                    style={{ 
                      color: colors.primary.purple,
                      fontSize: 6,
                      lineHeight: 12
                    }}
                  >
                    Frame
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Version complète originale
  return (
    <View className="mx-4 mb-6">
      {/* Logo et bouton playlist principal */}
      <View className="items-center mb-6">
        <Image 
          source={require('../assets/logo.png')} 
          className="w-16 h-16 mb-4"
          resizeMode="contain"
        />
        
        <TouchableOpacity 
          onPress={onPlaylistPress}
          className="bg-background-card px-6 py-3 rounded-full flex-row items-center"
          style={{ backgroundColor: colors.background.card }}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={colors.text.primary} 
            style={{ marginRight: 8 }}
          />
          <Text 
            className="text-text-primary font-semibold text-base"
            style={{ color: colors.text.primary }}
          >
            Playlist principal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section "Ordre date" */}
      <Text 
        className="text-text-primary text-lg font-semibold mb-4"
        style={{ color: colors.text.primary }}
      >
        Ordre date
      </Text>

      {/* Cartes de playlist */}
      <View className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <View 
            key={index}
            className="bg-text-secondary rounded-lg p-4"
            style={{ backgroundColor: colors.text.secondary }}
          >
            <Text 
              className="text-background-primary text-center font-medium text-base"
              style={{ color: colors.background.primary }}
            >
              Playlist {index}
            </Text>
          </View>
        ))}
      </View>

      {/* Lecteur musical en bas */}
      {currentTrack && (
        <View 
          className="bg-background-secondary rounded-3xl p-3 flex-row items-center"
          style={{ backgroundColor: colors.background.secondary }}
        >
          {/* Image de l'album */}
          <View className="w-10 h-10 rounded-lg bg-text-secondary mr-3 overflow-hidden">
            {currentTrack.album.images?.[0]?.url ? (
              <Image 
                source={{ uri: currentTrack.album.images[0].url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View 
                className="w-full h-full justify-center items-center"
                style={{ backgroundColor: colors.text.secondary }}
              >
                <Ionicons name="musical-notes" size={16} color={colors.background.primary} />
              </View>
            )}
          </View>

          {/* Informations du titre */}
          <View className="flex-1 mr-3">
            <Text 
              className="text-text-primary font-semibold text-sm"
              style={{ color: colors.text.primary }}
              numberOfLines={1}
            >
              {currentTrack.name}
            </Text>
            <Text 
              className="text-text-secondary text-xs"
              style={{ color: colors.text.secondary }}
              numberOfLines={1}
            >
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </Text>
          </View>

          {/* Contrôles de lecture */}
          <View className="flex-row items-center space-x-1">
            {/* Bouton shuffle */}
            <TouchableOpacity 
              onPress={onToggleShuffle}
              className="p-1.5"
            >
              <Ionicons 
                name="shuffle" 
                size={14} 
                color={isShuffled ? colors.primary.purple : colors.text.secondary} 
              />
            </TouchableOpacity>

            {/* Bouton précédent */}
            <TouchableOpacity 
              onPress={onPrevious}
              className="p-1.5"
            >
              <Ionicons 
                name="chevron-back" 
                size={18} 
                color={colors.text.primary} 
              />
            </TouchableOpacity>

            {/* Bouton play/pause */}
            <TouchableOpacity 
              onPress={isPlaying ? onPause : onResume}
              className="p-1.5"
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={20} 
                color={colors.text.primary} 
              />
            </TouchableOpacity>

            {/* Bouton suivant */}
            <TouchableOpacity 
              onPress={onNext}
              className="p-1.5"
            >
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={colors.text.primary} 
              />
            </TouchableOpacity>

            {/* Bouton Frame (icône personnalisée) */}
            <TouchableOpacity className="p-1.5">
              <View 
                className="w-4 h-4 border-2 rounded border-primary-purple"
                style={{ borderColor: colors.primary.purple }}
              >
                <Text 
                  className="text-xs text-center"
                  style={{ 
                    color: colors.primary.purple,
                    fontSize: 6,
                    lineHeight: 12
                  }}
                >
                  Frame
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}; 