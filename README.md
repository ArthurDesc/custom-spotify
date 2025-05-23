# boilerplate Monorepo

Ce projet est un monorepo géré avec pnpm workspaces et Turborepo.

Le nom de la base de donnée est cineverse, il peut être changé

## Commandes utiles

### 1. Installation des dépendances

Pour installer toutes les dépendances du projet, exécutez la commande suivante à la racine du monorepo :

```bash
pnpm install
```

### 2. Lancer le serveur de développement (Application Web)

Pour démarrer le serveur de développement pour l'application web (et potentiellement d'autres applications configurées dans `turbo.json`), exécutez :

```bash
pnpm dev
```

Cette commande utilise Turborepo pour lancer les scripts `dev` définis dans les `package.json` des différents workspaces (par exemple, `apps/web`).

### 3. Lancer Prisma Studio

Prisma Studio est un outil visuel pour gérer votre base de données. Pour le lancer, assurez-vous que vos variables d'environnement de base de données sont correctement configurées (généralement dans un fichier `.env` à la racine ou dans `packages/db`).

Exécutez la commande suivante à la racine du monorepo :

```bash
pnpm prisma studio
```

Alternativement, si vous souhaitez cibler spécifiquement le package de base de données :

```bash
pnpm --filter @cineverse/db exec prisma studio
```

### 4. Autres commandes Turborepo

Le `package.json` à la racine définit d'autres scripts utiles orchestrés par Turborepo :

- **Build le projet :**
  ```bash
  pnpm build
  ```
- **Lancer les tests :**
  ```bash
  pnpm test
  ```
- **Linter le code :**
  ```bash
  pnpm lint
  ```
- **Formatter le code :**
  ```bash
  pnpm format
  ```
- **Nettoyer les artefacts de build :**
  ```bash
  pnpm clean
  ```

Consultez le fichier `turbo.json` et les `package.json` des workspaces individuels pour plus de détails sur la configuration des tâches.

### 5. Commandes pour le mobile
- **Lancdr le serveur mobile :**
  ```bash
    cd apps/mobile && npx expo start
  ```