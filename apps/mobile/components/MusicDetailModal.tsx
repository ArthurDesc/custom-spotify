import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  PanResponder,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Track, PlaybackState } from '../types/spotify';
import { colors } from '../utils/colors';
import { TouchControlArea } from './TouchControlArea';
import { MainPlayerArea } from './MainPlayerArea';
import { BottomPlayerControls } from './BottomPlayerControls';
import { AnimatedBackground } from './AnimatedBackground';
import { DeviceSelectionModal } from './DeviceSelectionModal';
import * as WebBrowser from 'expo-web-browser';
import { generateGeniusUrl } from '../utils/geniusUtils';

interface MusicDetailModalProps {
  visible: boolean;
  onClose: () => void;
  currentTrack?: Track | null;
  playbackState?: PlaybackState | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MusicDetailModal: React.FC<MusicDetailModalProps> = ({
  visible,
  onClose,
  currentTrack,
  playbackState,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onVolumeChange,
}) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [progressValue, setProgressValue] = useState(0);
  const [showDeviceSelection, setShowDeviceSelection] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (playbackState && currentTrack) {
      const progress = (playbackState.progress_ms / currentTrack.duration_ms) * 100;
      setProgressValue(progress);
    }
  }, [playbackState, currentTrack]);

  // Fonction pour ouvrir Genius directement
  const handleOpenGenius = async () => {
    if (!currentTrack) return;
    
    try {
      const artistName = currentTrack.artists.map(artist => artist.name).join(', ');
      const geniusUrl = generateGeniusUrl(artistName, currentTrack.name);
      
      console.log('🌐 [MusicDetailModal] Ouverture de Genius:', geniusUrl);
      console.log('🎵 [MusicDetailModal] Artiste:', artistName, '- Titre:', currentTrack.name);
      
      await WebBrowser.openBrowserAsync(geniusUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
        controlsColor: '#1DB954',
        toolbarColor: '#191414',
        dismissButtonStyle: 'close',
      });
    } catch (error) {
      console.error('❌ [MusicDetailModal] Erreur lors de l\'ouverture de Genius:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir les paroles sur Genius. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  // Gestionnaire pour scroll vers le bas (ouverture directe de Genius)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 20 && Math.abs(gestureState.dx) < 50;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        scrollY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        // Ouvrir directement Genius au lieu d'afficher la section lyrics
        handleOpenGenius();
      }
      Animated.spring(scrollY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  // Fonctions pour les contrôles tactiles
  const handleLeftTap = () => {
    // Changer de son vers l'arrière
    onPrevious();
  };

  const handleRightTap = () => {
    // Changer de son vers l'avant
    onNext();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      onNext();
    } else {
      onPrevious();
    }
  };

  if (!currentTrack) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Fond animé galactique */}
      <AnimatedBackground />
      
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: slideAnim }],
        }}
        {...panResponder.panHandlers}
      >
        {/* Header avec bouton fermer - En position absolue */}
        <LinearGradient
          colors={[
            `${colors.background.primary}CC`,
            `${colors.background.secondary}80`,
            'transparent',
          ]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity 
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${colors.background.card}80`,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary.purple,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons name="chevron-down" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${colors.background.card}80`,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary.purple,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Zone principale du lecteur - Prend maintenant toute la hauteur de l'écran */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center'
        }}>
          <MainPlayerArea
            currentTrack={currentTrack}
            playbackState={playbackState}
            onPlayPause={onPlayPause}
            currentSource="Nom de l'album/playlist"
          />
        </View>

        {/* Contrôles tactiles gauche et droite */}
        <TouchControlArea
          side="left"
          onTap={handleLeftTap}
          onSwipe={handleSwipe}
        />
        
        <TouchControlArea
          side="right"
          onTap={handleRightTap}
          onSwipe={handleSwipe}
        />

        {/* Contrôles du bas */}
        <BottomPlayerControls
          currentTrack={currentTrack}
          playbackState={playbackState}
          progressValue={progressValue}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
          onAddToPlaylist={() => {}}
          onSelectDevice={() => {
            console.log('🎯 [MusicDetailModal] Ouverture sélection appareils');
            setShowDeviceSelection(true);
          }}
          onOpenGenius={handleOpenGenius}
        />

       
      </Animated.View>



      {/* Modal de sélection d'appareils */}
      <DeviceSelectionModal
        visible={showDeviceSelection}
        onClose={() => {
          console.log('🎯 [MusicDetailModal] Fermeture sélection appareils');
          setShowDeviceSelection(false);
        }}
      />
    </Modal>
  );
}; 