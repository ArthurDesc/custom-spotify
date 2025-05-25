# Composants d'Animation - Thème Galactique

Ce dossier contient les composants d'animation pour créer un fond galactique épuré et apaisant dans l'application Spotify personnalisée.

## Composants

### 🌌 AnimatedBackground
**Fichier:** `AnimatedBackground.tsx`

Composant principal qui orchestre tous les effets visuels de fond. Il combine :
- Dégradés de couleurs dynamiques
- Particules flottantes
- Effet de vortex subtil
- Lueur en bas d'écran

**Utilisation:**
```tsx
import { AnimatedBackground } from './components/AnimatedBackground';

<View style={styles.container}>
  <AnimatedBackground />
  {/* Votre contenu */}
</View>
```

### ⭐ StarField
**Fichier:** `StarField.tsx`

Crée un champ d'étoiles scintillantes en arrière-plan avec :
- 50 étoiles de tailles variables
- Animation de scintillement aléatoire
- Effet de lueur subtile

**Caractéristiques:**
- Tailles d'étoiles : 0.5px à 2.5px
- Vitesse de scintillement : 1-3 secondes
- Opacité variable : 0.1 à 1.0

### 🌫️ NebulaEffect
**Fichier:** `NebulaEffect.tsx`

Ajoute des nuages de nébuleuse flottants avec :
- 3 nuages de tailles différentes (200-500px)
- Mouvement lent et rotation
- Dégradés violets transparents

**Animations:**
- Déplacement : 15-25 secondes par cycle
- Rotation : 30-50 secondes par tour complet
- Changement d'échelle et d'opacité

### 🕳️ BlackHoleEffect
**Fichier:** `BlackHoleEffect.tsx`

Effet de trou noir central avec :
- Pulsation douce (3 secondes par cycle)
- Rotation lente (20 secondes par tour)
- Anneaux concentriques subtils

**Dimensions:**
- Taille : 60% de la largeur d'écran
- 3 anneaux concentriques (80%, 60%, 40%)
- Dégradé radial vers le centre

## Palette de Couleurs

Les animations utilisent la palette de couleurs définie dans `utils/colors.ts` :

```typescript
primary: {
  purple: '#6366F1',
  darkPurple: '#4F46E5',
  lightPurple: '#8B5CF6',
}

background: {
  primary: '#0F0F23',
  secondary: '#1A1A2E',
  tertiary: '#16213E',
}
```

## Performance

### Optimisations appliquées :
- ✅ `useNativeDriver: true` pour toutes les animations
- ✅ Nombre limité de particules (15 particules, 50 étoiles, 3 nuages)
- ✅ Animations en boucle pour éviter les re-créations
- ✅ Cleanup automatique des animations au démontage

### Z-Index Hierarchy :
- StarField: `-2` (arrière-plan)
- NebulaEffect: `-1` 
- BlackHoleEffect: `-1`
- AnimatedBackground: `-1`
- Contenu de l'app: `0` et plus

## Intégration

Le composant `AnimatedBackground` est intégré dans :
1. **App.tsx** - Écrans de chargement et connexion
2. **MainLayout.tsx** - Layout principal de l'application

## Personnalisation

Pour ajuster l'intensité des effets :

```typescript
// Dans StarField.tsx - Réduire le nombre d'étoiles
for (let i = 0; i < 30; i++) { // au lieu de 50

// Dans AnimatedBackground.tsx - Réduire les particules
for (let i = 0; i < 10; i++) { // au lieu de 15

// Dans NebulaEffect.tsx - Ajuster l'opacité
opacity: new Animated.Value(0.05 + Math.random() * 0.1), // plus subtil
```

## Thème Galactique

L'ensemble crée une ambiance spatiale apaisante qui évoque :
- 🌌 L'immensité de l'espace
- ⭐ Les étoiles scintillantes
- 🌫️ Les nébuleuses colorées
- 🕳️ Les phénomènes cosmiques mystérieux

Parfait pour une application musicale qui veut transporter l'utilisateur dans un univers relaxant et immersif. 