# Configuration Spotify - Guide Complet

## 🎵 Configuration de l'API Spotify

### 1. Configuration dans la Console Développeur Spotify

1. **Accédez à la Console Développeur Spotify** : https://developer.spotify.com/dashboard
2. **Créez une nouvelle application** ou utilisez une existante
3. **Configurez les URLs de redirection** dans les paramètres de votre app :
   - Pour le web : `http://localhost:3000/api/auth/callback/spotify`
   - Pour l'app mobile : `custom-spotify://auth`

### 2. Variables d'Environnement

Les clés suivantes sont déjà configurées dans le fichier `.env` :

```env
SPOTIFY_CLIENT_ID="9a090128ced9401aaf6b34a49054ed9e"
SPOTIFY_CLIENT_SECRET="3047c0f47f9747ad9caa21a3bba14b0e"
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/auth/callback/spotify"
SPOTIFY_MOBILE_REDIRECT_URI="custom-spotify://auth"
```

## 🚀 Démarrage des Applications

### Backend (Next.js)

```bash
cd apps/web
pnpm install
pnpm run dev
```

Le backend sera disponible sur : http://localhost:3000

### Application Mobile (React Native/Expo)

```bash
cd apps/mobile
pnpm install
pnpm start
```

Puis choisissez votre plateforme :
- `i` pour iOS Simulator
- `a` pour Android Emulator
- `w` pour Web

## 📱 Fonctionnalités Disponibles

### Backend API Routes

- **Profil utilisateur** : `GET /api/spotify/profile`
- **Playlists** : `GET /api/spotify/playlists`
- **Recherche** : `GET /api/spotify/search?q=query`
- **Contrôle lecteur** : `GET/POST /api/spotify/player`
- **Top tracks** : `GET /api/spotify/top-tracks`
- **Top artists** : `GET /api/spotify/top-artists`
- **Récemment joués** : `GET /api/spotify/recently-played`

### Application Mobile

- **Authentification OAuth** avec Spotify
- **Affichage du profil** utilisateur
- **Liste des playlists** personnelles
- **Top tracks** de l'utilisateur
- **Contrôles de lecture** basiques

## 🔧 Configuration Spotify Console

### URLs de Redirection à Ajouter

Dans votre application Spotify Developer Dashboard, ajoutez ces URLs :

1. **Pour le développement web** :
   ```
   http://localhost:3000/api/auth/callback/spotify
   ```

2. **Pour l'application mobile** :
   ```
   custom-spotify://auth
   ```

### Scopes Requis

L'application demande les permissions suivantes :
- `user-read-email` - Lire l'email de l'utilisateur
- `user-read-private` - Lire les informations privées
- `user-read-playback-state` - Lire l'état de lecture
- `user-modify-playback-state` - Contrôler la lecture
- `user-read-currently-playing` - Lire la piste en cours
- `user-library-read` - Lire la bibliothèque
- `user-library-modify` - Modifier la bibliothèque
- `playlist-read-private` - Lire les playlists privées
- `playlist-modify-public` - Modifier les playlists publiques
- `playlist-modify-private` - Modifier les playlists privées
- `user-top-read` - Lire les top tracks/artists
- `user-read-recently-played` - Lire l'historique

## 🐛 Dépannage

### Erreurs Communes

1. **Token expiré** : L'application gère automatiquement le rafraîchissement des tokens
2. **Erreur de redirection** : Vérifiez que les URLs sont correctement configurées dans Spotify Dashboard
3. **Permissions manquantes** : Assurez-vous que tous les scopes sont approuvés

### Logs de Débogage

- Backend : Consultez la console du serveur Next.js
- Mobile : Utilisez React Native Debugger ou les logs Expo

## 📝 Notes Importantes

- **Environnement de développement** : Les URLs localhost ne fonctionnent que pour le développement
- **Production** : Vous devrez mettre à jour les URLs de redirection pour votre domaine de production
- **Sécurité** : Ne jamais exposer votre `SPOTIFY_CLIENT_SECRET` côté client

## 🔄 Prochaines Étapes

1. **Tester l'authentification** sur les deux plateformes
2. **Implémenter des fonctionnalités avancées** (création de playlists, etc.)
3. **Optimiser l'UI/UX** de l'application mobile
4. **Ajouter la gestion d'erreurs** plus robuste
5. **Préparer pour la production** avec les bonnes URLs 