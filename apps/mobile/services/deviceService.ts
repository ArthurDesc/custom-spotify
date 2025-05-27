import { authService } from './authService';
import { playerService } from './playerService';

class DeviceService {
  // Cache du dernier appareil actif connu
  private lastActiveDevice: { id: string; name: string; type: string } | null = null;
  // Cache de l'appareil Computer de fallback
  private fallbackComputerDevice: { id: string; name: string } | null = null;

  // Déterminer si un appareil est problématique pour les commandes
  private isProblematicDevice(deviceType: string, deviceName: string): boolean {
    // Les iPhones et appareils mobiles peuvent avoir des problèmes de synchronisation
    const problematicTypes = ['Smartphone', 'Tablet'];
    const problematicNames = ['iPhone', 'iPad', 'Android'];
    
    return problematicTypes.includes(deviceType) || 
           problematicNames.some(name => deviceName.toLowerCase().includes(name.toLowerCase()));
  }

  // Obtenir le délai d'attente adaptatif selon le type d'appareil
  private getDeviceWaitTime(deviceType: string): number {
    switch (deviceType.toLowerCase()) {
      case 'smartphone':
      case 'tablet':
        return 2000; // 2 secondes pour mobiles
      case 'computer':
        return 1000; // 1 seconde pour ordinateurs
      default:
        return 1500; // 1.5 secondes par défaut
    }
  }

