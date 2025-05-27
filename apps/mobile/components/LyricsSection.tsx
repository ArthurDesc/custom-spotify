import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { generateGeniusUrl } from '../utils/geniusUtils';

interface LyricsSectionProps {
  trackName: string;
  artistName: string;
  visible: boolean;
  onClose: () => void;
}

export const LyricsSection: React.FC<LyricsSectionProps> = ({
  trackName,
  artistName,
  visible,
  onClose,
}) => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geniusUrl, setGeniusUrl] = useState<string | null>(null);

  // Génération de l'URL Genius et gestion des paroles
  useEffect(() => {
    if (visible && trackName && artistName) {
      // Générer l'URL Genius
      const url = generateGeniusUrl(artistName, trackName);
      setGeniusUrl(url);
      
      // Reset des états
      setLoading(false);
      setError(null);
      setLyrics(null);
      
      console.log('🎵 [LyricsSection] URL Genius générée:', url);
    }
  }, [visible, trackName, artistName]);

  // Fonction pour ouvrir l'URL Genius
  const handleOpenGenius = async () => {
    if (!geniusUrl) return;
    
    try {
      console.log('🌐 [LyricsSection] Ouverture de l\'URL Genius:', geniusUrl);
      await WebBrowser.openBrowserAsync(geniusUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
        controlsColor: '#1DB954',
        toolbarColor: '#191414',
      });
    } catch (error) {
      console.error('❌ [LyricsSection] Erreur lors de l\'ouverture de Genius:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir le lien vers Genius. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8f8f8',
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 20,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#333',
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {trackName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
            }}
            numberOfLines={1}
          >
            {artistName}
          </Text>
        </View>
        
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Contenu des paroles */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          {/* Icône Genius */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FFFF64',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#000',
              }}
            >
              🎵
            </Text>
          </View>

          {/* Titre et description */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#333',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Paroles sur Genius
          </Text>
          
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              marginBottom: 32,
              lineHeight: 22,
              paddingHorizontal: 20,
            }}
          >
            Consultez les paroles complètes, annotations et explications sur Genius.com
          </Text>

          {/* URL générée (pour debug) */}
          {geniusUrl && (
            <Text
              style={{
                fontSize: 12,
                color: '#999',
                textAlign: 'center',
                marginBottom: 24,
                paddingHorizontal: 20,
                fontFamily: 'monospace',
              }}
              numberOfLines={2}
            >
              {geniusUrl}
            </Text>
          )}

          {/* Bouton pour ouvrir Genius */}
          <TouchableOpacity
            style={{
              backgroundColor: '#FFFF64',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={handleOpenGenius}
            disabled={!geniusUrl}
          >
            <Ionicons 
              name="open-outline" 
              size={20} 
              color="#000" 
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#000',
              }}
            >
              Ouvrir sur Genius
            </Text>
          </TouchableOpacity>

          {/* Note informative */}
          <Text
            style={{
              fontSize: 14,
              color: '#888',
              textAlign: 'center',
              marginTop: 24,
              paddingHorizontal: 30,
              lineHeight: 20,
            }}
          >
            La page s'ouvrira dans votre navigateur. Si la chanson n'est pas trouvée, vous pouvez chercher manuellement sur Genius.
          </Text>
        </View>
      </ScrollView>


    </View>
  );
}; 