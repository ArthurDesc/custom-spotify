import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useSpotifyRemote } from '../hooks/useSpotifyRemote';
import { DeviceSelector } from './DeviceSelector';
import { debugService } from '../services/debugService';

const SpotifyRemoteTest: React.FC = () => {
  const {
    session,
    isAuthenticated,
    isConnected,
    isSpotifyAppAvailable,
    isLoading,
    error,
    devices,
    authenticate,
    connectRemote,
    disconnectRemote,
    clearSession,
    clearError,
    loadDevices,
    selectDevice,
    playTrack,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    setVolume,
    setShuffle,
    setRepeat,
    runDiagnostic,
  } = useSpotifyRemote();

  const [trackUri, setTrackUri] = useState('spotify:track:4iV5W9uYEdYUVa79Axb7Rh'); // Exemple d'URI
  const [volume, setVolumeInput] = useState('50');

  const handleAuthenticate = async () => {
    try {
      await authenticate();
      Alert.alert('Succès', 'Authentification réussie !');
    } catch (err) {
      Alert.alert('Erreur', 'Échec de l\'authentification');
    }
  };

  const handleConnectRemote = async () => {
    try {
      await connectRemote();
      Alert.alert('Succès', 'Connexion Remote établie !');
    } catch (err) {
      Alert.alert('Erreur', 'Échec de la connexion Remote');
    }
  };

  const handlePlayTrack = async () => {
    if (!trackUri.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un URI de piste');
      return;
    }
    
    try {
      await playTrack(trackUri);
      Alert.alert('Succès', 'Lecture lancée !');
    } catch (err) {
      Alert.alert('Erreur', 'Échec de la lecture');
    }
  };

  const handleSetVolume = async () => {
    const volumeValue = parseInt(volume);
    if (isNaN(volumeValue) || volumeValue < 0 || volumeValue > 100) {
      Alert.alert('Erreur', 'Le volume doit être entre 0 et 100');
      return;
    }

    try {
      await setVolume(volumeValue);
      Alert.alert('Succès', `Volume réglé à ${volumeValue}%`);
    } catch (err) {
      Alert.alert('Erreur', 'Échec du réglage du volume');
    }
  };

  const handleListDevices = async () => {
    try {
      await loadDevices();
      if (devices.length === 0) {
        Alert.alert('Aucun appareil', 'Aucun appareil Spotify trouvé. Assurez-vous que Spotify est ouvert sur un appareil.');
      }
    } catch (err) {
      console.error('Erreur liste appareils:', err);
      Alert.alert('Erreur', 'Impossible de récupérer les appareils');
    }
  };

  const handleSelectDevice = async (deviceId: string, deviceName: string) => {
    try {
      await selectDevice(deviceId, deviceName);
      Alert.alert('Succès', `Lecture démarrée sur ${deviceName}`);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de transférer la lecture');
    }
  };

  const handleRunDiagnostic = async () => {
    Alert.alert(
      'Diagnostic',
      'Le diagnostic complet va s\'exécuter. Consultez la console pour les résultats détaillés.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Lancer', 
          onPress: async () => {
            console.log('🚀 [SpotifyRemoteTest] Lancement du diagnostic utilisateur');
            await debugService.runFullDiagnostic();
            await runDiagnostic();
            Alert.alert('Diagnostic terminé', 'Consultez la console pour les résultats détaillés.');
          }
        }
      ]
    );
  };

  const handleTestDeviceHealth = async () => {
    if (devices.length === 0) {
      Alert.alert('Erreur', 'Aucun appareil disponible pour le test');
      return;
    }

    const device = devices[0]; // Tester le premier appareil
    console.log(`🏥 [SpotifyRemoteTest] Test de santé pour: ${device.name}`);
    
    try {
      const healthResult = await debugService.validateDeviceHealth(device.id, device.name);
      
      const message = healthResult.healthy 
        ? `✅ Appareil ${device.name} en bonne santé !`
        : `❌ Problème détecté sur ${device.name}: ${healthResult.error}`;
      
      Alert.alert('Test de santé', message);
      console.log('🏥 [SpotifyRemoteTest] Résultat santé:', healthResult);
    } catch (error) {
      console.error('❌ [SpotifyRemoteTest] Erreur test santé:', error);
      Alert.alert('Erreur', 'Impossible de tester la santé de l\'appareil');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-6 text-center">
        Test Spotify Remote SDK
      </Text>

      {/* Statut */}
      <View className="bg-gray-800 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-semibold mb-2">Statut</Text>
        <Text className="text-gray-300">
          App Spotify disponible: {isSpotifyAppAvailable ? '✅ Oui' : '❌ Non'}
        </Text>
        <Text className="text-gray-300">
          Authentifié: {isAuthenticated ? '✅ Oui' : '❌ Non'}
        </Text>
        <Text className="text-gray-300">
          Remote connecté: {isConnected ? '✅ Oui' : '❌ Non'}
        </Text>
        <Text className="text-gray-300">
          Chargement: {isLoading ? '⏳ Oui' : '✅ Non'}
        </Text>
      </View>

      {/* Informations de session */}
      {session && (
        <View className="bg-gray-800 p-4 rounded-lg mb-4">
          <Text className="text-white text-lg font-semibold mb-2">Session</Text>
          <Text className="text-gray-300 text-xs">
            Token: {session.accessToken.substring(0, 20)}...
          </Text>
          <Text className="text-gray-300">
            Scopes: {session.scopes.length} autorisations
          </Text>
          <Text className="text-gray-300">
            Expire: {new Date(session.expirationDate).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Erreur */}
      {error && (
        <View className="bg-red-900 p-4 rounded-lg mb-4">
          <Text className="text-red-300 font-semibold">Erreur:</Text>
          <Text className="text-red-200">{error}</Text>
          <TouchableOpacity
            onPress={clearError}
            className="bg-red-700 p-2 rounded mt-2"
          >
            <Text className="text-white text-center">Effacer l'erreur</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions d'authentification */}
      <View className="bg-gray-800 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-semibold mb-3">Authentification</Text>
        
        {!isAuthenticated ? (
          <TouchableOpacity
            onPress={handleAuthenticate}
            disabled={isLoading}
            className={`p-3 rounded-lg ${isLoading ? 'bg-gray-600' : 'bg-green-600'}`}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'Authentification...' : 'S\'authentifier'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="space-y-2">
            {!isConnected ? (
              <TouchableOpacity
                onPress={handleConnectRemote}
                disabled={isLoading}
                className={`p-3 rounded-lg ${isLoading ? 'bg-gray-600' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-semibold">
                  {isLoading ? 'Connexion...' : 'Connecter Remote'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={disconnectRemote}
                disabled={isLoading}
                className={`p-3 rounded-lg ${isLoading ? 'bg-gray-600' : 'bg-orange-600'}`}
              >
                <Text className="text-white text-center font-semibold">
                  {isLoading ? 'Déconnexion...' : 'Déconnecter Remote'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={clearSession}
              className="p-3 rounded-lg bg-red-600"
            >
              <Text className="text-white text-center font-semibold">
                Effacer la session
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Appareils disponibles */}
      {isAuthenticated && (
        <DeviceSelector
          devices={devices}
          onSelectDevice={handleSelectDevice}
          onRefreshDevices={handleListDevices}
          loading={isLoading}
        />
      )}

      {/* Contrôles de lecture */}
      {isConnected && (
        <View className="bg-gray-800 p-4 rounded-lg mb-4">
          <Text className="text-white text-lg font-semibold mb-3">Contrôles de lecture</Text>
          
          {/* URI de piste */}
          <View className="mb-3">
            <Text className="text-gray-300 mb-1">URI de la piste:</Text>
            <TextInput
              value={trackUri}
              onChangeText={setTrackUri}
              placeholder="spotify:track:..."
              placeholderTextColor="#9CA3AF"
              className="bg-gray-700 text-white p-3 rounded-lg"
            />
          </View>

          <TouchableOpacity
            onPress={handlePlayTrack}
            className="p-3 rounded-lg bg-green-600 mb-2"
          >
            <Text className="text-white text-center font-semibold">
              ▶️ Lire la piste
            </Text>
          </TouchableOpacity>

          {/* Contrôles de base */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={pausePlayback}
              className="flex-1 p-3 rounded-lg bg-yellow-600 mr-1"
            >
              <Text className="text-white text-center font-semibold">⏸️ Pause</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={resumePlayback}
              className="flex-1 p-3 rounded-lg bg-green-600 mx-1"
            >
              <Text className="text-white text-center font-semibold">▶️ Reprendre</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={skipToPrevious}
              className="flex-1 p-3 rounded-lg bg-blue-600 mr-1"
            >
              <Text className="text-white text-center font-semibold">⏮️ Précédent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={skipToNext}
              className="flex-1 p-3 rounded-lg bg-blue-600 ml-1"
            >
              <Text className="text-white text-center font-semibold">⏭️ Suivant</Text>
            </TouchableOpacity>
          </View>

          {/* Volume */}
          <View className="mb-3">
            <Text className="text-gray-300 mb-1">Volume (0-100):</Text>
            <View className="flex-row">
              <TextInput
                value={volume}
                onChangeText={setVolumeInput}
                placeholder="50"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="bg-gray-700 text-white p-3 rounded-lg flex-1 mr-2"
              />
              <TouchableOpacity
                onPress={handleSetVolume}
                className="p-3 rounded-lg bg-purple-600"
              >
                <Text className="text-white font-semibold">🔊 Régler</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shuffle et Repeat */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={() => setShuffle(true)}
              className="flex-1 p-3 rounded-lg bg-indigo-600 mr-1"
            >
              <Text className="text-white text-center font-semibold">🔀 Shuffle ON</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setShuffle(false)}
              className="flex-1 p-3 rounded-lg bg-gray-600 ml-1"
            >
              <Text className="text-white text-center font-semibold">🔀 Shuffle OFF</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setRepeat('off')}
              className="flex-1 p-2 rounded-lg bg-gray-600 mr-1"
            >
              <Text className="text-white text-center text-sm">🔁 OFF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setRepeat('track')}
              className="flex-1 p-2 rounded-lg bg-pink-600 mx-1"
            >
              <Text className="text-white text-center text-sm">🔂 Track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setRepeat('context')}
              className="flex-1 p-2 rounded-lg bg-pink-600 ml-1"
            >
              <Text className="text-white text-center text-sm">🔁 Context</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Note d'information */}
      <View className="bg-blue-900 p-4 rounded-lg">
        <Text className="text-blue-300 font-semibold mb-2">ℹ️ Information</Text>
        <Text className="text-blue-200 text-sm mb-2">
          Ce composant teste l'intégration du Spotify Remote SDK avec contrôles réels via l'API Web Spotify.
        </Text>
        <Text className="text-blue-200 text-sm">
          • Sélectionnez un appareil pour transférer la lecture{'\n'}
          • L'appareil actif est affiché en vert{'\n'}
          • Utilisez "Transférer et jouer" pour démarrer immédiatement la lecture
        </Text>
      </View>

      <View className="bg-gray-800 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg font-semibold mb-3">Diagnostic</Text>
        
        <TouchableOpacity
          onPress={handleRunDiagnostic}
          className="p-3 rounded-lg bg-purple-600 mb-2"
        >
          <Text className="text-white text-center font-semibold">
            🔍 Diagnostic complet
          </Text>
        </TouchableOpacity>

        {devices.length > 0 && (
          <TouchableOpacity
            onPress={handleTestDeviceHealth}
            className="p-3 rounded-lg bg-blue-600"
          >
            <Text className="text-white text-center font-semibold">
              🏥 Test santé appareil ({devices[0]?.name})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default SpotifyRemoteTest; 