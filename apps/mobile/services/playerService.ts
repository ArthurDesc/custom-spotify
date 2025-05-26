import { PlaybackState } from '../types/spotify';
import { authService } from './authService';

class PlayerService {
  // État de lecture
  async getPlaybackState(): Promise<PlaybackState | null> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🔍 [PlayerService] Récupération état de lecture`);
    console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 [PlayerService] Réponse playback state: Status ${response.status} - ${response.statusText}`);

    if (response.status === 204) {
      console.log(`📡 [PlayerService] Aucune lecture en cours (204)`);
      return null;
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ [PlayerService] Erreur playback state:`, errorText);
      throw new Error('Failed to fetch playback state');
    }
    
    const data = await response.json();
    console.log(`📡 [PlayerService] État de lecture récupéré:`, data);
    return data;
  }

  // Contrôles de lecture
  async playTracks(uris: string[], offset?: { position: number }): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🎵 [PlayerService] Début playTracks`);
    console.log(`🎵 [PlayerService] URIs (${uris.length}):`, uris);
    console.log(`🎵 [PlayerService] Offset:`, offset);
    console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const body: any = { uris };
    if (offset) body.offset = offset;

    console.log(`📡 [PlayerService] Body de la requête:`, JSON.stringify(body, null, 2));

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`📡 [PlayerService] Réponse play: Status ${response.status} - ${response.statusText}`);
    console.log(`📡 [PlayerService] Headers de réponse play:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [PlayerService] Erreur brute play:`, errorText);
      
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Unknown error' } };
      }

      console.log(`❌ [PlayerService] Erreur parsée play:`, errorData);

      // Gestion spécifique des erreurs courantes
      if (response.status === 404) {
        throw new Error('Aucun appareil actif trouvé. Ouvrez Spotify sur un appareil.');
      } else if (response.status === 403) {
        throw new Error('Lecture restreinte. Vérifiez votre compte Spotify Premium.');
      } else if (response.status === 401) {
        throw new Error('Token expiré. Reconnectez-vous.');
      } else if (response.status === 502 || response.status === 503) {
        throw new Error('Service Spotify temporairement indisponible. Réessayez dans quelques secondes.');
      } else {
        const message = errorData?.error?.message || 'Failed to play tracks';
        throw new Error(`Erreur lecture: ${message} (${response.status})`);
      }
    } else {
      console.log(`✅ [PlayerService] Lecture démarrée avec succès`);
    }
  }

  async pausePlayback(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`⏸️ [PlayerService] Début pause`);
    console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 [PlayerService] Réponse pause: Status ${response.status} - ${response.statusText}`);

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [PlayerService] Erreur brute pause:`, errorText);
      
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Unknown error' } };
      }

      console.log(`❌ [PlayerService] Erreur parsée pause:`, errorData);

      // Gestion spécifique des erreurs courantes
      if (response.status === 404) {
        throw new Error('Aucun appareil actif trouvé. Ouvrez Spotify sur un appareil.');
      } else if (response.status === 403) {
        throw new Error('Lecture restreinte. Vérifiez votre compte Spotify Premium.');
      } else if (response.status === 401) {
        throw new Error('Token expiré. Reconnectez-vous.');
      } else {
        const message = errorData?.error?.message || 'Failed to pause playback';
        throw new Error(`Erreur pause: ${message} (${response.status})`);
      }
    } else {
      console.log(`✅ [PlayerService] Pause réussie`);
    }
  }

  async resumePlayback(): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`▶️ [PlayerService] Début reprise`);
    console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 [PlayerService] Réponse resume: Status ${response.status} - ${response.statusText}`);

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [PlayerService] Erreur brute resume:`, errorText);
      
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Unknown error' } };
      }

      console.log(`❌ [PlayerService] Erreur parsée resume:`, errorData);

      // Gestion spécifique des erreurs courantes
      if (response.status === 404) {
        throw new Error('Aucun appareil actif trouvé. Ouvrez Spotify sur un appareil.');
      } else if (response.status === 403) {
        throw new Error('Lecture restreinte. Vérifiez votre compte Spotify Premium.');
      } else if (response.status === 401) {
        throw new Error('Token expiré. Reconnectez-vous.');
      } else {
        const message = errorData?.error?.message || 'Failed to resume playback';
        throw new Error(`Erreur reprise: ${message} (${response.status})`);
      }
    } else {
      console.log(`✅ [PlayerService] Reprise réussie`);
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