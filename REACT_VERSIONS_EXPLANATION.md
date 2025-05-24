# Configuration des versions React - Explication

## Situation actuelle (RECOMMANDÉE)

### React 18.2.0
- **apps/web/** (Next.js)
- **packages/ui/**
- **packages/hooks/**

### React 19.0.0  
- **apps/mobile/** (Expo/React Native)

## Pourquoi cette configuration mixte est optimale

### 1. Compatibilité Expo/React Native
- Expo SDK 53 + React Native 0.79.2 nécessitent React 19
- Les nouvelles fonctionnalités de React 19 améliorent les performances mobile

### 2. Stabilité Next.js
- Next.js 15.3.2 est plus stable avec React 18.2
- Vos dépendances (@tanstack/react-query, @trpc, etc.) sont optimisées pour React 18
- Évite les conflits de types TypeScript

### 3. Isolation des packages
- Les packages partagés (ui, hooks) utilisent React 18.2
- Compatible avec l'app web sans conflit
- L'app mobile peut utiliser React 19 indépendamment

## Problèmes si tout était en React 18.2

1. **Expo incompatible** : Expo SDK 53 ne fonctionne pas correctement avec React 18
2. **React Native dégradé** : Perte des optimisations React 19 pour mobile
3. **Erreurs de build** : Conflits de dépendances dans l'écosystème Expo

## Configuration recommandée à maintenir

```json
// package.json racine - overrides globaux
"pnpm": {
  "overrides": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}

// apps/mobile/package.json - spécifique mobile
"resolutions": {
  "react": "19.0.0",
  "@types/react": "~19.0.10"
}
```

Cette configuration permet :
- ✅ Stabilité de l'app web
- ✅ Performance optimale mobile  
- ✅ Packages partagés compatibles
- ✅ Pas de conflits de dépendances 