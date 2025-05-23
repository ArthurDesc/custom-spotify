# Custom Spotify - Monorepo Boilerplate

Un boilerplate moderne pour applications web et mobile avec Next.js, React Native, Prisma et NextAuth.

## 🚀 Technologies

- **Frontend Web**: Next.js 15, React 18, TailwindCSS
- **Mobile**: React Native avec Expo
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **Monorepo**: Turborepo avec pnpm
- **TypeScript**: Support complet

## 📋 Prérequis

- Node.js 18+ 
- pnpm 8+
- PostgreSQL (via Laragon ou installation locale)
- Git

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd custom-spotify
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env` et configurez vos variables :

```bash
cp .env.example .env
```

**Variables importantes à configurer :**

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:@localhost:5432/custom_spotify_db?schema=public"

# NextAuth.js (déjà configuré avec un secret sécurisé)
NEXTAUTH_SECRET="0R+Sma0TfG1S+dyOGQMvxqix7tDjDAN0mg6cPPVe9zw="
NEXTAUTH_URL="http://localhost:3000"

# Email (optionnel pour l'authentification par email)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@example.com"
```

### 4. Configuration de PostgreSQL avec Laragon

1. Ouvrez Laragon
2. Démarrez PostgreSQL depuis le menu
3. La base de données sera créée automatiquement lors de la première migration

### 5. Configuration de la base de données

```bash
# Générer le client Prisma
pnpm run db:generate

# Créer et synchroniser la base de données
npx prisma db push

# (Optionnel) Lancer Prisma Studio pour visualiser les données
npx prisma studio
```

## 🚀 Démarrage

### Développement complet (tous les services)
```bash
pnpm dev
```

### Applications individuelles

**Web (Next.js)**
```bash
cd apps/web
pnpm dev
```

**Mobile (React Native)**
```bash
cd apps/mobile
pnpm dev
```

## 📁 Structure du projet

```
custom-spotify/
├── apps/
│   ├── web/                 # Application Next.js
│   └── mobile/              # Application React Native
├── packages/
│   ├── db/                  # Configuration Prisma
│   ├── ui/                  # Composants UI partagés
│   ├── types/               # Types TypeScript partagés
│   └── utils/               # Utilitaires partagés
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── migrations/          # Migrations
└── .env                     # Variables d'environnement
```

## 🗄️ Base de données

### Commandes utiles

```bash
# Générer le client Prisma
pnpm run db:generate

# Appliquer les changements de schéma
npx prisma db push

# Créer une migration
npx prisma migrate dev

# Réinitialiser la base de données
npx prisma migrate reset

# Ouvrir Prisma Studio
npx prisma studio

# Seeder la base de données
pnpm run db:seed
```

### Modèles disponibles

- **User** : Utilisateurs de l'application
- **Account** : Comptes liés (OAuth)
- **Session** : Sessions utilisateur
- **VerificationToken** : Tokens de vérification
- **Test** : Modèle de test

## 🔐 Authentification

Le projet utilise NextAuth.js avec support pour :

- **Email Magic Link** : Connexion par lien email
- **Credentials** : Connexion par email/mot de passe
- **OAuth** : Prêt pour Google, GitHub, etc.

### Pages d'authentification

- `/auth/signin` : Page de connexion
- `/auth/register` : Page d'inscription
- `/auth/verify-request` : Vérification email

## 🧪 Tests et Qualité

```bash
# Linter
pnpm lint

# Tests
pnpm test

# Formatage du code
pnpm format

# Build de production
pnpm build
```

## 📱 Mobile (React Native)

L'application mobile utilise Expo pour un développement simplifié :

```bash
cd apps/mobile
pnpm dev
```

## 🚀 Déploiement

### Web (Vercel recommandé)

1. Connectez votre repo à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Base de données (Production)

Configurez `DATABASE_URL` avec votre base PostgreSQL de production (Supabase, Railway, etc.)

## 🔧 Dépannage

### Problèmes courants

**Erreur de connexion à la base de données :**
- Vérifiez que PostgreSQL est démarré dans Laragon
- Vérifiez l'URL de connexion dans `.env`
- Assurez-vous que la base de données existe

**Erreur NextAuth JWT :**
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Régénérez un nouveau secret si nécessaire

**Erreur Prisma Client :**
```bash
pnpm run db:generate
```

### Logs et debugging

- Prisma Studio : `npx prisma studio`
- Logs Next.js : Consultez la console du navigateur
- Logs serveur : Terminal où vous avez lancé `pnpm dev`

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Turborepo](https://turbo.build/repo/docs)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.