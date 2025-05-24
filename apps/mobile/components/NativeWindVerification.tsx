import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NativeWindVerification() {
  return (
    <View className="p-4 space-y-4">
      {/* Test des couleurs de base */}
      <View className="bg-red-500 p-3 rounded">
        <Text className="text-white font-bold">Rouge - bg-red-500</Text>
      </View>
      
      <View className="bg-blue-500 p-3 rounded">
        <Text className="text-white font-bold">Bleu - bg-blue-500</Text>
      </View>
      
      <View className="bg-green-500 p-3 rounded">
        <Text className="text-white font-bold">Vert - bg-green-500</Text>
      </View>
      
      {/* Test du padding et margin */}
      <View className="bg-gray-200 p-2">
        <Text className="text-gray-800">Padding p-2</Text>
        <View className="bg-gray-400 m-2 p-1">
          <Text className="text-white">Margin m-2, Padding p-1</Text>
        </View>
      </View>
      
      {/* Test des bordures */}
      <View className="border-2 border-purple-500 p-3 rounded-lg">
        <Text className="text-purple-700 font-semibold">Bordure purple avec rounded-lg</Text>
      </View>
      
      {/* Test du flex */}
      <View className="flex-row justify-between items-center bg-yellow-100 p-3 rounded">
        <Text className="text-yellow-800">Flex Row</Text>
        <Text className="text-yellow-800">Space Between</Text>
      </View>
      
      {/* Test des tailles de texte */}
      <View className="bg-indigo-100 p-3 rounded">
        <Text className="text-xs text-indigo-600">Texte xs</Text>
        <Text className="text-sm text-indigo-700">Texte sm</Text>
        <Text className="text-base text-indigo-800">Texte base</Text>
        <Text className="text-lg text-indigo-900">Texte lg</Text>
        <Text className="text-xl font-bold text-indigo-900">Texte xl bold</Text>
      </View>
      
      {/* Test d'un bouton */}
      <TouchableOpacity className="bg-emerald-500 hover:bg-emerald-600 py-3 px-6 rounded-lg">
        <Text className="text-white font-semibold text-center">
          Bouton avec hover (si supporté)
        </Text>
      </TouchableOpacity>
    </View>
  );
} 