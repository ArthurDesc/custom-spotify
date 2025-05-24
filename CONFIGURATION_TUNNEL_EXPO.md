# 🌐 Configuration Tunnel Expo - Solution Mobile

## 🎯 **Pourquoi utiliser le tunnel Expo ?**

- ✅ **HTTPS automatique** - Fonctionne parfaitement avec Safari
- ✅ **Accessible depuis mobile** - Pas de problème localhost
- ✅ **Gratuit et simple** - Intégré à Expo
- ✅ **Pas de configuration réseau** - Fonctionne partout

---

## 🚀 **Configuration Étape par Étape**

### **1. Démarrer le serveur web (Terminal 1)**
```bash
cd /c/laragon/www/custom-spotify
pnpm dev
```

### **2. Démarrer l'app mobile avec tunnel (Terminal 2)**
```bash
cd /c/laragon/www/custom-spotify/apps/mobile
npx expo start --tunnel
```

### **3. Noter l'URL tunnel affichée**
Expo va afficher quelque chose comme :
```
› Tunnel ready.
› https://abc123-anonymous-8081.exp.direct
```

### **4. Mettre à jour la configuration**
Dans `apps/mobile/.env`, remplacez :
```bash
EXPO_PUBLIC_API_URL=https://abc123-anonymous-8081.exp.direct
```

### **5. Mettre à jour Spotify Dashboard**
Ajoutez dans vos Redirect URIs :
```
https://abc123-anonymous-8081.exp.direct/api/auth/callback/spotify
```

---

## 📱 **Test de la Configuration**

1. **Vérifier l'API** :
   ```bash
   curl https://abc123-anonymous-8081.exp.direct/api/health
   ```

2. **Tester sur mobile** :
   - Scanner le QR code avec Expo Go
   - Cliquer "🎵 Connexion Spotify"
   - Safari s'ouvre avec l'URL HTTPS
   - Connexion réussie et retour vers l'app

---

## 🔄 **Automatisation avec Script**

Créez un fichier `start-tunnel.sh` :
```bash
#!/bin/bash
echo "🚀 Démarrage de la démo avec tunnel Expo..."

# Terminal 1 : Serveur web
echo "📡 Démarrage du serveur web..."
cd /c/laragon/www/custom-spotify
pnpm dev &

# Attendre que le serveur démarre
sleep 5

# Terminal 2 : App mobile avec tunnel
echo "🌐 Démarrage du tunnel Expo..."
cd apps/mobile
npx expo start --tunnel
```

---

## 🆘 **Résolution de Problèmes**

### **Tunnel lent ou instable :**
- ✅ Redémarrer avec `npx expo start --tunnel`
- ✅ Vérifier votre connexion internet
- ✅ Essayer à un autre moment

### **URL tunnel change :**
- ✅ Mettre à jour `apps/mobile/.env`
- ✅ Mettre à jour Spotify Dashboard
- ✅ Redémarrer l'app mobile

### **Safari ne s'ouvre pas :**
- ✅ Vérifier que l'URL tunnel est HTTPS
- ✅ Tester l'URL dans Safari manuellement
- ✅ Redémarrer l'app Expo Go

---

## 🎯 **Avantages vs Inconvénients**

### **✅ Avantages :**
- HTTPS natif (pas de problème SSL)
- Accessible depuis n'importe où
- Pas de configuration réseau
- Fonctionne avec tous les navigateurs

### **❌ Inconvénients :**
- URL change à chaque redémarrage
- Dépend de la connexion internet
- Peut être plus lent que localhost

---

## 🔧 **Configuration Finale Recommandée**

```bash
# apps/mobile/.env
EXPO_PUBLIC_API_URL=https://votre-tunnel-expo.ngrok.io

# Spotify Dashboard Redirect URIs
https://votre-tunnel-expo.ngrok.io/api/auth/callback/spotify
custom-spotify://auth
```

**🎉 Cette configuration résout tous les problèmes de localhost sur mobile !**

## 📋 Problème
À chaque redémarrage du tunnel Expo, une nouvelle URL aléatoire est générée (ex: `https://abc123-anonymous-8081.exp.direct`). Cette URL doit être mise à jour dans plusieurs endroits pour que l'authentification Spotify fonctionne.

## 🔄 Procédure à suivre à chaque redémarrage

