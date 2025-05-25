import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { Playlist } from '../types/spotify';

interface HomeContentProps {
  playlists: Playlist[];
  loading: boolean;
  onPlaylistPress: (playlist: Playlist) => void;
  onMainPlaylistPress: () => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  playlists,
  loading,
  onPlaylistPress,
  onMainPlaylistPress,
}) => {
  return (
    <ScrollView 
      className="flex-1 px-6"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Bouton playlist principal */}
      <View className="items-center mb-6">
        <TouchableOpacity 
          onPress={onMainPlaylistPress}
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

      {/* Section "Mes playlists" */}
      <View className="mb-6">
        <Text 
          className="text-2xl font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          Les playlists fréro
        </Text>
        <Text 
          className="text-sm"
          style={{ color: colors.text.secondary }}
        >
          Ouais c'est les playlists ouais
        </Text>
      </View>

      {loading ? (
        <View className="items-center py-12">
          <View 
            className="w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: colors.primary.purple }}
          />
          <Text 
            className="text-base"
            style={{ color: colors.text.secondary }}
          >
            Chargement des playlists...
          </Text>
        </View>
      ) : (
        <View className="space-y-4">
          {playlists.map((playlist, index) => (
            <TouchableOpacity
              key={playlist.id}
              onPress={() => onPlaylistPress(playlist)}
              className="rounded-2xl p-5 flex-row items-center shadow-lg"
              style={{ 
                backgroundColor: colors.background.card,
                borderWidth: 1,
                borderColor: colors.border.primary,
                marginBottom: 12,
                shadowColor: colors.primary.purple,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
              activeOpacity={0.8}
            >
              {/* Image de la playlist */}
              <View 
                className="w-16 h-16 rounded-xl mr-4 overflow-hidden"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {playlist.images?.[0]?.url ? (
                  <Image 
                    source={{ uri: playlist.images[0].url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View 
                    className="w-full h-full justify-center items-center"
                    style={{ 
                      backgroundColor: colors.background.tertiary,
                      borderWidth: 1,
                      borderColor: colors.border.secondary,
                    }}
                  >
                    <Text className="text-2xl">🎵</Text>
                  </View>
                )}
              </View>

              {/* Informations de la playlist */}
              <View className="flex-1 pr-3">
                <Text 
                  className="font-bold text-lg mb-1"
                  style={{ color: colors.text.primary }}
                  numberOfLines={1}
                >
                  {playlist.name}
                </Text>
                <Text 
                  className="text-sm mb-1"
                  style={{ color: colors.text.secondary }}
                  numberOfLines={1}
                >
                  {playlist.tracks.total} titre{playlist.tracks.total > 1 ? 's' : ''}
                </Text>
                {playlist.owner.display_name && (
                  <Text 
                    className="text-xs"
                    style={{ color: colors.text.muted }}
                    numberOfLines={1}
                  >
                    Par {playlist.owner.display_name}
                  </Text>
                )}
              </View>

              {/* Indicateur visuel */}
              <View 
                className="w-8 h-8 rounded-full justify-center items-center"
                style={{ backgroundColor: colors.primary.purple + '20' }}
              >
                <View 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary.purple }}
                />
              </View>
            </TouchableOpacity>
          ))}
          
          {playlists.length === 0 && !loading && (
            <View className="items-center py-16">
              <View 
                className="w-20 h-20 rounded-full justify-center items-center mb-4"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <Text className="text-3xl">🎵</Text>
              </View>
              <Text 
                className="text-lg font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Aucune playlist trouvée
              </Text>
              <Text 
                className="text-center text-sm"
                style={{ color: colors.text.secondary }}
              >
                Créez votre première playlist sur Spotify{'\n'}pour la voir apparaître ici
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}; 