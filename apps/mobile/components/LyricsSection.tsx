import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  // Simulation de récupération des paroles
  // Dans un vrai projet, vous intégreriez l'API Genius ou une autre API de paroles
  useEffect(() => {
    if (visible && !lyrics) {
      setLoading(true);
      setError(null);
      
      // Simulation d'un appel API
      setTimeout(() => {
        setLoading(false);
        // Paroles factices pour la démonstration
        setLyrics(`[Paroles de "${trackName}" par ${artistName}]

Verse 1:
Lorem ipsum dolor sit amet
Consectetur adipiscing elit
Sed do eiusmod tempor incididunt
Ut labore et dolore magna aliqua

Chorus:
Ut enim ad minim veniam
Quis nostrud exercitation
Ullamco laboris nisi ut aliquip
Ex ea commodo consequat

Verse 2:
Duis aute irure dolor in reprehenderit
In voluptate velit esse cillum
Dolore eu fugiat nulla pariatur
Excepteur sint occaecat cupidatat

Chorus:
Ut enim ad minim veniam
Quis nostrud exercitation
Ullamco laboris nisi ut aliquip
Ex ea commodo consequat

Bridge:
Sed ut perspiciatis unde omnis
Iste natus error sit voluptatem
Accusantium doloremque laudantium
Totam rem aperiam

Outro:
At vero eos et accusamus
Et iusto odio dignissimos
Ducimus qui blanditiis praesentium
Voluptatum deleniti atque corrupti`);
      }, 1500);
    }
  }, [visible, trackName, artistName, lyrics]);

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
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <ActivityIndicator size="large" color="#333" />
            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
              }}
            >
              Récupération des paroles via Genius...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <Ionicons name="warning" size={48} color="#999" />
            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
              }}
            >
              {error}
            </Text>
          </View>
        ) : lyrics ? (
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: '#333',
              textAlign: 'left',
            }}
          >
            {lyrics}
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <Ionicons name="musical-notes" size={48} color="#999" />
            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
              }}
            >
              Aucune parole disponible
            </Text>
          </View>
        )}
      </ScrollView>


    </View>
  );
}; 