### 1. **Démarrer le tunnel Expo**
```bash
cd apps/mobile
npx expo start --tunnel
```

### 2. **Récupérer la nouvelle URL**
Dans le terminal, cherchez une ligne similaire à :
```
› Metro waiting on exp://[NOUVELLE-URL]-8081.exp.direct
```

L'URL HTTPS correspondante sera : `https://[NOUVELLE-URL]-8081.exp.direct`

**Exemple actuel :** `https://frdzcee-anonymous-8081.exp.direct`## ⚠️ **Important : Architecture des serveurs****Le tunnel Expo sert uniquement l'application mobile**, pas l'API Next.js. Donc :- **App mobile** : Utilise le tunnel Expo (`https://xxx.exp.direct`) pour l'interface- **API Next.js** : Utilise votre IP locale (`http://192.168.1.148:3000`) pour les endpoints

### 3. **Mettre à jour les fichiers de configuration**

#### 📱 **apps/mobile/.env**```env# URL de l'API pour le développement# Votre IP locale actuelleEXPO_PUBLIC_API_URL=http://192.168.1.148:3000# Pour utiliser le tunnel Expo (alternative)# EXPO_PUBLIC_API_URL=https://[NOUVELLE-URL]-8081.exp.direct```

#### 🌐 **apps/web/.env.local**
```env
# NextAuth.js Configuration
NEXTAUTH_SECRET="0R+Sma0TfG1S+dyOGQMvxqix7tDjDAN0mg6cPPVe9zw="
NEXTAUTH_URL="http://192.168.1.148:3000"# SPOTIFY API CONFIGURATIONSPOTIFY_CLIENT_ID="9a090128ced9401aaf6b34a49054ed9e"SPOTIFY_CLIENT_SECRET="3047c0f47f9747ad9caa21a3bba14b0e"SPOTIFY_REDIRECT_URI="http://192.168.1.148:3000/api/auth/callback/spotify"
SPOTIFY_MOBILE_REDIRECT_URI="custom-spotify://auth"
```

### 4. **Mettre à jour le Dashboard Spotify Developer**

Allez sur [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) et modifiez votre application :

#### **Redirect URIs** (ajoutez la nouvelle URL) :
- `http://127.0.0.1:3000/api/auth/callback/spotify` (gardez celle-ci)
- `https://[NOUVELLE-URL]-8081.exp.direct/api/auth/callback/spotify` (nouvelle)

#### **Website** (optionnel) :
- `https://[NOUVELLE-URL]-8081.exp.direct`

### 5. **Redémarrer le serveur web**
```bash
# Dans le terminal principal
pnpm dev
```

### 6. **Tester l'authentification**
- Ouvrez votre app mobile
- Cliquez sur "Se connecter avec Spotify"
- Vérifiez que l'autorisation Spotify fonctionne

## 🎯 URLs actuelles (à mettre à jour)

**URL actuelle du tunnel :** `https://frdzcee-anonymous-8081.exp.direct`

### Configuration Spotify Developer Dashboard :
- **Website :** `https://frdzcee-anonymous-8081.exp.direct`
- **Redirect URIs :**
  - `http://127.0.0.1:3000/api/auth/callback/spotify`
  - `https://frdzcee-anonymous-8081.exp.direct/api/auth/callback/spotify`
  - `custom-spotify://auth`

## 💡 Conseils

1. **Gardez ce fichier ouvert** quand vous développez pour référence rapide
2. **Bookmarkez votre Dashboard Spotify** pour un accès rapide
3. **Testez toujours après chaque changement** d'URL
4. **En production**, utilisez une URL fixe (domaine personnalisé)

## 🚨 Dépannage

Si l'authentification ne fonctionne pas :
1. Vérifiez que toutes les URLs sont identiques dans tous les fichiers
2. Assurez-vous d'avoir redémarré le serveur web après les changements
3. Vérifiez que l'URL est bien ajoutée dans le Dashboard Spotify
4. Testez l'URL du tunnel dans un navigateur pour vérifier qu'elle fonctionne

## 📝 Checklist rapide

- [ ] Tunnel Expo démarré
- [ ] Nouvelle URL récupérée
- [ ] `apps/mobile/.env` mis à jour
- [ ] `apps/web/.env.local` mis à jour
- [ ] Dashboard Spotify mis à jour
- [ ] Serveur web redémarré
- [ ] Test d'authentification effectué 
