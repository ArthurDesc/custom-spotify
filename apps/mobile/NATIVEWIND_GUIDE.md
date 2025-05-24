# Guide NativeWind - Tailwind CSS pour React Native

## Installation terminée ✅

NativeWind a été installé et configuré avec succès dans votre projet mobile !

## Qu'est-ce que NativeWind ?

NativeWind est une bibliothèque qui permet d'utiliser les classes utilitaires de Tailwind CSS directement dans vos composants React Native. C'est comme avoir Tailwind CSS mais pour React Native !

## Comment utiliser NativeWind

### 1. Classes de base
```tsx
import { View, Text } from 'react-native';

export function MonComposant() {
  return (
    <View className="flex-1 bg-blue-500 p-4">
      <Text className="text-white text-xl font-bold">
        Hello NativeWind !
      </Text>
    </View>
  );
}
```

### 2. Classes de layout
```tsx
// Flexbox
<View className="flex-1 justify-center items-center">
  <Text>Centré</Text>
</View>

// Padding et margin
<View className="p-4 m-2 px-6 py-3">
  <Text>Avec espacement</Text>
</View>

// Dimensions
<View className="w-full h-32 max-w-sm">
  <Text>Dimensions contrôlées</Text>
</View>
```

### 3. Classes de couleurs
```tsx
// Arrière-plans
<View className="bg-red-500 bg-gray-100 bg-blue-600">

// Texte
<Text className="text-white text-gray-800 text-blue-500">

// Bordures
<View className="border border-gray-300 border-red-500">
```

### 4. Classes de typographie
```tsx
<Text className="text-xs text-sm text-base text-lg text-xl text-2xl text-3xl">
<Text className="font-thin font-normal font-medium font-semibold font-bold">
<Text className="text-left text-center text-right">
```

### 5. Classes de bordures et arrondis
```tsx
<View className="rounded rounded-lg rounded-full">
<View className="border border-2 border-4">
<View className="shadow-sm shadow-md shadow-lg">
```

## Exemple complet

Voir le fichier `components/TestNativeWind.tsx` pour un exemple complet d'utilisation.

## Classes spécifiques à React Native

Certaines classes Tailwind sont adaptées pour React Native :
- `flex-1` équivaut à `flex: 1`
- Les couleurs sont automatiquement converties
- Les ombres utilisent les propriétés React Native

## Ressources

- [Documentation NativeWind](https://www.nativewind.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Classes utilitaires Tailwind](https://tailwindcss.com/docs/utility-first)

## Configuration

Les fichiers de configuration sont :
- `tailwind.config.js` - Configuration Tailwind
- `metro.config.js` - Configuration Metro avec NativeWind
- `global.css` - Styles globaux Tailwind
- `nativewind-env.d.ts` - Types TypeScript 