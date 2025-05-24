export interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  country: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
  uri: string;
}

export interface PlaybackState {
  is_playing: boolean;
  item: Track | null;
  progress_ms: number;
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  } | null;
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
}

export interface LikedTracksInfo {
  total: number;
  tracks: Track[];
  hasMore: boolean;
  offset: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
}

export interface PlaylistsInfo {
  total: number;
  playlists: Playlist[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
} 