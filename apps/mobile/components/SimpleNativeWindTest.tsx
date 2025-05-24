import React from 'react';
import { View, Text } from 'react-native';
import { verifyInstallation } from 'nativewind';

export default function SimpleNativeWindTest() {
  // Vérification de l'installation NativeWind
  verifyInstallation();

  return (
    <View className="bg-green-500 p-4 rounded-lg mb-4">
      <Text className="text-white text-lg font-bold text-center">
        ✅ NativeWind Test
      </Text>
      <Text className="text-white text-sm text-center mt-2">
        Si vous voyez ce texte en blanc sur fond vert, NativeWind fonctionne !
      </Text>
    </View>
  );
} 