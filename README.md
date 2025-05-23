# 🚀 Boilerplate Next.js + React Native + Prisma + NextAuth

Un boilerplate moderne et complet pour développer rapidement des applications web et mobile avec les meilleures technologies.

## 🛠️ Stack Technologique

- **Frontend Web**: Next.js 15, React 18, TailwindCSS
- **Mobile**: React Native avec Expo
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js (Email, OAuth, Credentials)
- **Monorepo**: Turborepo avec pnpm workspaces
- **TypeScript**: Support complet
- **UI**: Composants partagés entre web et mobile

## 📋 Prérequis

- Node.js 18+ 
- pnpm 8+
- PostgreSQL (Laragon, Docker, ou service cloud)
- Git

## 🚀 Démarrage Rapide

### 1. Cloner et installer
```bash
git clone <votre-repo>
cd <nom-du-projet>
pnpm install
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos valeurs
# Minimum requis : DATABASE_URL et NEXTAUTH_SECRET
```

### 3. Configuration de la base de données
```bash
# Générer le client Prisma
pnpm run db:generate

# Créer et synchroniser la base de données
pnpm run db:push

# (Optionnel) Visualiser avec Prisma Studio
pnpm run db:studio
```

### 4. Lancer le projet
```bash
# Tous les services
pnpm dev

# Ou individuellement
cd apps/web && pnpm dev     # Application web
cd apps/mobile && pnpm dev  # Application mobile
```

## 📁 Structure du Projet

```
votre-projet/
├── apps/
│   ├── web/                 # Application Next.js
│   │   ├── src/
│   │   │   ├── app/         # App Router Next.js 15
│   │   │   │   └── components/  # Composants React
│   │   │   └── lib/         # Utilitaires et config
│   │   └── package.json
│   └── mobile/              # Application React Native
│       ├── App.tsx
│       ├── assets/
│       └── package.json
├── packages/
│   ├── db/                  # Configuration Prisma
│   ├── ui/                  # Composants UI partagés
│   ├── types/               # Types TypeScript partagés
│   └── utils/               # Utilitaires partagés
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── migrations/          # Migrations
├── .env.example             # Variables d'environnement
└── package.json             # Scripts du monorepo
```

## 🗄️ Base de Données

### Modèles Prisma Inclus
- **User** : Gestion des utilisateurs
- **Account** : Comptes OAuth liés
- **Session** : Sessions utilisateur
- **VerificationToken** : Tokens de vérification email

### Commandes Utiles
```bash
# Développement
pnpm run db:generate    # Générer le client Prisma
pnpm run db:push        # Synchroniser le schéma
pnpm run db:studio      # Interface visuelle

# Migrations (production)
pnpm run db:migrate     # Créer une migration
pnpm run db:reset       # Réinitialiser (dev uniquement)
```

## 🔐 Authentification NextAuth

### Providers Configurés
- ✅ **Email Magic Link** : Connexion sans mot de passe
- ✅ **Credentials** : Email/mot de passe avec bcrypt
- 🔧 **OAuth** : Google, GitHub, Discord (à configurer)

### Pages d'Auth Incluses
- `/auth/signin` : Connexion
- `/auth/register` : Inscription
- `/auth/verify-request` : Vérification email

### Configuration OAuth (Optionnel)
Décommentez dans `.env` et configurez vos providers :
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📱 Application Mobile

L'app mobile utilise Expo pour un développement simplifié :

```bash
cd apps/mobile
pnpm dev

# Ou avec Expo CLI
npx expo start
```

### Fonctionnalités Mobile
- Navigation configurée
- Authentification partagée
- Composants UI réutilisables
- Hot reload

## 🎨 Interface Utilisateur

### Web (TailwindCSS)
- Design system cohérent
- Composants réutilisables
- Responsive design
- Dark mode ready

### Mobile (React Native)
- Composants natifs
- Navigation fluide
- Performances optimisées

## 🚀 Déploiement

### Web (Vercel - Recommandé)
1. Connectez votre repo à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Base de Données (Production)
- **Supabase** : PostgreSQL gratuit avec interface
- **Railway** : Déploiement simple
- **PlanetScale** : MySQL serverless
- **Neon** : PostgreSQL serverless

### Mobile
- **Expo EAS** : Build et distribution
- **App Store / Play Store** : Publication

## 🧪 Scripts Disponibles

```bash
# Développement
pnpm dev              # Tous les services
pnpm build            # Build de production
pnpm lint             # Linter
pnpm format           # Formatage du code

# Base de données
pnpm run db:generate  # Générer le client
pnpm run db:push      # Synchroniser
pnpm run db:migrate   # Créer migration
pnpm run db:studio    # Interface visuelle
pnpm run db:seed      # Données de test

# Nettoyage
pnpm clean            # Nettoyer les builds
```

## 🔧 Personnalisation

### 1. Renommer le Projet
- Modifiez `name` dans tous les `package.json`
- Mettez à jour les imports `@cineverse/*`
- Changez le nom de la base de données

### 2. Ajouter des Modèles Prisma
```prisma
model YourModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

### 3. Configurer l'Email
- Configurez un service SMTP (Gmail, SendGrid)
- Mettez à jour `EMAIL_SERVER` et `EMAIL_FROM`

## 📚 Documentation

- [Next.js](https://nextjs.org/docs) - Framework React
- [Prisma](https://www.prisma.io/docs) - ORM TypeScript
- [NextAuth.js](https://next-auth.js.org) - Authentification
- [React Native](https://reactnative.dev) - Mobile
- [Expo](https://docs.expo.dev) - Outils mobile
- [Turborepo](https://turbo.build/repo/docs) - Monorepo

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - Voir le fichier `LICENSE`

---

## 🎯 Prochaines Étapes

Après avoir cloné ce boilerplate :

1. **Personnalisez** : Changez les noms, couleurs, et branding
2. **Configurez** : Base de données, authentification, email
3. **Développez** : Ajoutez vos fonctionnalités métier
4. **Déployez** : Web sur Vercel, mobile sur stores

**Happy coding! 🚀** 