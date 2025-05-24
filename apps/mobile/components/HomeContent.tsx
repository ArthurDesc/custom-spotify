import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../utils/colors';
import { Playlist } from '../types/spotify';

interface HomeContentProps {
  playlists: Playlist[];
  loading: boolean;
  onPlaylistPress: (playlist: Playlist) => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  playlists,
  loading,
  onPlaylistPress,
}) => {
  return (
    <ScrollView className="flex-1 px-4">
      {/* Section "Mes playlists" */}
      <Text 
        className="text-text-primary text-lg font-semibold mb-4"
        style={{ color: colors.text.primary }}
      >
        Mes playlists
      </Text>

      {loading ? (
        <View className="items-center py-8">
          <Text 
            className="text-text-secondary"
            style={{ color: colors.text.secondary }}
          >
            Chargement des playlists...
          </Text>
        </View>
      ) : (
        <View className="space-y-3 pb-4">
          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              onPress={() => onPlaylistPress(playlist)}
              className="bg-background-card rounded-xl p-4 flex-row items-center"
              style={{ backgroundColor: colors.background.card }}
            >
              {/* Image de la playlist */}
              <View className="w-12 h-12 rounded-lg mr-3 overflow-hidden">
                {playlist.images?.[0]?.url ? (
                  <Image 
                    source={{ uri: playlist.images[0].url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View 
                    className="w-full h-full justify-center items-center"
                    style={{ backgroundColor: colors.text.secondary }}
                  >
                    <Text className="text-lg">🎵</Text>
                  </View>
                )}
              </View>

              {/* Informations de la playlist */}
              <View className="flex-1">
                <Text 
                  className="text-text-primary font-semibold text-base"
                  style={{ color: colors.text.primary }}
                  numberOfLines={1}
                >
                  {playlist.name}
                </Text>
                <Text 
                  className="text-text-secondary text-sm"
                  style={{ color: colors.text.secondary }}
                  numberOfLines={1}
                >
                  {playlist.tracks.total} titre{playlist.tracks.total > 1 ? 's' : ''}
                  {playlist.owner.display_name && ` • ${playlist.owner.display_name}`}
                </Text>
              </View>

              {/* Flèche */}
              <Text 
                className="text-text-secondary text-lg"
                style={{ color: colors.text.secondary }}
              >
                ▶
              </Text>
            </TouchableOpacity>
          ))}
          
          {playlists.length === 0 && !loading && (
            <View className="items-center py-8">
              <Text 
                className="text-text-secondary text-center"
                style={{ color: colors.text.secondary }}
              >
                Aucune playlist trouvée
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}; 