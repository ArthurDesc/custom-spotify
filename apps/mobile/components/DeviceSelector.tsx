import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

interface DeviceSelectorProps {
  devices: any[];
  onSelectDevice: (deviceId: string, deviceName: string) => void;
  onRefreshDevices: () => void;
  loading?: boolean;
  compact?: boolean;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  onSelectDevice,
  onRefreshDevices,
  loading = false,
  compact = false,
}) => {
  const getActiveDevice = () => {
    return devices.find(device => device.is_active);
  };

  return (
    <View className={compact ? "bg-gray-800 p-3 rounded-lg" : "bg-gray-800 p-4 rounded-lg mb-4"}>
      <Text className={`text-white font-semibold mb-3 ${compact ? 'text-base' : 'text-lg'}`}>
        {compact ? 'Appareils' : 'Appareils Spotify'}
      </Text>
      
      {/* Appareil actuellement actif */}
      {getActiveDevice() && !compact && (
        <View className="bg-green-900 border-2 border-green-500 p-3 rounded-lg mb-3">
          <Text className="text-green-300 font-semibold mb-1">🎵 Appareil actif :</Text>
          <Text className="text-white font-bold">{getActiveDevice()?.name}</Text>
          <Text className="text-green-200 text-sm">
            {getActiveDevice()?.type} • Volume: {getActiveDevice()?.volume_percent}%
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={onRefreshDevices}
        disabled={loading}
        className={`p-3 rounded-lg mb-3 ${loading ? 'bg-gray-600' : 'bg-purple-600'}`}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? '⏳ Chargement...' : '🔄 Rafraîchir les appareils'}
        </Text>
      </TouchableOpacity>

      {devices.length > 0 ? (
        <ScrollView style={{ maxHeight: compact ? 200 : 300 }} showsVerticalScrollIndicator={false}>
          <Text className="text-gray-300 mb-2">
            {compact ? 'Sélectionnez :' : 'Sélectionnez un appareil :'}
          </Text>
          {devices.map((device: any) => (
            <TouchableOpacity
              key={device.id}
              onPress={() => onSelectDevice(device.id, device.name)}
              className={`p-3 rounded-lg mb-2 ${
                device.is_active 
                  ? 'bg-green-600 border-2 border-green-400' 
                  : 'bg-gray-700 border-2 border-gray-600'
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-white font-semibold">
                    {device.name}
                  </Text>
                  {!compact && (
                    <Text className="text-gray-300 text-sm">
                      {device.type} • Volume: {device.volume_percent}%
                    </Text>
                  )}
                  {compact && device.is_active && (
                    <Text className="text-green-300 text-xs">Actif</Text>
                  )}
                </View>
                <View className="flex-row items-center">
                  {device.is_active && (
                    <Text className="text-green-300 font-bold mr-2">
                      {compact ? '✅' : '✅ ACTIF'}
                    </Text>
                  )}
                  <Text className="text-gray-400">
                    {device.is_active ? '🎵' : '📱'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="bg-gray-700 p-3 rounded-lg">
          <Text className="text-gray-300 text-center">
            {compact 
              ? 'Aucun appareil trouvé.' 
              : 'Aucun appareil trouvé. Cliquez sur "Rafraîchir" après avoir ouvert Spotify.'
            }
          </Text>
        </View>
      )}
    </View>
  );
}; 