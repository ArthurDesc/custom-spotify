import { useState, useCallback } from 'react';
import { SearchResults, Artist, Album, ArtistAlbumsInfo, AlbumTracksInfo, Track } from '../types/spotify';
import spotifyService from '../services/spotifyService';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour les artistes
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<ArtistAlbumsInfo | null>(null);
  const [loadingArtistAlbums, setLoadingArtistAlbums] = useState(false);

  // État pour les albums
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumTracks, setAlbumTracks] = useState<AlbumTracksInfo | null>(null);
  const [loadingAlbumTracks, setLoadingAlbumTracks] = useState(false);

  const search = useCallback(async (query: string, types: string[] = ['artist', 'album', 'track']) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const results = await spotifyService.search(query, types);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtistAlbums = useCallback(async (artist: Artist, offset: number = 0, reset: boolean = true) => {
    setLoadingArtistAlbums(true);
    setError(null);

    if (reset) {
      setSelectedArtist(artist);
      setArtistAlbums(null);
    }

    try {
      const response = await spotifyService.getArtistAlbums(artist.id, offset);
      
      const newAlbumsInfo: ArtistAlbumsInfo = {
        albums: response.items,
        hasMore: response.next !== null,
        offset: response.offset,
        total: response.total,
      };

      if (reset) {
        setArtistAlbums(newAlbumsInfo);
      } else {
        setArtistAlbums(prev => prev ? {
          ...newAlbumsInfo,
          albums: [...prev.albums, ...newAlbumsInfo.albums],
        } : newAlbumsInfo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des albums');
    } finally {
      setLoadingArtistAlbums(false);
    }
  }, []);

  const fetchAlbumTracks = useCallback(async (album: Album, offset: number = 0, reset: boolean = true) => {
    setLoadingAlbumTracks(true);
    setError(null);

    if (reset) {
      setSelectedAlbum(album);
      setAlbumTracks(null);
    }

    try {
      const response = await spotifyService.getAlbumTracks(album.id, offset);
      
      // Enrichir les tracks avec les informations de l'album
      const enrichedTracks: Track[] = response.items.map((track: any) => ({
        ...track,
        album: {
          name: album.name,
          images: album.images,
        },
        artists: track.artists || album.artists,
      }));

      const newAlbumTracksInfo: AlbumTracksInfo = {
        album,
        tracks: enrichedTracks,
        hasMore: response.next !== null,
        offset: response.offset,
      };

      if (reset) {
        setAlbumTracks(newAlbumTracksInfo);
      } else {
        setAlbumTracks(prev => prev ? {
          ...newAlbumTracksInfo,
          tracks: [...prev.tracks, ...newAlbumTracksInfo.tracks],
        } : newAlbumTracksInfo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tracks');
    } finally {
      setLoadingAlbumTracks(false);
    }
  }, []);

  const loadMoreArtistAlbums = useCallback(async () => {
    if (!selectedArtist || !artistAlbums || !artistAlbums.hasMore || loadingArtistAlbums) return;
    
    const nextOffset = artistAlbums.offset + artistAlbums.albums.length;
    await fetchArtistAlbums(selectedArtist, nextOffset, false);
  }, [selectedArtist, artistAlbums, loadingArtistAlbums, fetchArtistAlbums]);

  const loadMoreAlbumTracks = useCallback(async () => {
    if (!selectedAlbum || !albumTracks || !albumTracks.hasMore || loadingAlbumTracks) return;
    
    const nextOffset = albumTracks.offset + albumTracks.tracks.length;
    await fetchAlbumTracks(selectedAlbum, nextOffset, false);
  }, [selectedAlbum, albumTracks, loadingAlbumTracks, fetchAlbumTracks]);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchQuery('');
    setError(null);
  }, []);

  const goBackToSearch = useCallback(() => {
    setSelectedArtist(null);
    setArtistAlbums(null);
    setSelectedAlbum(null);
    setAlbumTracks(null);
    setError(null);
  }, []);

  const goBackToArtist = useCallback(() => {
    setSelectedAlbum(null);
    setAlbumTracks(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setSearchResults(null);
    setSearchQuery('');
    setSelectedArtist(null);
    setArtistAlbums(null);
    setSelectedAlbum(null);
    setAlbumTracks(null);
    setLoading(false);
    setLoadingArtistAlbums(false);
    setLoadingAlbumTracks(false);
    setError(null);
  }, []);

  return {
    // État de recherche
    searchResults,
    searchQuery,
    loading,
    error,

    // État des artistes
    selectedArtist,
    artistAlbums,
    loadingArtistAlbums,

    // État des albums
    selectedAlbum,
    albumTracks,
    loadingAlbumTracks,

    // Actions
    search,
    fetchArtistAlbums,
    fetchAlbumTracks,
    loadMoreArtistAlbums,
    loadMoreAlbumTracks,
    clearSearch,
    goBackToSearch,
    goBackToArtist,
    reset,
  };
}; 