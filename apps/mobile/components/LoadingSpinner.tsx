import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Chargement...',
  size = 'large',
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={colors.primary.purple} />
      <Text style={[styles.loadingText, { color: colors.text.secondary }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
}); 