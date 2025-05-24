import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconProps extends TouchableOpacityProps {
  /** Le nom de l'icône Ionicons à afficher */
  name: keyof typeof Ionicons.glyphMap;
  /** Taille de l'icône */
  size?: number;
  /** Couleur de l'icône */
  color?: string;
  /** Si l'icône est cliquable */
  onPress?: () => void;
  /** Style personnalisé pour le conteneur */
  containerStyle?: TouchableOpacityProps['style'];
}

export default function Icon({
  name,
  size = 24,
  color = '#FFFFFF',
  onPress,
  containerStyle,
  ...touchableProps
}: IconProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={containerStyle}
        {...touchableProps}
      >
        <Ionicons 
          name={name} 
          size={size} 
          color={color} 
        />
      </TouchableOpacity>
    );
  }

  return (
    <Ionicons 
      name={name} 
      size={size} 
      color={color} 
    />
  );
} 