# 🔧 Guide de Configuration - Custom Spotify

Ce guide vous aide à choisir et configurer la meilleure option pour votre environnement de développement.

## 📋 Options disponibles

### 1. 🏠 **Localhost (RECOMMANDÉ pour le développement)**

**Avantages :**
- ✅ Configuration la plus stable
- ✅ Spotify accepte officiellement `localhost`
- ✅ Pas de dépendance externe
- ✅ Fonctionne hors ligne

**Configuration :**
```bash
# Dans .env et apps/web/.env.local
NEXTAUTH_URL="http://localhost:3000"
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/auth/callback/spotify"
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

**Spotify Dashboard :**
- Ajouter : `http://localhost:3000/api/auth/callback/spotify`

---

### 2. 🌐 **Tunnel Expo (RECOMMANDÉ pour les tests mobiles)**

**Avantages :**
- ✅ HTTPS automatique
- ✅ Gratuit et intégré
- ✅ Accessible depuis n'importe où
- ✅ Pas de configuration complexe

**Configuration :**
```bash
# Démarrer avec tunnel
expo start --tunnel

# Dans .env
EXPO_PUBLIC_API_URL="https://votre-tunnel-expo.ngrok.io"
```

**Spotify Dashboard :**
- Ajouter : `https://votre-tunnel-expo.ngrok.io/api/auth/callback/spotify`

---

### 3. 🔗 **ngrok (Pour les démos/tests externes)**

**Avantages :**
- ✅ URLs stables (avec compte payant)
- ✅ HTTPS garanti
- ✅ Accessible publiquement
- ❌ Limitations sur le plan gratuit

**Installation :**
```bash
npm install -g ngrok
ngrok http 3000
```

**Configuration :**
```bash
# Dans .env
EXPO_PUBLIC_API_URL="https://votre-url.ngrok.io"
```

---

### 4. 🏠 **IP Locale (Réseau local uniquement)**

**Avantages :**
- ✅ Simple pour tests en réseau local
- ❌ Pas d'HTTPS (problèmes avec Spotify)
- ❌ Limité au réseau local

**Configuration :**
```bash
# Dans .env
EXPO_PUBLIC_API_URL="http://192.168.1.148:3000"
```

## 🎯 **Recommandations par cas d'usage**

### Développement quotidien
```bash
# Utiliser localhost
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

### Tests sur mobile
```bash
# Utiliser le tunnel Expo
expo start --tunnel
```

### Démos avec clients
```bash
# Utiliser ngrok
ngrok http 3000
```

## 🔄 **Changement rapide d'environnement**

### Option 1 : Modifier .env
```bash
# Commenter/décommenter dans .env
# EXPO_PUBLIC_API_URL="http://localhost:3000"
EXPO_PUBLIC_API_URL="https://votre-tunnel.ngrok.io"
```

### Option 2 : Variables d'environnement temporaires
```bash
# Pour une session
EXPO_PUBLIC_API_URL="https://tunnel.ngrok.io" expo start
```

## 🛠 **Dépendances requises**

### Configuration actuelle (optimisée)
```json
{
  "dependencies": {
    "next-auth": "^4.24.11",
    "expo-web-browser": "~14.1.6",
    "expo-linking": "~7.1.5",
    "@react-native-async-storage/async-storage": "^2.1.2"
  }
}
```

### Dépendances optionnelles
```bash
# Pour ngrok
npm install -g ngrok

# Pour tunnel Expo (déjà inclus)
# Aucune installation supplémentaire
```

## 🚨 **Configuration Spotify Dashboard**

**URLs à ajouter selon votre environnement :**

1. **Développement local :**
   - `http://localhost:3000/api/auth/callback/spotify`

2. **Tunnel Expo :**
   - `https://votre-tunnel.ngrok.io/api/auth/callback/spotify`

3. **ngrok :**
   - `https://votre-url.ngrok.io/api/auth/callback/spotify`

## 🔍 **Diagnostic automatique**

L'app mobile détecte automatiquement l'environnement disponible :

```typescript
import { detectBestEnvironment, getApiUrl } from './utils/config';

// Détection automatique
const env = await detectBestEnvironment();
const apiUrl = getApiUrl();
```

## 📝 **Checklist de configuration**

- [ ] Variables d'environnement configurées
- [ ] Spotify Dashboard mis à jour
- [ ] Serveur Next.js démarré
- [ ] App mobile testée
- [ ] Authentification Spotify fonctionnelle

## 🆘 **Résolution de problèmes**

### Erreur "Invalid redirect URI"
- ✅ Vérifier l'URL dans Spotify Dashboard
- ✅ Redémarrer le serveur après changement d'URL
- ✅ Vider le cache du navigateur

### App mobile ne se connecte pas
- ✅ Vérifier `EXPO_PUBLIC_API_URL`
- ✅ Tester l'endpoint `/api/health`
- ✅ Vérifier la connectivité réseau

### Erreur "OAuthAccountNotLinked"
- ✅ Supprimer l'utilisateur existant en base
- ✅ Ou utiliser un autre email de test 