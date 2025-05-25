import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

interface NebulaCloud {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  size: number;
  speed: number;
}

export const NebulaEffect: React.FC = () => {
  const cloudsRef = useRef<NebulaCloud[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Créer les nuages de nébuleuse
    const clouds: NebulaCloud[] = [];
    for (let i = 0; i < 2; i++) {
      clouds.push({
        id: i,
        x: new Animated.Value(Math.random() * width * 0.5),
        y: new Animated.Value(Math.random() * height * 0.5),
        scale: new Animated.Value(0.3 + Math.random() * 0.3),
        opacity: new Animated.Value(0.05 + Math.random() * 0.1),
        rotation: new Animated.Value(0),
        size: 150 + Math.random() * 200,
        speed: 20000 + Math.random() * 15000,
      });
    }
    cloudsRef.current = clouds;

    // Démarrer l'animation
    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const startAnimation = () => {
    const animations = cloudsRef.current.map((cloud) => {
      return Animated.loop(
        Animated.parallel([
          Animated.timing(cloud.scale, {
            toValue: 0.2 + Math.random() * 0.4,
            duration: cloud.speed,
            useNativeDriver: true,
          }),
          Animated.timing(cloud.opacity, {
            toValue: 0.03 + Math.random() * 0.08,
            duration: cloud.speed,
            useNativeDriver: true,
          }),
          Animated.timing(cloud.rotation, {
            toValue: 360,
            duration: cloud.speed * 3,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animationRef.current = Animated.parallel(animations);
    animationRef.current.start(() => {
      startAnimation();
    });
  };

  const renderCloud = (cloud: NebulaCloud) => (
    <Animated.View
      key={cloud.id}
      style={[
        styles.cloudContainer,
        {
          transform: [
            { translateX: cloud.x },
            { translateY: cloud.y },
            { scale: cloud.scale },
            { 
              rotate: cloud.rotation.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              })
            },
          ],
          opacity: cloud.opacity,
        },
      ]}
    >
      <LinearGradient
        colors={[
          'transparent',
          `${colors.primary.purple}20`,
          `${colors.primary.lightPurple}15`,
          `${colors.primary.darkPurple}10`,
          'transparent',
        ]}
        style={[styles.cloud, { width: cloud.size, height: cloud.size }]}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {cloudsRef.current.map(renderCloud)}
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
    zIndex: -1,
  },
  cloudContainer: {
    position: 'absolute',
  },
  cloud: {
    borderRadius: 1000,
  },
}); 