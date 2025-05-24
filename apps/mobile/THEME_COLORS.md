# Thème de Couleurs - Application Spotify Custom

## Vue d'ensemble
L'application utilise maintenant un thème violet et noir moderne avec des variables de couleurs réutilisables.

## Palette de Couleurs

### Couleurs Principales
- **Violet Principal** : `#6366F1` - Couleur d'accent principale
- **Violet Foncé** : `#4F46E5` - Pour les états hover/actifs
- **Violet Clair** : `#8B5CF6` - Pour les accents secondaires

### Couleurs de Fond
- **Primaire** : `#0F0F23` - Fond principal de l'application
- **Secondaire** : `#1A1A2E` - Fond des sections
- **Tertiaire** : `#16213E` - Fond alternatif
- **Cartes** : `#1E1E3F` - Fond des cartes et éléments

### Couleurs de Texte
- **Primaire** : `#FFFFFF` - Texte principal (blanc)
- **Secondaire** : `#B3B3B3` - Texte secondaire (gris clair)
- **Atténué** : `#6B7280` - Texte moins important
- **Accent** : `#8B5CF6` - Texte d'accent (violet clair)

### Couleurs d'État
- **Succès** : `#10B981` - Vert pour les succès
- **Avertissement** : `#F59E0B` - Orange pour les avertissements
- **Erreur** : `#EF4444` - Rouge pour les erreurs
- **Info** : `#3B82F6` - Bleu pour les informations

### Couleurs des Boutons
- **Primaire** : `#6366F1` - Boutons principaux
- **Primaire Hover** : `#4F46E5` - État hover des boutons principaux
- **Secondaire** : `#374151` - Boutons secondaires
- **Secondaire Hover** : `#4B5563` - État hover des boutons secondaires

### Couleurs des Bordures
- **Primaire** : `#374151` - Bordures principales
- **Secondaire** : `#4B5563` - Bordures secondaires
- **Accent** : `#6366F1` - Bordures d'accent

## Utilisation

### Dans les composants React Native
```typescript
import { colors } from '../utils/colors';

// Utilisation dans les styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
  },
  text: {
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary.purple,
  },
});
```

### Avec Tailwind CSS (NativeWind)
```jsx
<View className="bg-background-primary">
  <Text className="text-text-primary">Mon texte</Text>
  <TouchableOpacity className="bg-primary-purple">
    <Text className="text-text-primary">Mon bouton</Text>
  </TouchableOpacity>
</View>
```

## Composants Mis à Jour

Les composants suivants ont été mis à jour pour utiliser le nouveau thème :

1. **App.tsx** - Application principale
2. **MusicPlayerCard.tsx** - Nouveau composant de lecteur musical
3. **PlayerControls.tsx** - Contrôles de lecture
4. **PlaylistCard.tsx** - Cartes de playlist
5. **TrackList.tsx** - Liste des titres
6. **LoadingSpinner.tsx** - Indicateur de chargement

## Configuration Tailwind

Le fichier `tailwind.config.js` a été mis à jour pour inclure toutes les couleurs personnalisées, permettant leur utilisation avec les classes Tailwind.

## Types TypeScript

Des types TypeScript sont disponibles pour une utilisation type-safe des couleurs :

```typescript
import { ColorPalette, ColorCategory, ColorShade } from '../utils/colors';
``` 