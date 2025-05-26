import { authService } from './authService';

// Interfaces pour les types
interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  is_restricted: boolean;
  is_private_session: boolean;
  supports_volume: boolean;
  volume_percent: number;
}

interface SpotifyAPIResponse<T> {
  status: number;
  data: T;
  headers: { [key: string]: string };
  error?: string;
  success?: boolean;
}

interface SpotifyDevicesResponse {
  devices: SpotifyDevice[];
}

interface SpotifyPlaybackState {
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  context: {
    uri: string;
    type: string;
  } | null;
  progress_ms: number;
  item: {
    id: string;
    name: string;
    uri: string;
    duration_ms: number;
  } | null;
  is_playing: boolean;
}

interface DeviceAnalysis {
  totalDevices: number;
  activeDevices: number;
  restrictedDevices: number;
  privateSessionDevices: number;
  deviceTypes: { [key: string]: number };
  recommendations: string[];
}

interface DeviceHealthResult {
  healthy: boolean;
  error?: string;
  step?: string;
  deviceState?: SpotifyDevice;
  softTransferResult?: SpotifyAPIResponse<void>;
  recommendations?: string[];
  details?: string;
}

class DebugService {
  // Test direct de l'API des appareils
  async testDevicesAPI(): Promise<SpotifyAPIResponse<SpotifyDevicesResponse>> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      console.log('❌ [Debug] Aucun token disponible');
      return { status: 401, data: { devices: [] }, headers: {}, error: 'No token' };
    }

    console.log('🔍 [Debug] Test direct API Spotify Devices');
    console.log('🔑 [Debug] Token complet:', accessToken);
    console.log('🔑 [Debug] Token longueur:', accessToken.length);

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('📡 [Debug] Status:', response.status);
      console.log('📡 [Debug] Headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('📡 [Debug] Response body raw:', text);

      let data: SpotifyDevicesResponse;
      try {
        data = text ? JSON.parse(text) : { devices: [] };
        console.log('📡 [Debug] Response body parsed:', data);
      } catch {
        data = { devices: [] };
        console.log('📡 [Debug] Response body non-JSON:', text);
      }

      return { 
        status: response.status, 
        data, 
        headers: Object.fromEntries(response.headers.entries()) 
      };
    } catch (error) {
      console.error('❌ [Debug] Erreur fetch:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        status: 500, 
        data: { devices: [] }, 
        headers: {}, 
        error: errorMessage 
      };
    }
  }

  // Test transfert vers un appareil spécifique
  async testTransferAPI(deviceId: string): Promise<SpotifyAPIResponse<void>> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      console.log('❌ [Debug] Aucun token disponible');
      return { status: 401, data: undefined, headers: {}, error: 'No token' };
    }

    console.log('🔍 [Debug] Test direct API Spotify Transfer');
    console.log('🔑 [Debug] Token:', accessToken.substring(0, 20) + '...');
    console.log('🎯 [Debug] Device ID:', deviceId);

    const body = {
      device_ids: [deviceId],
      play: true
    };

    console.log('📡 [Debug] Body:', JSON.stringify(body, null, 2));

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('📡 [Debug] Transfer Status:', response.status);
      console.log('📡 [Debug] Transfer Headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('📡 [Debug] Transfer Response body raw:', text);

      return { 
        status: response.status, 
        data: undefined, 
        headers: Object.fromEntries(response.headers.entries()) 
      };
    } catch (error) {
      console.error('❌ [Debug] Erreur transfer fetch:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        status: 500, 
        data: undefined, 
        headers: {}, 
        error: errorMessage 
      };
    }
  }

  // Test de l'état de lecture
  async testPlaybackState(): Promise<SpotifyAPIResponse<SpotifyPlaybackState | null>> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      console.log('❌ [Debug] Aucun token disponible');
      return { status: 401, data: null, headers: {}, error: 'No token' };
    }

    console.log('🔍 [Debug] Test direct API Spotify Playback State');

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('📡 [Debug] Playback State Status:', response.status);
      console.log('📡 [Debug] Playback State Headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 204) {
        console.log('📡 [Debug] Pas de lecture en cours (204)');
        return { status: 204, data: null, headers: Object.fromEntries(response.headers.entries()) };
      }

      const text = await response.text();
      console.log('📡 [Debug] Playback State Response body raw:', text);

      let data: SpotifyPlaybackState | null;
      try {
        data = text ? JSON.parse(text) : null;
        console.log('📡 [Debug] Playback State Response body parsed:', data);
      } catch {
        data = null;
        console.log('📡 [Debug] Playback State Response body non-JSON:', text);
      }

      return { 
        status: response.status, 
        data, 
        headers: Object.fromEntries(response.headers.entries()) 
      };
    } catch (error) {
      console.error('❌ [Debug] Erreur playback state fetch:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        status: 500, 
        data: null, 
        headers: {}, 
        error: errorMessage 
      };
    }
  }

  // Validation de la santé d'un appareil spécifique
  async validateDeviceHealth(deviceId: string, deviceName: string): Promise<DeviceHealthResult> {
    console.log(`🏥 [Debug] === VALIDATION SANTÉ APPAREIL ${deviceName} ===`);
    console.log(`🎯 [Debug] ID appareil: ${deviceId}`);
    
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      return { error: 'No token', healthy: false };
    }

    // 1. Vérifier si l'appareil est toujours dans la liste
    console.log('📋 [Debug] Étape 1: Vérification présence dans la liste...');
    const devicesResult = await this.testDevicesAPI();
    const deviceExists = devicesResult.data?.devices?.find((d: any) => d.id === deviceId);
    
    if (!deviceExists) {
      console.log('❌ [Debug] Appareil introuvable dans la liste');
      return { error: 'Device not in list', healthy: false, step: 'device_list_check' };
    }
    
    console.log('✅ [Debug] Appareil trouvé dans la liste:', {
      name: deviceExists.name,
      type: deviceExists.type,
      is_active: deviceExists.is_active,
      is_restricted: deviceExists.is_restricted,
      volume_percent: deviceExists.volume_percent
    });

    // 2. Test de transfert doux (sans lecture)
    console.log('🔄 [Debug] Étape 2: Test transfert doux (sans lecture)...');
    try {
      const softTransferResult = await this.testSoftTransfer(deviceId);
      console.log('✅ [Debug] Transfert doux réussi');
      
      // 3. Vérifier l'état après transfert doux
      console.log('🔍 [Debug] Étape 3: Vérification état après transfert doux...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1s
      
      const postTransferDevices = await this.testDevicesAPI();
      const postTransferDevice = postTransferDevices.data?.devices?.find((d: any) => d.id === deviceId);
      
      if (!postTransferDevice) {
        console.log('❌ [Debug] Appareil disparu après transfert doux');
        return { error: 'Device disappeared after soft transfer', healthy: false, step: 'soft_transfer' };
      }
      
      console.log('✅ [Debug] Appareil toujours présent après transfert doux:', {
        is_active: postTransferDevice.is_active,
        volume_percent: postTransferDevice.volume_percent
      });
      
      return { 
        healthy: true, 
        deviceState: postTransferDevice,
        softTransferResult,
        recommendations: postTransferDevice.is_active ? ['Device ready for playback'] : ['Device transferred but not active']
      };
      
    } catch (error) {
      console.log('❌ [Debug] Échec transfert doux:', error);
      return { 
        error: 'Soft transfer failed', 
        healthy: false, 
        step: 'soft_transfer',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Test de transfert doux (sans lecture)
  async testSoftTransfer(deviceId: string): Promise<SpotifyAPIResponse<void>> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error('No token');
    }

    console.log('🔄 [Debug] Test transfert doux (play: false)');

    const body = {
      device_ids: [deviceId],
      play: false  // Pas de lecture, juste transfert
    };

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`📡 [Debug] Soft Transfer Status: ${response.status}`);

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.log(`❌ [Debug] Soft Transfer Error:`, errorText);
      throw new Error(`Soft transfer failed: ${response.status}`);
    }

    return { 
      status: response.status, 
      data: undefined, 
      headers: Object.fromEntries(response.headers.entries()),
      success: true 
    };
  }

  // Analyse détaillée de l'état des appareils
  async analyzeDevicesState(): Promise<DeviceAnalysis> {
    console.log('🔬 [Debug] === ANALYSE ÉTAT APPAREILS ===');
    
    const devicesResult = await this.testDevicesAPI();
    if (!devicesResult.data?.devices) {
      return {
        totalDevices: 0,
        activeDevices: 0,
        restrictedDevices: 0,
        privateSessionDevices: 0,
        deviceTypes: {},
        recommendations: []
      };
    }

    const devices = devicesResult.data.devices as SpotifyDevice[];
    console.log(`📱 [Debug] Nombre total d'appareils: ${devices.length}`);

    const analysis: DeviceAnalysis = {
      totalDevices: devices.length,
      activeDevices: devices.filter(d => d.is_active).length,
      restrictedDevices: devices.filter(d => d.is_restricted).length,
      privateSessionDevices: devices.filter(d => d.is_private_session).length,
      deviceTypes: {},
      recommendations: []
    };

    devices.forEach((device, index) => {
      console.log(`📱 [Debug] Appareil ${index + 1}: Analyse détaillée`);
      console.log(`  - Nom: ${device.name}`);
      console.log(`  - Type: ${device.type}`);
      console.log(`  - ID: ${device.id}`);
      console.log(`  - Actif: ${device.is_active}`);
      console.log(`  - Restreint: ${device.is_restricted}`);
      console.log(`  - Session privée: ${device.is_private_session}`);
      console.log(`  - Supporte volume: ${device.supports_volume}`);
      console.log(`  - Volume: ${device.volume_percent}%`);

      // Comptage par type
      if (!analysis.deviceTypes[device.type]) {
        analysis.deviceTypes[device.type] = 0;
      }
      analysis.deviceTypes[device.type]++;

      // Recommandations par appareil
      if (device.is_restricted) {
        analysis.recommendations.push(`${device.name}: Appareil restreint - vérifiez les permissions`);
      }
      if (!device.is_active && !device.is_restricted) {
        analysis.recommendations.push(`${device.name}: Prêt pour transfert (inactif mais disponible)`);
      }
      if (device.is_active) {
        analysis.recommendations.push(`${device.name}: Actuellement actif - transfert direct possible`);
      }
    });

    console.log('📊 [Debug] Résumé analyse:');
    console.log(`  - Total: ${analysis.totalDevices}`);
    console.log(`  - Actifs: ${analysis.activeDevices}`);
    console.log(`  - Restreints: ${analysis.restrictedDevices}`);
    console.log(`  - Types:`, analysis.deviceTypes);

    return analysis;
  }

  // Diagnostic complet amélioré
  async runFullDiagnostic(): Promise<void> {
    console.log('🔍 [Debug] === DIAGNOSTIC COMPLET DÉMARRÉ ===');
    const startTime = new Date().toISOString();
    console.log(`⏰ [Debug] Début: ${startTime}`);
    
    // 1. Test token
    const token = authService.getAccessToken();
    console.log('🔑 [Debug] Token présent:', !!token);
    console.log('🔑 [Debug] Token longueur:', token?.length || 0);
    
    if (!token) {
      console.log('❌ [Debug] Arrêt - pas de token');
      return;
    }

    // 2. Test API devices avec analyse
    console.log('\n🔍 [Debug] === TEST DEVICES API + ANALYSE ===');
    const devicesResult = await this.testDevicesAPI();
    
    if (devicesResult.data?.devices?.length > 0) {
      const analysis = await this.analyzeDevicesState();
      console.log('📊 [Debug] Analyse terminée');
    }
    
    // 3. Test API playback state
    console.log('\n🔍 [Debug] === TEST PLAYBACK STATE API ===');
    const playbackResult = await this.testPlaybackState();
    
    // 4. Si on a des appareils, validation de santé avant transfert
    if (devicesResult.data?.devices?.length > 0) {
      console.log('\n🏥 [Debug] === VALIDATION SANTÉ APPAREILS ===');
      for (const device of devicesResult.data.devices) {
        console.log(`\n🔍 [Debug] Test santé: ${device.name}`);
        const healthResult = await this.validateDeviceHealth(device.id, device.name);
        console.log(`🏥 [Debug] Résultat santé ${device.name}:`, healthResult.healthy ? '✅ Sain' : '❌ Problème');
        
        if (!healthResult.healthy) {
          console.log(`❌ [Debug] Problème détecté:`, healthResult.error);
          console.log(`📍 [Debug] Étape échouée:`, healthResult.step);
        }
      }
    } else {
      console.log('\n⚠️ [Debug] Pas d\'appareils pour validation de santé');
    }
    
    const endTime = new Date().toISOString();
    console.log(`\n🔍 [Debug] === DIAGNOSTIC COMPLET TERMINÉ ===`);
    console.log(`⏰ [Debug] Fin: ${endTime}`);
  }
}

export const debugService = new DebugService();
export default debugService; 