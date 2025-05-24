# 🚀 Guide de Démarrage Rapide - Démo Spotify

## 📋 **Configuration Spotify Dashboard**

**IMPORTANT** : Avant de commencer, ajoutez cette URL dans votre Spotify Dashboard :

```
http://localhost:3000/api/auth/callback/spotify
```

### Comment faire :
1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Sélectionnez votre app "Custom Spotify"
3. Cliquez sur "Edit Settings"
4. Dans "Redirect URIs", ajoutez : `http://localhost:3000/api/auth/callback/spotify`
5. Cliquez "Save"

---

## 🎯 **Option 1 : Configuration Localhost (RECOMMANDÉE)**

### Étapes :
1. **Démarrer le serveur web :**
   ```bash
   cd /c/laragon/www/custom-spotify
   pnpm dev
   ```

2. **Démarrer l'app mobile :**
   ```bash
   cd apps/mobile
   npx expo start
   ```

3. **Tester la connexion :**
   - Ouvrir l'app sur votre téléphone via Expo Go
   - Cliquer sur "🎵 Connexion Spotify"
   - Se connecter avec votre compte Spotify
   - Voir votre profil et tester l'API

### Configuration utilisée :
- ✅ `EXPO_PUBLIC_API_URL=http://localhost:3000`
- ✅ `SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify`

---

## 🌐 **Option 2 : Configuration Tunnel (Si localhost ne marche pas)**

### Étapes :
1. **Démarrer le serveur web :**
   ```bash
   cd /c/laragon/www/custom-spotify
   pnpm dev
   ```

2. **Démarrer l'app mobile avec tunnel :**
   ```bash
   cd apps/mobile
   npx expo start --tunnel
   ```

3. **Mettre à jour la configuration :**
   - Noter l'URL tunnel affichée (ex: `https://abc123.ngrok.io`)
   - Modifier `apps/mobile/.env` :
     ```bash
     # EXPO_PUBLIC_API_URL=http://localhost:3000
     EXPO_PUBLIC_API_URL=https://abc123.ngrok.io
     ```

4. **Mettre à jour Spotify Dashboard :**
   - Ajouter : `https://abc123.ngrok.io/api/auth/callback/spotify`

---

## 🧪 **Test de la Démo**

### Fonctionnalités à tester :

1. **Connexion Spotify :**
   - ✅ Cliquer sur "🎵 Connexion Spotify"
   - ✅ Autoriser l'accès dans le navigateur
   - ✅ Retour automatique vers l'app

2. **Profil Spotify :**
   - ✅ Voir votre nom, email, pays
   - ✅ Voir votre photo de profil
   - ✅ Voir votre type d'abonnement

3. **Test API :**
   - ✅ Cliquer sur "🧪 Tester API Spotify"
   - ✅ Voir vos playlists dans une popup

4. **Déconnexion :**
   - ✅ Cliquer sur "Se déconnecter"
   - ✅ Retour à l'écran de connexion

---

## 🔍 **Vérification de la Configuration**

### Vérifier que tout fonctionne :

1. **API de santé :**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Doit retourner : `{"status":"healthy",...}`

2. **Variables d'environnement :**
   ```bash
   # Dans apps/mobile/.env
   cat apps/mobile/.env
   ```

3. **Logs en temps réel :**
   - Regarder les logs du serveur web
   - Regarder les logs de l'app mobile dans Expo

---

## 🆘 **Résolution de Problèmes**

### Erreur "Invalid redirect URI" :
- ✅ Vérifier l'URL dans Spotify Dashboard
- ✅ Redémarrer le serveur après modification
- ✅ Vider le cache du navigateur

### App mobile ne se connecte pas :
- ✅ Vérifier `EXPO_PUBLIC_API_URL` dans `.env`
- ✅ Tester `curl http://localhost:3000/api/health`
- ✅ Redémarrer Expo avec `r`

### Erreur "OAuthAccountNotLinked" :
- ✅ Utiliser un autre email de test
- ✅ Ou supprimer l'utilisateur existant en base

---

## 📱 **Commandes Rapides**

```bash
# Terminal 1 : Serveur web
cd /c/laragon/www/custom-spotify && pnpm dev

# Terminal 2 : App mobile
cd /c/laragon/www/custom-spotify/apps/mobile && npx expo start

# Test API
curl http://localhost:3000/api/health
```

---

## ✅ **Checklist de Démo**

- [ ] Spotify Dashboard configuré avec `http://localhost:3000/api/auth/callback/spotify`
- [ ] Serveur web démarré (`pnpm dev`)
- [ ] App mobile démarrée (`npx expo start`)
- [ ] Test de connexion Spotify réussi
- [ ] Profil Spotify affiché
- [ ] Test API Spotify fonctionnel
- [ ] Déconnexion testée

**🎉 Votre démo est prête !** 