  // Obtenir les appareils disponibles avec retry logic
  async getAvailableDevices(retries: number = 3): Promise<any> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🔍 [DeviceService] Début récupération appareils (${retries} tentatives max)`);
    console.log(`🔑 [DeviceService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📡 [DeviceService] Tentative ${attempt}/${retries} - Appel API Spotify devices`);
        
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log(`📡 [DeviceService] Réponse API: Status ${response.status} - ${response.statusText}`);
        console.log(`📡 [DeviceService] Headers de réponse:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ [DeviceService] Appareils récupérés (tentative ${attempt}):`, data.devices.length);
          console.log(`📱 [DeviceService] Données complètes appareils:`, JSON.stringify(data.devices, null, 2));
          
          // Analyser chaque appareil et mettre à jour les caches
          data.devices.forEach((device: any, index: number) => {
            const isProblematic = this.isProblematicDevice(device.type, device.name);
            
            console.log(`📱 [DeviceService] Appareil ${index + 1}:`, {
              id: device.id,
              name: device.name,
              type: device.type,
              is_active: device.is_active,
              is_private_session: device.is_private_session,
              is_restricted: device.is_restricted,
              volume_percent: device.volume_percent,
              problematic: isProblematic
            });

            // Mettre à jour le cache du dernier appareil actif
            if (device.is_active) {
              this.lastActiveDevice = { 
                id: device.id, 
                name: device.name, 
                type: device.type 
              };
              console.log(`💾 [DeviceService] Cache mis à jour - dernier appareil actif: ${device.name} (${device.type}${isProblematic ? ' - PROBLÉMATIQUE' : ''})`);
            }

            // Cache de l'appareil Computer de fallback
            if (device.type === 'Computer' && !device.is_restricted) {
              this.fallbackComputerDevice = { id: device.id, name: device.name };
              console.log(`💾 [DeviceService] Computer de fallback: ${device.name}`);
            }
          });
          
          return data;
        }

        const errorText = await response.text();
        console.log(`❌ [DeviceService] Erreur brute de l'API:`, errorText);
        
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText || 'Unknown error' } };
        }

        console.log(`❌ [DeviceService] Erreur parsée:`, errorData);

        // Gestion spécifique des erreurs
        if (response.status === 401) {
          throw new Error('Token expiré. Reconnectez-vous.');
        } else if (response.status === 429) {
          // Rate limiting - attendre avant retry
          const retryAfter = response.headers.get('Retry-After') || '1';
          console.log(`⏳ [DeviceService] Rate limit atteint, attente ${retryAfter}s...`);
          await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
          continue;
        } else if (response.status >= 500 && attempt < retries) {
          // Erreur serveur - retry
          console.log(`⚠️ [DeviceService] Erreur serveur (${response.status}), retry ${attempt}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        const message = errorData?.error?.message || 'Failed to fetch devices';
        throw new Error(`Erreur appareils: ${message} (${response.status})`);
        
      } catch (error) {
        console.log(`❌ [DeviceService] Erreur tentative ${attempt}:`, error);
        if (attempt === retries) {
          console.error(`❌ [DeviceService] Échec final récupération appareils:`, error);
          throw error;
        }
        console.log(`⚠️ [DeviceService] Tentative ${attempt} échouée, retry...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error('Failed to fetch devices after retries');
  }

  // Obtenir le dernier appareil actif connu depuis le cache
  getLastActiveDevice(): { id: string; name: string; type: string } | null {
    return this.lastActiveDevice;
  }

  // Obtenir l'appareil Computer de fallback
  getFallbackComputerDevice(): { id: string; name: string } | null {
    return this.fallbackComputerDevice;
  }

  // Réactiver automatiquement avec stratégie intelligente
  async reactivateLastDevice(): Promise<boolean> {
    if (!this.lastActiveDevice) {
      console.log(`⚠️ [DeviceService] Aucun appareil en cache pour réactivation`);
      return false;
    }

    try {
      const isProblematic = this.isProblematicDevice(this.lastActiveDevice.type, this.lastActiveDevice.name);
      console.log(`🔄 [DeviceService] Réactivation intelligente: ${this.lastActiveDevice.name} (${this.lastActiveDevice.type}${isProblematic ? ' - PROBLÉMATIQUE' : ''})`);
      
      // Vérifier d'abord si l'appareil est toujours disponible
      const devicesResponse = await this.getAvailableDevices();
      const cachedDevice = devicesResponse.devices.find((d: any) => d.id === this.lastActiveDevice!.id);
      
      if (!cachedDevice) {
        console.log(`❌ [DeviceService] Appareil en cache ${this.lastActiveDevice.name} non trouvé dans la liste`);
        
        // Essayer le fallback computer si disponible
        if (this.fallbackComputerDevice) {
          console.log(`🔄 [DeviceService] Basculement vers Computer de fallback: ${this.fallbackComputerDevice.name}`);
          return await this.activateComputerFallback();
        }
        
        this.lastActiveDevice = null;
        return false;
      }

      // Pour les appareils problématiques (iPhone, etc.), forcer un transfert même s'ils semblent actifs
      if (isProblematic) {
        console.log(`🚨 [DeviceService] Appareil problématique détecté, force transfert même si actif`);
        
        // Pour les iPhones, essayer d'abord de transférer vers le Computer puis retour vers iPhone
        if (this.fallbackComputerDevice && cachedDevice.type === 'Smartphone') {
          console.log(`🔄 [DeviceService] Stratégie iPhone: Computer → iPhone`);
          
          // Étape 1: Transférer vers Computer
          await this.transferPlayback(this.fallbackComputerDevice.id, false);
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Étape 2: Retransférer vers iPhone
          await this.transferPlayback(this.lastActiveDevice.id, false);
          const waitTime = this.getDeviceWaitTime(this.lastActiveDevice.type);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
        } else {
          // Force transfert simple
          await this.transferPlayback(this.lastActiveDevice.id, false);
          const waitTime = this.getDeviceWaitTime(this.lastActiveDevice.type);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
      } else if (!cachedDevice.is_active) {
        // Pour les appareils non problématiques, transfert standard si inactif
        console.log(`🔄 [DeviceService] Appareil non problématique inactif, transfert standard`);
        await this.transferPlayback(this.lastActiveDevice.id, false);
        const waitTime = this.getDeviceWaitTime(this.lastActiveDevice.type);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
      } else {
        console.log(`✅ [DeviceService] Appareil ${this.lastActiveDevice.name} déjà actif et non problématique`);
        return true;
      }

      // Vérifier que l'activation a fonctionné
      const updatedDevicesResponse = await this.getAvailableDevices();
      const updatedDevice = updatedDevicesResponse.devices.find((d: any) => d.id === this.lastActiveDevice!.id);
      
      if (updatedDevice && updatedDevice.is_active) {
        console.log(`✅ [DeviceService] Réactivation intelligente réussie: ${this.lastActiveDevice.name}`);
        return true;
      } else {
        console.log(`❌ [DeviceService] Échec réactivation intelligente: ${this.lastActiveDevice.name}`);
        
        // Essayer le fallback computer en dernier recours
        if (this.fallbackComputerDevice && this.lastActiveDevice.id !== this.fallbackComputerDevice.id) {
          console.log(`🆘 [DeviceService] Dernier recours: activation Computer de fallback`);
          return await this.activateComputerFallback();
        }
        
        return false;
      }
      
    } catch (error) {
      console.log(`❌ [DeviceService] Erreur réactivation intelligente:`, error);
      
      // Essayer le fallback computer en cas d'erreur
      if (this.fallbackComputerDevice) {
        console.log(`🆘 [DeviceService] Erreur détectée, essai Computer de fallback`);
        return await this.activateComputerFallback();
      }
      
      return false;
    }
  }

  // Activer l'appareil Computer de fallback
  private async activateComputerFallback(): Promise<boolean> {
    if (!this.fallbackComputerDevice) {
      console.log(`❌ [DeviceService] Aucun Computer de fallback disponible`);
      return false;
    }

    try {
      console.log(`🖥️ [DeviceService] Activation Computer de fallback: ${this.fallbackComputerDevice.name}`);
      
      await this.transferPlayback(this.fallbackComputerDevice.id, false);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai Computer plus court
      
      // Mettre à jour le cache
      this.lastActiveDevice = { 
        id: this.fallbackComputerDevice.id, 
        name: this.fallbackComputerDevice.name, 
        type: 'Computer' 
      };
      
      console.log(`✅ [DeviceService] Computer de fallback activé avec succès`);
      return true;
      
    } catch (error) {
      console.log(`❌ [DeviceService] Échec activation Computer de fallback:`, error);
      return false;
    }
  }

  // Validation préalable d'un appareil avant transfert
  async validateDeviceBeforeTransfer(deviceId: string, deviceName: string): Promise<{ canTransfer: boolean; reason?: string; deviceState?: any }> {
    console.log(`🏥 [DeviceService] Validation préalable appareil: ${deviceName} (${deviceId})`);
    
    try {
      // 1. Vérifier que l'appareil est toujours dans la liste
      const devicesResponse = await this.getAvailableDevices();
      const device = devicesResponse.devices.find((d: any) => d.id === deviceId);
      
      if (!device) {
        console.log(`❌ [DeviceService] Appareil ${deviceName} non trouvé dans la liste`);
        return { canTransfer: false, reason: 'Device not found in list' };
      }

      console.log(`✅ [DeviceService] Appareil trouvé:`, {
        name: device.name,
        type: device.type,
        is_active: device.is_active,
        is_restricted: device.is_restricted,
        volume_percent: device.volume_percent
      });

      // 2. Vérifier les restrictions
      if (device.is_restricted) {
        console.log(`⚠️ [DeviceService] Appareil ${deviceName} restreint`);
        return { canTransfer: false, reason: 'Device is restricted', deviceState: device };
      }

      // 3. Si l'appareil n'est pas actif, essayer un transfert doux d'abord
      if (!device.is_active) {
        console.log(`🔄 [DeviceService] Appareil ${deviceName} inactif, test transfert doux...`);
        
        try {
          await this.softTransferPlayback(deviceId);
          
          // Attendre un peu puis vérifier l'état
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const updatedDevicesResponse = await this.getAvailableDevices();
          const updatedDevice = updatedDevicesResponse.devices.find((d: any) => d.id === deviceId);
          
          if (!updatedDevice) {
            console.log(`❌ [DeviceService] Appareil ${deviceName} disparu après transfert doux`);
            return { canTransfer: false, reason: 'Device disappeared after soft transfer' };
          }
          
          console.log(`✅ [DeviceService] Transfert doux réussi, appareil ${deviceName} maintenant:`, {
            is_active: updatedDevice.is_active,
            volume_percent: updatedDevice.volume_percent
          });
          
          return { canTransfer: true, deviceState: updatedDevice };
          
        } catch (error) {
          console.log(`❌ [DeviceService] Échec transfert doux:`, error);
          return { 
            canTransfer: false, 
            reason: 'Soft transfer failed', 
            deviceState: device 
          };
        }
      }

      console.log(`✅ [DeviceService] Appareil ${deviceName} validé pour transfert`);
      return { canTransfer: true, deviceState: device };
      
    } catch (error) {
      console.log(`❌ [DeviceService] Erreur validation appareil:`, error);
      return { canTransfer: false, reason: 'Validation failed' };
    }
  }

  // Transfert doux (sans lecture) pour réveiller un appareil
  async softTransferPlayback(deviceId: string): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🔄 [DeviceService] Transfert doux vers appareil ${deviceId} (play: false)`);

    const requestBody = {
      device_ids: [deviceId],
      play: false,
    };

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📡 [DeviceService] Réponse transfert doux: Status ${response.status}`);

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [DeviceService] Erreur transfert doux:`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Unknown error' } };
      }

      throw new Error(`Soft transfer failed: ${errorData?.error?.message || 'Unknown error'} (${response.status})`);
    }
    
    console.log(`✅ [DeviceService] Transfert doux réussi`);
  }

  // Transférer la lecture vers un appareil avec validation préalable
  async transferPlayback(deviceId: string, play: boolean = true): Promise<void> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    console.log(`🔄 [DeviceService] Début transfert vers appareil ${deviceId} (play: ${play})`);
    console.log(`🔑 [DeviceService] Token utilisé: ${accessToken.substring(0, 20)}...`);

    const requestBody = {
      device_ids: [deviceId],
      play: play,
    };

    console.log(`📡 [DeviceService] Body de la requête:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📡 [DeviceService] Réponse transfert: Status ${response.status} - ${response.statusText}`);
    console.log(`📡 [DeviceService] Headers de réponse transfert:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [DeviceService] Erreur brute transfert:`, errorText);
      
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText || 'Unknown error' } };
      }

      console.log(`❌ [DeviceService] Erreur parsée transfert:`, errorData);

      // Gestion spécifique des erreurs courantes
      if (response.status === 404) {
        throw new Error('Appareil non trouvé ou Spotify fermé sur cet appareil.');
      } else if (response.status === 403) {
        throw new Error('Transfert non autorisé. Vérifiez votre compte Spotify Premium.');
      } else if (response.status === 401) {
        throw new Error('Token expiré. Reconnectez-vous.');
      } else if (response.status === 500) {
        // Erreur 500 spécifique - problème d'état de l'appareil
        console.log(`🚨 [DeviceService] Erreur 500 détectée - problème d'état appareil`);
        throw new Error('Appareil dans un état invalide. L\'appareil Spotify doit être ouvert et prêt à recevoir des commandes.');
      } else if (response.status === 502 || response.status === 503) {
        throw new Error('Appareil temporairement indisponible. Réessayez dans quelques secondes.');
      } else {
        const message = errorData?.error?.message || 'Failed to transfer playback';
        throw new Error(`Erreur transfert: ${message} (${response.status})`);
      }
    } else {
      console.log(`✅ [DeviceService] Transfert réussi vers ${deviceId}`);
    }
  }

  // Transfert sécurisé avec validation préalable
  async safeTransferPlayback(deviceId: string, deviceName: string, play: boolean = true): Promise<void> {
    console.log(`🛡️ [DeviceService] Transfert sécurisé vers ${deviceName} (${deviceId})`);
    
    // 1. Validation préalable
    const validation = await this.validateDeviceBeforeTransfer(deviceId, deviceName);
    
    if (!validation.canTransfer) {
      console.log(`❌ [DeviceService] Validation échouée: ${validation.reason}`);
      throw new Error(`Impossible de transférer vers ${deviceName}: ${validation.reason}`);
    }
    
    console.log(`✅ [DeviceService] Validation réussie pour ${deviceName}`);
    
    // 2. Transfert avec lecture si demandé
    if (play && validation.deviceState && !validation.deviceState.is_active) {
      console.log(`🎵 [DeviceService] Appareil validé mais inactif, transfert avec lecture...`);
    }
    
    await this.transferPlayback(deviceId, play);
    console.log(`✅ [DeviceService] Transfert sécurisé réussi vers ${deviceName}`);
  }

  // Méthode pour assurer qu'un appareil est actif avec session de lecture
  async ensureActiveDevice(): Promise<any> {
    console.log(`🔧 [DeviceService] Début ensureActiveDevice`);
    
    const devicesResponse = await this.getAvailableDevices();
    const devices = devicesResponse.devices;
    
    console.log('📱 [DeviceService] Vérification appareils disponibles:', devices.length);
    
    if (devices.length === 0) {
      throw new Error('Aucun appareil Spotify trouvé. Assurez-vous que Spotify est ouvert sur un appareil.');
    }

    // Chercher un appareil actif
    let activeDevice = devices.find((device: any) => device.is_active);
    
    console.log(`🔍 [DeviceService] Appareil actif trouvé:`, activeDevice ? activeDevice.name : 'Aucun');
    
    if (!activeDevice) {
      // Si aucun appareil actif, prendre le premier disponible
      activeDevice = devices[0];
      console.log(`🔄 [DeviceService] Activation automatique de l'appareil: ${activeDevice.name} (${activeDevice.id})`);
      
      // Transférer la lecture vers cet appareil avec une piste pour initialiser la session
      await this.initializeDevicePlayback(activeDevice.id);
    } else {
      console.log(`✅ [DeviceService] Appareil déjà actif: ${activeDevice.name}`);
    }

    return activeDevice;
  }

  // Initialiser la lecture sur un appareil avec une session de base
  async initializeDevicePlayback(deviceId: string): Promise<void> {
    try {
      console.log('🎵 [DeviceService] Initialisation de la session de lecture...');
      
      // D'abord transférer sans jouer
      console.log('🔄 [DeviceService] Étape 1: Transfert sans lecture');
      await this.transferPlayback(deviceId, false);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérifier que le transfert a fonctionné
      console.log('🔍 [DeviceService] Vérification du transfert...');
      const devicesAfterTransfer = await this.getAvailableDevices();
      const targetDevice = devicesAfterTransfer.devices.find((d: any) => d.id === deviceId);
      
      if (targetDevice && targetDevice.is_active) {
        console.log('✅ [DeviceService] Transfert confirmé, appareil actif');
      } else {
        console.log('⚠️ [DeviceService] Transfert non confirmé');
      }
      
      // Ensuite démarrer la lecture avec une piste populaire par défaut
      // Cela crée une session de lecture que Spotify peut contrôler
      const defaultTrackUri = 'spotify:track:4VnDmjYCZkyeqeb0NIKqdA'; // Une piste populaire
      
      try {
        console.log('🎵 [DeviceService] Étape 2: Démarrage piste par défaut');
        await playerService.playTracks([defaultTrackUri]);
        console.log('✅ [DeviceService] Session de lecture initialisée');
        
        // Mettre en pause immédiatement pour laisser l'utilisateur contrôler
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('⏸️ [DeviceService] Étape 3: Mise en pause');
        await playerService.pausePlayback();
        console.log('⏸️ [DeviceService] Session mise en pause, prête pour contrôle utilisateur');
        
      } catch (playError) {
        console.warn('⚠️ [DeviceService] Impossible de démarrer la session de lecture:', playError);
        // Même si ça échoue, le transfert a peut-être fonctionné
      }
      
    } catch (error) {
      console.error('❌ [DeviceService] Erreur initialisation appareil:', error);
      throw error;
    }
  }

  // Méthode améliorée pour jouer des pistes avec gestion automatique des appareils
  async playTracksWithDeviceCheck(uris: string[], offset?: { position: number }, contextUri?: string): Promise<void> {
    console.log(`🎵 [DeviceService] playTracksWithDeviceCheck pour ${uris.length} pistes`);
    console.log(`🎵 [DeviceService] URIs:`, uris);
    console.log(`🎵 [DeviceService] Offset:`, offset);
    console.log(`🎵 [DeviceService] Context URI:`, contextUri);
    
    try {
      // Essayer de jouer directement d'abord
      console.log('🎵 [DeviceService] Tentative de lecture directe...');
      await playerService.playTracks(uris, offset, contextUri);
      console.log('✅ [DeviceService] Lecture directe réussie');
    } catch (error) {
      console.log('🔍 [DeviceService] Échec de lecture directe, vérification des appareils...');
      console.log('❌ [DeviceService] Erreur lecture directe:', error);
      
      // Assurer qu'un appareil est actif
      const activeDevice = await this.ensureActiveDevice();
      
      console.log(`🎵 [DeviceService] Tentative de lecture sur: ${activeDevice.name} (${activeDevice.id})`);
      
      // Réessayer de jouer
      console.log('🎵 [DeviceService] Retry lecture après initialisation appareil...');
      await playerService.playTracks(uris, offset, contextUri);
      console.log('✅ [DeviceService] Lecture réussie après initialisation');
    }
  }
}

// Instance singleton
export const deviceService = new DeviceService();
export default deviceService; 