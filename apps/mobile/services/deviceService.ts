import { authService } from './authService';
import { playerService } from './playerService';

class DeviceService {
  // Obtenir les appareils disponibles
  async getAvailableDevices(): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
  }

  // Transférer la lecture vers un appareil
  async transferPlayback(deviceId: string, play: boolean = true): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: play,
      }),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to transfer playback');
    }
  }

  // Méthode améliorée pour jouer des pistes avec gestion automatique des appareils
  async playTracksWithDeviceCheck(uris: string[], offset?: { position: number }): Promise<void> {
    try {
      // Essayer de jouer directement d'abord
      await playerService.playTracks(uris, offset);
    } catch (error) {
      console.log('🔍 Échec de lecture directe, vérification des appareils...');
      
      // Si ça échoue, vérifier les appareils disponibles
      const devicesResponse = await this.getAvailableDevices();
      const devices = devicesResponse.devices;
      
      console.log('📱 Appareils trouvés:', devices.length);
      devices.forEach((device: any, index: number) => {
        console.log(`📱 Appareil ${index + 1}: ${device.name} (${device.type}) - Actif: ${device.is_active}`);
      });

      if (devices.length === 0) {
        throw new Error('Aucun appareil Spotify trouvé. Assurez-vous que Spotify est ouvert sur un appareil.');
      }

      // Chercher un appareil actif
      let activeDevice = devices.find((device: any) => device.is_active);
      
      if (!activeDevice) {
        // Si aucun appareil actif, prendre le premier disponible
        activeDevice = devices[0];
        console.log(`🔄 Transfert vers l'appareil: ${activeDevice.name}`);
        
        // Transférer la lecture vers cet appareil
        await this.transferPlayback(activeDevice.id, false);
        
        // Attendre un peu que le transfert se fasse
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`🎵 Tentative de lecture sur: ${activeDevice.name}`);
      
      // Réessayer de jouer
      await playerService.playTracks(uris, offset);
    }
  }
}

// Instance singleton
export const deviceService = new DeviceService();
export default deviceService; 