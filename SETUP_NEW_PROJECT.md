# 🚀 Guide de Configuration - Nouveau Projet

Ce guide vous aide à transformer ce boilerplate en votre nouveau projet.

## ✅ Checklist de Configuration

### 1. 📝 Renommer le Projet

#### Package.json Principal
```json
{
  "name": "votre-nouveau-projet",
  "description": "Description de votre projet"
}
```

#### Apps/Web/package.json
```json
{
  "name": "@votre-projet/web"
}
```

#### Apps/Mobile/package.json
```json
{
  "name": "@votre-projet/mobile"
}
```

#### Packages (db, ui, types, utils)
```json
{
  "name": "@votre-projet/db"
}
```

### 2. 🗄️ Configuration Base de Données

#### Copier et configurer .env
```bash
cp .env.example .env
```

#### Modifier DATABASE_URL
```env
# Remplacez 'your_database_name' par le nom de votre projet
DATABASE_URL="postgresql://postgres:@localhost:5432/votre_projet_db?schema=public"
```

#### Générer un nouveau secret NextAuth
```bash
# Méthode 1 : OpenSSL
openssl rand -base64 32

# Méthode 2 : En ligne
# Visitez : https://generate-secret.vercel.app/32
```

### 3. 🔧 Mise à Jour des Imports

#### Rechercher et remplacer dans tout le projet
```bash
# Remplacez @cineverse par @votre-projet
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/@cineverse/@votre-projet/g'
```

#### Ou manuellement dans ces fichiers :
- `apps/web/src/**/*.{ts,tsx}`
- `apps/mobile/**/*.{ts,tsx}`
- `packages/**/*.{ts,tsx}`

### 4. 📱 Configuration Mobile (Expo)

#### apps/mobile/app.json
```json
{
  "expo": {
    "name": "Votre App",
    "slug": "votre-app",
    "scheme": "votre-app"
  }
}
```

### 5. 🎨 Personnalisation UI

#### Couleurs et Thème
- `apps/web/tailwind.config.js` : Couleurs TailwindCSS
- `packages/ui/` : Composants partagés
- `apps/mobile/` : Styles React Native

#### Logo et Assets
- `apps/web/public/` : Favicon, logos web
- `apps/mobile/assets/` : Icons, splash screens

### 6. 🔐 Configuration Authentification

#### Providers OAuth (Optionnel)
1. **Google** : [Console Google Cloud](https://console.cloud.google.com)
2. **GitHub** : [GitHub Apps](https://github.com/settings/applications/new)
3. **Discord** : [Discord Developer Portal](https://discord.com/developers/applications)

#### Configuration Email (Optionnel)
- **Gmail** : App passwords
- **SendGrid** : API key
- **Mailgun** : Domain et API key

### 7. 📊 Base de Données

#### Initialiser la base
```bash
pnpm run db:generate
pnpm run db:push
```

#### Ajouter vos modèles
Éditez `prisma/schema.prisma` :
```prisma
model VotreModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 8. 🚀 Premier Démarrage

```bash
# Installer les dépendances
pnpm install

# Configurer la base de données
pnpm run db:generate
pnpm run db:push

# Démarrer le développement
pnpm dev
```

## 🔍 Vérifications Finales

### ✅ Checklist
- [ ] Tous les `package.json` renommés
- [ ] Imports `@cineverse` remplacés
- [ ] `.env` configuré avec vos valeurs
- [ ] Base de données connectée
- [ ] Application web démarre (`http://localhost:3000`)
- [ ] Application mobile démarre
- [ ] Authentification fonctionne

### 🧪 Tests
```bash
# Vérifier que tout compile
pnpm build

# Lancer les tests
pnpm test

# Vérifier le linting
pnpm lint
```

## 📝 Prochaines Étapes

1. **Développement** : Ajoutez vos fonctionnalités
2. **Design** : Personnalisez l'interface
3. **Déploiement** : Configurez Vercel/Expo
4. **Monitoring** : Ajoutez analytics et error tracking

## 🆘 Problèmes Courants

### Erreur d'import après renommage
```bash
# Nettoyer et réinstaller
pnpm clean
rm -rf node_modules
pnpm install
```

### Base de données non accessible
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez l'URL dans `.env`
3. Testez avec `pnpm run db:studio`

### Erreur NextAuth
1. Vérifiez `NEXTAUTH_SECRET`
2. Vérifiez `NEXTAUTH_URL`
3. Redémarrez le serveur

---

🎉 **Votre nouveau projet est prêt !** 