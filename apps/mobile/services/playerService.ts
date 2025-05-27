import { PlaybackState } from '../types/spotify';
import { authService } from './authService';

class PlayerService {
  // Vérifier si il y a une session de lecture active
  private async hasActivePlaybackSession(): Promise<boolean> {
    try {
      const state = await this.getPlaybackState();
      return state !== null && state.device !== null;
    } catch (error) {
      console.warn('🔍 [PlayerService] Impossible de vérifier l\'état de lecture:', error);
      return false;
    }
  }

  // Méthode helper pour retry avec réactivation d'appareil
  private async retryWithDeviceReactivation<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 1
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Si ce n'est pas une erreur 403 "Restriction violated", on ne retry pas
        if (!error || typeof error !== 'object' || !('message' in error)) {
          throw error;
        }
        
        const errorMessage = (error as Error).message;
        const isRestrictionViolated = errorMessage.includes('Restriction violated') || 
                                    errorMessage.includes('appareil n\'est peut-être plus actif');
        
        if (!isRestrictionViolated || attempt >= maxRetries) {
          throw error;
        }

        console.log(`🔄 [PlayerService] Tentative ${attempt + 1}/${maxRetries + 1} échouée pour ${operationName}, essai de réactivation...`);
        
        // Tenter de réactiver le dernier appareil actif
        try {
          const { deviceService } = await import('./deviceService');
          const reactivationSuccess = await deviceService.reactivateLastDevice();
          
          if (!reactivationSuccess) {
            console.log(`❌ [PlayerService] Échec réactivation pour ${operationName}, abandon`);
            throw error;
          }
          
          console.log(`✅ [PlayerService] Réactivation réussie pour ${operationName}, retry...`);
          // Petit délai pour s'assurer que l'appareil est prêt
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (reactivationError) {
          console.log(`❌ [PlayerService] Erreur lors de la réactivation pour ${operationName}:`, reactivationError);
          throw error;
        }
      }
    }

    throw lastError || new Error(`Failed ${operationName} after retries`);
  }

  // Méthode utilitaire pour forcer l'utilisation du Computer de fallback
  async forceUseComputerDevice(): Promise<boolean> {
    try {
      console.log(`🖥️ [PlayerService] Force utilisation Computer demandée`);
      const { deviceService } = await import('./deviceService');
      
      const computerDevice = deviceService.getFallbackComputerDevice();
      if (!computerDevice) {
        console.log(`❌ [PlayerService] Aucun Computer disponible`);
        return false;
      }

      await deviceService.transferPlayback(computerDevice.id, false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ [PlayerService] Computer ${computerDevice.name} activé avec succès`);
      return true;
      
    } catch (error) {
      console.log(`❌ [PlayerService] Erreur force Computer:`, error);
      return false;
    }
  }

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
  async playTracks(uris: string[], offset?: { position: number }, contextUri?: string): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🎵 [PlayerService] Début playTracks`);
    console.log(`🎵 [PlayerService] URIs (${uris.length}):`, uris);
    console.log(`🎵 [PlayerService] Offset:`, offset);
    console.log(`🎵 [PlayerService] Context URI:`, contextUri);
    console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const body: any = {};
    
    // Si on a un context URI (playlist/album), l'utiliser avec offset
    if (contextUri) {
      body.context_uri = contextUri;
      if (offset) body.offset = offset;
    } else {
      // Sinon utiliser les URIs directement
      body.uris = uris;
      if (offset) body.offset = offset;
    }

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
    await this.retryWithDeviceReactivation(async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) throw new Error('No access token');

      console.log(`⏸️ [PlayerService] Début pause`);
      console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

      // Vérifier qu'il y a une session active avant de faire pause
      const hasSession = await this.hasActivePlaybackSession();
      if (!hasSession) {
        console.log(`⚠️ [PlayerService] Aucune session de lecture active pour pause`);
        throw new Error('Aucune session de lecture active. Lancez d\'abord une musique.');
      }

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
          const originalMessage = errorData?.error?.message || '';
          if (originalMessage.includes('Restriction violated')) {
            throw new Error('Impossible de mettre en pause. L\'appareil n\'est peut-être plus actif ou la session a expiré.');
          }
          throw new Error('Pause restreinte. Vérifiez votre compte Spotify Premium.');
        } else if (response.status === 401) {
          throw new Error('Token expiré. Reconnectez-vous.');
        } else {
          const message = errorData?.error?.message || 'Failed to pause playback';
          throw new Error(`Erreur pause: ${message} (${response.status})`);
        }
      } else {
        console.log(`✅ [PlayerService] Pause réussie`);
      }
    }, 'pause');
  }

  async resumePlayback(): Promise<void> {
    await this.retryWithDeviceReactivation(async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) throw new Error('No access token');

      console.log(`▶️ [PlayerService] Début reprise`);
      console.log(`🔑 [PlayerService] Token utilisé: ${accessToken.substring(0, 20)}...`);

      // Vérifier qu'il y a une session active avant de faire resume
      const hasSession = await this.hasActivePlaybackSession();
      if (!hasSession) {
        console.log(`⚠️ [PlayerService] Aucune session de lecture active pour reprise`);
        throw new Error('Aucune session de lecture active. Lancez d\'abord une musique.');
      }

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
          const originalMessage = errorData?.error?.message || '';
          if (originalMessage.includes('Restriction violated')) {
            throw new Error('Impossible de reprendre la lecture. L\'appareil n\'est peut-être plus actif ou la session a expiré.');
          }
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
    }, 'resume');
  }

  async skipToNext(): Promise<void> {
    await this.retryWithDeviceReactivation(async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) throw new Error('No access token');

      console.log(`⏭️ [PlayerService] Début skip to next`);

      const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log(`📡 [PlayerService] Réponse skip next: Status ${response.status}`);

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText || 'Unknown error' } };
        }

        if (response.status === 403 && errorData?.error?.message?.includes('Restriction violated')) {
          throw new Error('Impossible de passer au titre suivant. L\'appareil n\'est peut-être plus actif ou la session a expiré.');
        }
        
        throw new Error('Failed to skip to next');
      }
      
      console.log(`✅ [PlayerService] Skip to next réussi`);
    }, 'skip next');
  }

  async skipToPrevious(): Promise<void> {
    await this.retryWithDeviceReactivation(async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) throw new Error('No access token');

      console.log(`⏮️ [PlayerService] Début skip to previous`);

      const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log(`📡 [PlayerService] Réponse skip previous: Status ${response.status}`);

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText || 'Unknown error' } };
        }

        if (response.status === 403 && errorData?.error?.message?.includes('Restriction violated')) {
          throw new Error('Impossible de revenir au titre précédent. L\'appareil n\'est peut-être plus actif ou la session a expiré.');
        }
        
        throw new Error('Failed to skip to previous');
      }
      
      console.log(`✅ [PlayerService] Skip to previous réussi`);
    }, 'skip previous');
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