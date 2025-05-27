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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';
import { useSpotifyRemote } from '../hooks/useSpotifyRemote';

interface DeviceSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Fonction pour obtenir l'icône selon le type d'appareil
const getDeviceIcon = (deviceType: string): keyof typeof Ionicons.glyphMap => {
  switch (deviceType.toLowerCase()) {
    case 'smartphone':
      return 'phone-portrait';
    case 'computer':
      return 'desktop';
    case 'tablet':
      return 'tablet-portrait';
    case 'speaker':
      return 'volume-high';
    case 'tv':
      return 'tv';
    case 'game_console':
      return 'game-controller';
    default:
      return 'musical-notes';
  }
};

// Fonction pour obtenir une couleur selon le type d'appareil
const getDeviceColor = (deviceType: string, isActive: boolean) => {
  if (isActive) return colors.primary.purple;
  
  switch (deviceType.toLowerCase()) {
    case 'smartphone':
      return '#34D399'; // Vert
    case 'computer':
      return '#60A5FA'; // Bleu
    case 'tablet':
      return '#F59E0B'; // Orange
    case 'speaker':
      return '#EF4444'; // Rouge
    case 'tv':
      return '#8B5CF6'; // Violet
    default:
      return colors.text.secondary;
  }
};

export const DeviceSelectionModal: React.FC<DeviceSelectionModalProps> = ({
  visible,
  onClose,
}) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const {
    devices,
    loadDevices,
    selectDevice,
    isLoading,
    error,
    clearError,
  } = useSpotifyRemote();

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (visible) {
      console.log('📱 [DeviceSelectionModal] Modal ouvert, démarrage actualisation automatique');
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      
      // Charger les appareils immédiatement
      loadDevices();
      
      // Démarrer l'actualisation automatique toutes les 7 secondes
      intervalRef.current = setInterval(() => {
        console.log('🔄 [DeviceSelectionModal] Actualisation automatique des appareils');
        setRefreshing(true);
        loadDevices().finally(() => {
          setRefreshing(false);
        });
      }, 7000);
      
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Arrêter l'actualisation automatique
      if (intervalRef.current) {
        console.log('⏹️ [DeviceSelectionModal] Arrêt actualisation automatique');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible, loadDevices]);

  // Gestion de la sélection d'appareil
  const handleDeviceSelect = async (deviceId: string, deviceName: string) => {
    console.log(`🎯 [DeviceSelectionModal] Sélection appareil: ${deviceName} (${deviceId})`);
    
    try {
      clearError();
      await selectDevice(deviceId, deviceName);
      
      // Attendre un peu pour que le changement soit effectif
      setTimeout(() => {
        console.log(`✅ [DeviceSelectionModal] Sélection terminée, rafraîchissement liste`);
        loadDevices();
      }, 1500);
      
      // Fermer le modal après sélection réussie
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error(`❌ [DeviceSelectionModal] Erreur sélection appareil:`, error);
    }
  };

  // Actualisation manuelle
  const handleManualRefresh = async () => {
    console.log('🔄 [DeviceSelectionModal] Actualisation manuelle demandée');
    setRefreshing(true);
    clearError();
    await loadDevices();
    setRefreshing(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Overlay sombre */}
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end' 
      }}>
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            maxHeight: screenHeight * 0.7,
          }}
        >
          <LinearGradient
            colors={[
              colors.background.primary,
              colors.background.secondary,
              colors.background.card,
            ]}
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
              shadowColor: colors.primary.purple,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 12,
            }}
          >
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  marginBottom: 4,
                }}>
                  Appareils connectés
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 14,
                    color: colors.text.secondary,
                  }}>
                    {devices.length} appareil{devices.length > 1 ? 's' : ''} disponible{devices.length > 1 ? 's' : ''}
                  </Text>
                  {refreshing && (
                    <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                      <ActivityIndicator size="small" color={colors.primary.purple} />
                      <Text style={{
                        fontSize: 12,
                        color: colors.primary.purple,
                        marginLeft: 4,
                      }}>
                        Actualisation...
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Bouton actualiser manuel */}
              <TouchableOpacity
                onPress={handleManualRefresh}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.primary.purple}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
                disabled={refreshing}
              >
                <Ionicons 
                  name="refresh" 
                  size={20} 
                  color={colors.primary.purple} 
                />
              </TouchableOpacity>
              
              {/* Bouton fermer */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.text.secondary}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Message d'erreur */}
            {error && (
              <View style={{
                backgroundColor: '#EF444420',
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                borderLeftWidth: 3,
                borderLeftColor: '#EF4444',
              }}>
                <Text style={{
                  fontSize: 14,
                  color: '#EF4444',
                }}>
                  {error}
                </Text>
              </View>
            )}

            {/* Liste des appareils */}
            <ScrollView
              style={{ maxHeight: screenHeight * 0.4 }}
              showsVerticalScrollIndicator={false}
            >
              {isLoading && devices.length === 0 ? (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 40,
                }}>
                  <ActivityIndicator size="large" color={colors.primary.purple} />
                  <Text style={{
                    fontSize: 16,
                    color: colors.text.secondary,
                    marginTop: 12,
                  }}>
                    Recherche d'appareils...
                  </Text>
                </View>
              ) : devices.length === 0 ? (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 40,
                }}>
                  <Ionicons name="search" size={48} color={colors.text.muted} />
                  <Text style={{
                    fontSize: 16,
                    color: colors.text.secondary,
                    marginTop: 12,
                    textAlign: 'center',
                  }}>
                    Aucun appareil trouvé
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.text.muted,
                    marginTop: 4,
                    textAlign: 'center',
                  }}>
                    Assurez-vous que Spotify est ouvert sur vos appareils
                  </Text>
                </View>
              ) : (
                devices.map((device, index) => {
                  const isActive = device.is_active;
                  const deviceColor = getDeviceColor(device.type, isActive);
                  
                  console.log(`📱 [DeviceSelectionModal] Rendu appareil ${index + 1}: ${device.name} (${device.type}) - Actif: ${isActive}`);
                  
                  return (
                    <TouchableOpacity
                      key={device.id}
                      onPress={() => handleDeviceSelect(device.id, device.name)}
                      style={{
                        marginBottom: 12,
                      }}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={isActive ? [
                          `${colors.primary.purple}20`,
                          `${colors.primary.purple}10`,
                          `${colors.primary.purple}05`,
                        ] : [
                          `${colors.background.card}FF`,
                          `${colors.background.secondary}CC`,
                        ]}
                        style={{
                          borderRadius: 16,
                          padding: 16,
                          borderWidth: isActive ? 2 : 1,
                          borderColor: isActive ? colors.primary.purple : `${colors.text.muted}30`,
                        }}
                      >
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                          {/* Icône de l'appareil */}
                          <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: `${deviceColor}20`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16,
                          }}>
                            <Ionicons
                              name={getDeviceIcon(device.type)}
                              size={24}
                              color={deviceColor}
                            />
                          </View>

                          {/* Informations de l'appareil */}
                          <View style={{ flex: 1 }}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 4,
                            }}>
                              <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: colors.text.primary,
                                flex: 1,
                              }}>
                                {device.name}
                              </Text>
                              {isActive && (
                                <View style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  backgroundColor: colors.primary.purple,
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 12,
                                }}>
                                  <Ionicons name="checkmark-circle" size={14} color="white" />
                                  <Text style={{
                                    fontSize: 10,
                                    color: 'white',
                                    fontWeight: '600',
                                    marginLeft: 4,
                                  }}>
                                    ACTIF
                                  </Text>
                                </View>
                              )}
                            </View>
                            
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                              <Text style={{
                                fontSize: 14,
                                color: colors.text.secondary,
                                textTransform: 'capitalize',
                              }}>
                                {device.type.replace('_', ' ')}
                              </Text>
                              
                              {device.supports_volume && (
                                <View style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                  <Ionicons name="volume-medium" size={12} color={colors.text.muted} />
                                  <Text style={{
                                    fontSize: 12,
                                    color: colors.text.muted,
                                    marginLeft: 4,
                                  }}>
                                    {device.volume_percent}%
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}; 