# Composants de Détail Musical

Ce document explique l'utilisation des nouveaux composants pour afficher les détails de la musique en cours.

## Composants Créés

### 1. `MusicDetailModal`
Un modal moderne et élégant pour afficher les détails complets de la musique en cours avec :
- Image de l'album en grand format avec effet de flou en arrière-plan
- Informations détaillées de la piste (titre, artiste, album)
- Contrôles de lecture avancés (play/pause, suivant/précédent, shuffle, repeat)
- Barre de progression interactive
- Contrôle de volume
- Section préparée pour les clips vidéo (fonctionnalité future)
- Animations fluides d'ouverture/fermeture

### 2. `MusicPlayerWithModal`
Un composant wrapper qui combine `MusicPlayerCard` et `MusicDetailModal` pour une intégration facile.

## Fonctionnalités

### Design Moderne
- Interface utilisateur inspirée des applications de streaming modernes
- Animations fluides avec React Native Animated
- Effet de flou (BlurView) et dégradés (LinearGradient)
- Design responsive qui s'adapte à différentes tailles d'écran

### Contrôles Avancés
- **Play/Pause** : Bouton principal avec design circulaire
- **Navigation** : Boutons précédent/suivant
- **Shuffle** : Activation/désactivation du mode aléatoire
- **Repeat** : Cycle entre les modes de répétition (off/track/context)
- **Volume** : Contrôle de volume avec slider (extensible)
- **Progression** : Barre de progression avec temps affiché

### Clips Vidéo (Futur)
Une section est préparée pour l'intégration des clips vidéo. Bien que l'API Spotify Web standard ne fournisse pas directement l'accès aux clips vidéo, la structure est en place pour :
- Intégrer des clips vidéo quand ils seront disponibles
- Utiliser des APIs tierces pour les clips vidéo
- Afficher des visualisations audio alternatives

## Installation des Dépendances

Les dépendances suivantes ont été ajoutées :

```bash
npm install expo-linear-gradient expo-blur
```

## Utilisation

### Utilisation Simple avec le Wrapper

```tsx
import { MusicPlayerWithModal } from './components/MusicPlayerWithModal';

// Dans votre composant
<MusicPlayerWithModal
  currentTrack={currentTrack}
  playbackState={playbackState}
  onPlaylistPress={handlePlaylistPress}
  onPause={handlePause}
  onResume={handleResume}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onToggleShuffle={handleToggleShuffle}
  onToggleRepeat={handleToggleRepeat}
  onSeek={handleSeek}
  onVolumeChange={handleVolumeChange}
  isInLayout={true}
/>
```

### Utilisation Manuelle

```tsx
import { MusicPlayerCard } from './components/MusicPlayerCard';
import { MusicDetailModal } from './components/MusicDetailModal';

const [isModalVisible, setIsModalVisible] = useState(false);

// MusicPlayerCard avec la nouvelle prop onTrackPress
<MusicPlayerCard
  // ... autres props
  onTrackPress={() => setIsModalVisible(true)}
/>

// Modal de détail
<MusicDetailModal
  visible={isModalVisible}
  onClose={() => setIsModalVisible(false)}
  currentTrack={currentTrack}
  playbackState={playbackState}
  onPlayPause={handlePlayPause}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onToggleShuffle={handleToggleShuffle}
  onToggleRepeat={handleToggleRepeat}
  onSeek={handleSeek}
  onVolumeChange={handleVolumeChange}
/>
```

## Props du MusicDetailModal

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Contrôle la visibilité du modal |
| `onClose` | `() => void` | Fonction appelée pour fermer le modal |
| `currentTrack` | `Track \| null` | Informations de la piste actuelle |
| `playbackState` | `PlaybackState \| null` | État de lecture actuel |
| `onPlayPause` | `() => void` | Fonction pour play/pause |
| `onNext` | `() => void` | Fonction pour piste suivante |
| `onPrevious` | `() => void` | Fonction pour piste précédente |
| `onToggleShuffle` | `() => void` | Fonction pour toggle shuffle |
| `onToggleRepeat` | `() => void` | Fonction pour toggle repeat |
| `onSeek` | `(position: number) => void` | Fonction pour changer la position (optionnel) |
| `onVolumeChange` | `(volume: number) => void` | Fonction pour changer le volume (optionnel) |

## Fonctionnalités Futures

### Clips Vidéo
- **API Spotify** : Bien que l'API Web Spotify ne fournisse pas directement les clips vidéo, Spotify a introduit les clips vidéo pour les utilisateurs Premium dans certains pays
- **APIs Tierces** : Intégration possible avec YouTube Music API, Vimeo, ou d'autres services
- **Visualisations** : Affichage de visualisations audio en attendant les vrais clips

### Améliorations Prévues
- Gestes tactiles pour la barre de progression
- Animations de transition entre les pistes
- Mode plein écran pour les clips vidéo
- Paroles synchronisées
- Égaliseur audio
- Partage social

## Notes Techniques

### Performance
- Utilisation de `React.memo` pour optimiser les re-rendus
- Animations natives avec `useNativeDriver: true`
- Images optimisées avec mise en cache

### Accessibilité
- Support des lecteurs d'écran
- Navigation au clavier
- Contrastes de couleurs respectés
- Tailles de touch targets appropriées

### Compatibilité
- iOS et Android
- Différentes tailles d'écran
- Mode sombre/clair (selon votre thème)

## Troubleshooting

### Problèmes Courants

1. **Modal ne s'affiche pas** : Vérifiez que `visible={true}` et que les dépendances sont installées
2. **Animations saccadées** : Assurez-vous que `react-native-reanimated` est correctement configuré
3. **Images floues** : Vérifiez la qualité des images d'album dans l'API Spotify

### Logs de Debug

Ajoutez des logs pour débugger :

```tsx
console.log('Current track:', currentTrack);
console.log('Playback state:', playbackState);
console.log('Modal visible:', isModalVisible);
``` 