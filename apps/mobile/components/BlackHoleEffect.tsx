import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

export const BlackHoleEffect: React.FC = () => {
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation de pulsation très douce
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0.95,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.centerGlow,
          {
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            `${colors.primary.purple}08`,
            `${colors.primary.lightPurple}05`,
            'transparent',
          ]}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  centerGlow: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
  },
}); 