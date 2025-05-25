import React, { useState } from 'react';
import { Image, View, ImageStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

interface ImageWithFallbackProps {
  uri?: string;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackIconSize?: number;
  isCircular?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  uri,
  style,
  containerStyle,
  fallbackIcon = 'musical-notes',
  fallbackIconSize = 24,
  isCircular = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const defaultStyle: ImageStyle = {
    width: 60,
    height: 60,
    backgroundColor: colors.background.secondary,
    ...(isCircular && { borderRadius: 30 }),
    ...style,
  };

  const fallbackContainerStyle: ViewStyle = {
    ...defaultStyle,
    justifyContent: 'center',
    alignItems: 'center',
    ...containerStyle,
  };

  if (!uri || imageError) {
    return (
      <View style={fallbackContainerStyle}>
        <Ionicons 
          name={fallbackIcon} 
          size={fallbackIconSize} 
          color="#9CA3AF" 
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={defaultStyle}
      onError={() => setImageError(true)}
      onLoadStart={() => setImageLoading(true)}
      onLoadEnd={() => setImageLoading(false)}
    />
  );
}; 