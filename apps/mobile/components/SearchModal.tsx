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
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { useSearch } from '../hooks/useSearch';
import { ImageWithFallback } from './ImageWithFallback';
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
          <Text className="text-white text-lg text-center px-8">
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
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onPress={() => handleArtistPress(artist)}
              >
                <ImageWithFallback
                  uri={artist.images[0]?.url}
                  style={{ width: 64, height: 64 }}
                  fallbackIcon="person"
                  fallbackIconSize={28}
                  isCircular={true}
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{artist.name}</Text>
                  <Text className="text-gray-300">
                    {artist.followers.total.toLocaleString()} abonnés
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onPress={() => handleAlbumPress(album)}
              >
                <ImageWithFallback
                  uri={album.images[0]?.url}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                  fallbackIcon="disc"
                  fallbackIconSize={28}
                  isCircular={false}
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{album.name}</Text>
                  <Text className="text-gray-300">
                    {album.artists.map(a => a.name).join(', ')} • {album.release_date.split('-')[0]}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onPress={() => handleTrackPress(track)}
              >
                <ImageWithFallback
                  uri={track.album.images[0]?.url}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                  fallbackIcon="musical-notes"
                  fallbackIconSize={28}
                  isCircular={false}
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{track.name}</Text>
                  <Text className="text-gray-300">
                    {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                  </Text>
                </View>
                <Ionicons name="play" size={20} color="#9CA3AF" />
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
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <ImageWithFallback
            uri={search.selectedArtist.images[0]?.url}
            style={{ width: 80, height: 80 }}
            fallbackIcon="person"
            fallbackIconSize={36}
            isCircular={true}
          />
          <View className="flex-1 ml-4">
            <Text className="text-white text-2xl font-bold">{search.selectedArtist.name}</Text>
            <Text className="text-gray-200">
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
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onPress={() => handleAlbumPress(album)}
              >
                <ImageWithFallback
                  uri={album.images[0]?.url}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                  fallbackIcon="disc"
                  fallbackIconSize={28}
                  isCircular={false}
                />
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{album.name}</Text>
                  <Text className="text-gray-300">
                    {album.release_date.split('-')[0]} • {album.total_tracks} titres
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <ImageWithFallback
            uri={search.selectedAlbum.images[0]?.url}
            style={{ width: 80, height: 80, borderRadius: 8 }}
            fallbackIcon="disc"
            fallbackIconSize={36}
            isCircular={false}
          />
          <View className="flex-1 ml-4">
            <Text className="text-white text-2xl font-bold">{search.selectedAlbum.name}</Text>
            <Text className="text-gray-200">
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
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onPress={() => handleTrackPress(track)}
              >
                <View className="w-8 items-center">
                  <Text className="text-gray-300 font-semibold">{index + 1}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-lg">{track.name}</Text>
                  <Text className="text-gray-300">
                    {track.artists.map(a => a.name).join(', ')}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-300 text-sm">
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </Text>
                  <Ionicons name="play" size={16} color="#9CA3AF" style={{ marginTop: 2 }} />
                </View>
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
              className="mr-4 p-3 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {!search.selectedArtist && !search.selectedAlbum && (
              <View 
                className="flex-1 flex-row items-center px-4 rounded-full" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  height: 50,
                  minHeight: 50 
                }}
              >
                <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                <TextInput
                  value={searchText}
                  onChangeText={handleSearch}
                  placeholder="Rechercher des artistes, albums, titres..."
                  placeholderTextColor="#9CA3AF"
                  style={{ 
                    flex: 1, 
                    color: 'white', 
                    fontSize: 16,
                    lineHeight: 20,
                    textAlignVertical: 'center',
                    includeFontPadding: false,
                    paddingVertical: 0
                  }}
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