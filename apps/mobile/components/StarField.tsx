import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  size: number;
  twinkleSpeed: number;
}

export const StarField: React.FC = () => {
  const starsRef = useRef<Star[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Créer les étoiles
    const stars: Star[] = [];
    for (let i = 0; i < 30; i++) {
      stars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
        size: Math.random() * 1.5 + 0.8,
        twinkleSpeed: Math.random() * 3000 + 2000,
      });
    }
    starsRef.current = stars;

    // Démarrer les animations de scintillement
    startTwinkling();

    return () => {
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, []);

  const startTwinkling = () => {
    const animations = starsRef.current.map((star) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0.2,
            duration: star.twinkleSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.9,
            duration: star.twinkleSpeed,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return animation;
    });
    animationsRef.current = animations;
  };

  const renderStar = (star: Star) => (
    <Animated.View
      key={star.id}
      style={[
        styles.star,
        {
          transform: [
            { translateX: star.x },
            { translateY: star.y },
          ],
          opacity: star.opacity,
          width: star.size,
          height: star.size,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {starsRef.current.map(renderStar)}
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
    zIndex: -2,
  },
  star: {
    position: 'absolute',
    backgroundColor: colors.text.primary,
    borderRadius: 50,
    shadowColor: colors.primary.lightPurple,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
}); 