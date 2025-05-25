import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../utils/colors';
import { useSearch } from '../hooks/useSearch';
import { Artist, Album, Track } from '../types/spotify';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onTrackPress: (trackUri: string, tracks: Track[]) => void;
}

const { width, height } = Dimensions.get('window');

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onTrackPress,
}) => {
  const [searchText, setSearchText] = useState('');
  const search = useSearch();

  useEffect(() => {
    if (!visible) {
      setSearchText('');
      search.reset();
    }
  }, [visible]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      search.search(text);
    } else {
      search.clearSearch();
    }
  };

  const handleArtistPress = (artist: Artist) => {
    search.fetchArtistAlbums(artist);
  };

  const handleAlbumPress = (album: Album) => {
    search.fetchAlbumTracks(album);
  };

  const handleTrackPress = (track: Track) => {
    if (search.albumTracks) {
      // Si on est dans un album, jouer depuis l'album
      onTrackPress(track.uri, search.albumTracks.tracks);
    } else if (search.searchResults?.tracks) {
      // Si on est dans les résultats de recherche, jouer depuis les résultats
      onTrackPress(track.uri, search.searchResults.tracks.items);
    }
  };

  const renderSearchResults = () => {
    if (search.loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.purple} />
          <Text className="text-white mt-4">Recherche en cours...</Text>
        </View>
      );
    }

    if (!search.searchResults) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400 text-lg">
            Recherchez des artistes, albums ou titres
          </Text>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Artistes */}
        {search.searchResults.artists && search.searchResults.artists.items.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">Artistes</Text>
            {search.searchResults.artists.items.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.background.secondary }}
                onPress={() => handleArtistPress(artist)}
              >
                <Image
                  source={{ uri: artist.images[0]?.url || 'https://via.placeholder.com/60' }}
                  className="w-15 h-15 rounded-full"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{artist.name}</Text>
                  <Text className="text-gray-400">
                    {artist.followers.total.toLocaleString()} abonnés
                  </Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Albums */}
        {search.searchResults.albums && search.searchResults.albums.items.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">Albums</Text>
            {search.searchResults.albums.items.map((album) => (
              <TouchableOpacity
                key={album.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.background.secondary }}
                onPress={() => handleAlbumPress(album)}
              >
                <Image
                  source={{ uri: album.images[0]?.url || 'https://via.placeholder.com/60' }}
                  className="w-15 h-15 rounded-lg"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{album.name}</Text>
                  <Text className="text-gray-400">
                    {album.artists.map(a => a.name).join(', ')} • {album.release_date.split('-')[0]}
                  </Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Titres */}
        {search.searchResults.tracks && search.searchResults.tracks.items.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">Titres</Text>
            {search.searchResults.tracks.items.map((track) => (
              <TouchableOpacity
                key={track.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.background.secondary }}
                onPress={() => handleTrackPress(track)}
              >
                <Image
                  source={{ uri: track.album.images[0]?.url || 'https://via.placeholder.com/60' }}
                  className="w-15 h-15 rounded-lg"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{track.name}</Text>
                  <Text className="text-gray-400">
                    {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderArtistAlbums = () => {
    if (!search.selectedArtist) return null;

    return (
      <View className="flex-1">
        {/* Header artiste */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={search.goBackToSearch}
            className="mr-4 p-2 rounded-full"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: search.selectedArtist.images[0]?.url || 'https://via.placeholder.com/80' }}
            className="w-20 h-20 rounded-full"
          />
          <View className="flex-1 ml-4">
            <Text className="text-white text-2xl font-bold">{search.selectedArtist.name}</Text>
            <Text className="text-gray-400">
              {search.selectedArtist.followers.total.toLocaleString()} abonnés
            </Text>
          </View>
        </View>

        {/* Albums */}
        {search.loadingArtistAlbums ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary.purple} />
            <Text className="text-white mt-4">Chargement des albums...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <Text className="text-white text-xl font-bold mb-4">Albums</Text>
            {search.artistAlbums?.albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.background.secondary }}
                onPress={() => handleAlbumPress(album)}
              >
                <Image
                  source={{ uri: album.images[0]?.url || 'https://via.placeholder.com/60' }}
                  className="w-15 h-15 rounded-lg"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{album.name}</Text>
                  <Text className="text-gray-400">
                    {album.release_date.split('-')[0]} • {album.total_tracks} titres
                  </Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderAlbumTracks = () => {
    if (!search.selectedAlbum) return null;

    return (
      <View className="flex-1">
        {/* Header album */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={search.goBackToArtist}
            className="mr-4 p-2 rounded-full"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: search.selectedAlbum.images[0]?.url || 'https://via.placeholder.com/80' }}
            className="w-20 h-20 rounded-lg"
          />
          <View className="flex-1 ml-4">
            <Text className="text-white text-2xl font-bold">{search.selectedAlbum.name}</Text>
            <Text className="text-gray-400">
              {search.selectedAlbum.artists.map(a => a.name).join(', ')} • {search.selectedAlbum.release_date.split('-')[0]}
            </Text>
          </View>
        </View>

        {/* Tracks */}
        {search.loadingAlbumTracks ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary.purple} />
            <Text className="text-white mt-4">Chargement des titres...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <Text className="text-white text-xl font-bold mb-4">Titres</Text>
            {search.albumTracks?.tracks.map((track, index) => (
              <TouchableOpacity
                key={track.id}
                className="flex-row items-center p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.background.secondary }}
                onPress={() => handleTrackPress(track)}
              >
                <View className="w-8 items-center">
                  <Text className="text-gray-400 font-semibold">{index + 1}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{track.name}</Text>
                  <Text className="text-gray-400">
                    {track.artists.map(a => a.name).join(', ')}
                  </Text>
                </View>
                <Text className="text-gray-400">
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (search.selectedAlbum && search.albumTracks) {
      return renderAlbumTracks();
    }
    if (search.selectedArtist && search.artistAlbums) {
      return renderArtistAlbums();
    }
    return renderSearchResults();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={80}
        style={{
          flex: 1,
          width: width,
          height: height,
        }}
      >
        <View className="flex-1 pt-16 px-4">
          {/* Header avec barre de recherche */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={onClose}
              className="mr-4 p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Text className="text-white text-lg">✕</Text>
            </TouchableOpacity>
            
            {!search.selectedArtist && !search.selectedAlbum && (
              <View className="flex-1 flex-row items-center px-4 py-3 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                <Text className="text-gray-400 mr-3">🔍</Text>
                <TextInput
                  value={searchText}
                  onChangeText={handleSearch}
                  placeholder="Rechercher des artistes, albums, titres..."
                  placeholderTextColor={colors.text.secondary}
                  className="flex-1 text-white text-lg"
                  autoFocus={true}
                />
              </View>
            )}
          </View>

          {/* Contenu */}
          {renderContent()}
        </View>
      </BlurView>
    </Modal>
  );
}; 