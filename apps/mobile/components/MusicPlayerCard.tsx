import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';
import { Track, PlaybackState } from '../types/spotify';
import { playerService } from '../services/playerService';

interface MusicPlayerCardProps {
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlaylistPress: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onTrackPress?: () => void;
  isInLayout?: boolean;
  playbackMethod?: string;
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
  onTrackPress,
  isInLayout = false,
  playbackMethod,
}) => {
  const isPlaying = playbackState?.is_playing || false;
  const isShuffled = playbackState?.shuffle_state || false;

  // Fonction pour forcer l'utilisation du Computer
  const handleForceComputer = async () => {
    try {
      console.log('🖥️ [MusicPlayerCard] Force Computer demandé par utilisateur');
      const success = await playerService.forceUseComputerDevice();
      if (success) {
        console.log('✅ [MusicPlayerCard] Basculement vers Computer réussi');
        // Attendre un peu pour que l'appareil soit prêt
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('❌ [MusicPlayerCard] Échec basculement vers Computer');
      }
    } catch (error) {
      console.error('❌ [MusicPlayerCard] Erreur force Computer:', error);
    }
  };

  // Version simplifiée pour le layout principal
  if (isInLayout) {
    return (
      <View className="px-4 pb-4">
        {/* Lecteur musical */}
        {currentTrack && (
          <LinearGradient
            colors={[
              'rgba(139, 69, 255, 0.15)',
              'rgba(88, 28, 135, 0.25)',
              'rgba(59, 7, 100, 0.35)'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl"
            style={{
              borderRadius: 24,
              shadowColor: colors.primary.purple,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(139, 69, 255, 0.2)',
            }}
          >
            <TouchableOpacity 
              onPress={onTrackPress}
              className="rounded-3xl p-3 flex-row items-center"
              style={{ 
                backgroundColor: 'transparent',
                borderRadius: 24,
              }}
              activeOpacity={0.8}
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text 
                    className="text-text-secondary text-xs"
                    style={{ color: colors.text.secondary }}
                    numberOfLines={1}
                  >
                    {currentTrack.artists.map(artist => artist.name).join(', ')}
                  </Text>
                  {playbackMethod && (
                    <View style={{ 
                      marginLeft: 6, 
                      paddingHorizontal: 4, 
                      paddingVertical: 1, 
                      backgroundColor: playbackMethod === 'Remote SDK' ? 'rgba(139, 69, 255, 0.2)' : 'rgba(75, 85, 99, 0.3)',
                      borderRadius: 4 
                    }}>
                      <Text style={{ 
                        fontSize: 8, 
                        color: playbackMethod === 'Remote SDK' ? colors.primary.purple : colors.text.secondary,
                        fontWeight: '600'
                      }}>
                        {playbackMethod === 'Remote SDK' ? '🎵 Remote' : '🌐 Web'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Contrôles de lecture */}
              <View className="flex-row items-center space-x-1">
                {/* Bouton shuffle */}
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleShuffle();
                  }}
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
                  onPress={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
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
                  onPress={(e) => {
                    e.stopPropagation();
                    isPlaying ? onPause() : onResume();
                  }}
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
                  onPress={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="p-1.5"
                >
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={colors.text.primary} 
                  />
                </TouchableOpacity>

                {/* Bouton Computer (Debug/Fallback) */}
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    handleForceComputer();
                  }}
                  className="p-1.5"
                >
                  <Ionicons 
                    name="desktop" 
                    size={16} 
                    color={colors.primary.purple} 
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Message d'aide temporaire */}
        {currentTrack && (
          <Text 
            style={{ 
              color: colors.text.secondary, 
              fontSize: 10, 
              textAlign: 'center', 
              marginTop: 4 
            }}
          >
            💡 Problème avec iPhone ? Cliquez sur l'icône 🖥️ pour basculer vers l'ordinateur
          </Text>
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
        <LinearGradient
          colors={[
            'rgba(139, 69, 255, 0.15)',
            'rgba(88, 28, 135, 0.25)',
            'rgba(59, 7, 100, 0.35)'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl"
          style={{
            borderRadius: 24,
            shadowColor: colors.primary.purple,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(139, 69, 255, 0.2)',
          }}
        >
          <TouchableOpacity 
            onPress={onTrackPress}
            className="rounded-3xl p-3 flex-row items-center"
            style={{ 
              backgroundColor: 'transparent',
              borderRadius: 24,
            }}
            activeOpacity={0.8}
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
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleShuffle();
                }}
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
                onPress={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
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
                onPress={(e) => {
                  e.stopPropagation();
                  isPlaying ? onPause() : onResume();
                }}
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
                onPress={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="p-1.5"
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>

              {/* Bouton Computer (Debug/Fallback) */}
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  handleForceComputer();
                }}
                className="p-1.5"
              >
                <Ionicons 
                  name="desktop" 
                  size={16} 
                  color={colors.primary.purple} 
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}; 