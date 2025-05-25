import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';
import { StarField } from './StarField';
import { NebulaEffect } from './NebulaEffect';
import { BlackHoleEffect } from './BlackHoleEffect';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  size: number;
  speed: number;
}

export const AnimatedBackground: React.FC = () => {
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Créer les particules
    const particles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        opacity: new Animated.Value(Math.random() * 0.4 + 0.2),
        scale: new Animated.Value(Math.random() * 0.3 + 0.4),
        size: Math.random() * 3 + 1.5,
        speed: Math.random() * 3000 + 4000,
      });
    }
    particlesRef.current = particles;

    // Démarrer l'animation
    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const startAnimation = () => {
    const animations = particlesRef.current.map((particle) => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.y, {
              toValue: -50,
              duration: particle.speed,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 0.8,
                duration: particle.speed * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.1,
                duration: particle.speed * 0.7,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(particle.scale, {
                toValue: 1.2,
                duration: particle.speed * 0.5,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0.3,
                duration: particle.speed * 0.5,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(particle.y, {
            toValue: height + 50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animationRef.current = Animated.parallel(animations);
    animationRef.current.start(() => {
      // Réinitialiser les positions et redémarrer
      particlesRef.current.forEach((particle) => {
        particle.x.setValue(Math.random() * width);
        particle.y.setValue(height + 50);
      });
      startAnimation();
    });
  };

  const renderParticle = (particle: Particle) => (
    <Animated.View
      key={particle.id}
      style={[
        styles.particle,
        {
          transform: [
            { translateX: particle.x },
            { translateY: particle.y },
            { scale: particle.scale },
          ],
          opacity: particle.opacity,
          width: particle.size,
          height: particle.size,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Champ d'étoiles en arrière-plan */}
      <StarField />
      
      {/* Effet de nébuleuse */}
      <NebulaEffect />
      
      {/* Dégradé de fond principal */}
      <LinearGradient
        colors={[
          colors.background.primary,
          colors.background.secondary,
          colors.background.tertiary,
          colors.background.primary,
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      />
      
      {/* Effet de vortex subtil */}
      <View style={styles.vortexContainer}>
        <LinearGradient
          colors={[
            'transparent',
            `${colors.primary.purple}15`,
            `${colors.primary.lightPurple}10`,
            'transparent',
          ]}
          style={styles.vortex}
        />
      </View>

      {/* Effet de trou noir central */}
      <BlackHoleEffect />

      {/* Particules flottantes */}
      <View style={styles.particlesContainer}>
        {particlesRef.current.map(renderParticle)}
      </View>

      {/* Effet de lueur en bas */}
      <LinearGradient
        colors={[
          'transparent',
          `${colors.primary.purple}08`,
          `${colors.primary.darkPurple}12`,
        ]}
        style={styles.bottomGlow}
      />
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
  gradient: {
    flex: 1,
  },
  vortexContainer: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    right: width * 0.1,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vortex: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.3,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.primary.lightPurple,
    borderRadius: 50,
    shadowColor: colors.primary.purple,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    pointerEvents: 'none',
  },
}); 