import { PlaybackState } from '../types/spotify';
import { authService } from './authService';

class PlayerService {
  // État de lecture
  async getPlaybackState(): Promise<PlaybackState | null> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Failed to fetch playback state');
    return response.json();
  }

  // Contrôles de lecture
  async playTracks(uris: string[], offset?: { position: number }): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const body: any = { uris };
    if (offset) body.offset = offset;

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to play tracks');
    }
  }

  async pausePlayback(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to pause playback');
    }
  }

  async resumePlayback(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to resume playback');
    }
  }

  async skipToNext(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to skip to next');
    }
  }

  async skipToPrevious(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to skip to previous');
    }
  }

  async setShuffle(state: boolean): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set shuffle');
    }
  }

  async setRepeat(state: 'off' | 'track' | 'context'): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set repeat');
    }
  }

  async setVolume(volume: number): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set volume');
    }
  }
}

// Instance singleton
export const playerService = new PlayerService();
export default playerService; 