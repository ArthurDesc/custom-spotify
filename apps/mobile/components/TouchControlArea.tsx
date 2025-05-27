import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

interface TouchControlAreaProps {
  side: 'left' | 'right';
  onTap: () => void; // Pour changer de chanson (précédent/suivant)
  onSwipe?: (direction: 'left' | 'right') => void; // Pour slider et changer de chanson
}

const { width: screenWidth } = Dimensions.get('window');

export const TouchControlArea: React.FC<TouchControlAreaProps> = ({
  side,
  onTap,
  onSwipe,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: () => {
      // Animation de press
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 150,
        friction: 4,
      }).start();

      // Pas de hold, juste tap direct pour changer de chanson
    },

    onPanResponderMove: (evt, gestureState) => {
      // Détection du swipe horizontal
      if (Math.abs(gestureState.dx) > 50 && Math.abs(gestureState.dy) < 50) {
        const direction = gestureState.dx > 0 ? 'right' : 'left';
        onSwipe?.(direction);
      }
    },

    onPanResponderRelease: () => {
      // Animation de release
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 4,
      }).start();

      // Tap direct pour changer de chanson
      onTap();
    },
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        [side]: 0,
        top: '20%',
        bottom: '25%',
        width: screenWidth * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: scaleAnim }],
      }}
      {...panResponder.panHandlers}
    >
      {/* Zone tactile invisible */}
      <View
        style={{
          width: 80,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Zone invisible pour les interactions tactiles */}
      </View>
    </Animated.View>
  );
}; 