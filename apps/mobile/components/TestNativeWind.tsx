import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TestNativeWind() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          NativeWind Test
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Ceci est un test de NativeWind avec Tailwind CSS dans React Native
        </Text>
        <TouchableOpacity className="bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg">
          <Text className="text-white font-semibold text-center">
            Bouton Test
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 