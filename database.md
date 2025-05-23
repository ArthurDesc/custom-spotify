# Commandes de Migration Prisma

Ce document liste les commandes Prisma CLI les plus courantes pour gérer les migrations de base de données dans ce projet.

Assurez-vous d'être à la racine du projet monorepo pour exécuter ces commandes via `pnpm`.

## Appliquer les migrations en développement

Utilisez cette commande pour créer de nouvelles migrations basées sur les changements dans `schema.prisma` et les appliquer à votre base de données de développement. Vous serez invité à nommer la migration.

```bash
pnpm prisma migrate dev
```

## Réinitialiser la base de données et appliquer les migrations

Cette commande supprime votre base de données, la recrée et exécute toutes les migrations depuis le début. **À utiliser avec prudence, cela efface toutes les données !** Utile pour recommencer à zéro en développement.

```bash
pnpm prisma migrate reset
```

## Appliquer les migrations en production/staging

Cette commande applique les migrations existantes qui n'ont pas encore été appliquées à la base de données cible. **Ne crée PAS de nouvelles migrations.**

```bash
pnpm prisma migrate deploy
```

## Générer le client Prisma

Si vous modifiez `schema.prisma` ou changez de version de Prisma, il est souvent nécessaire de régénérer le client Prisma. Ceci est généralement fait automatiquement par `prisma migrate dev`, mais peut être exécuté manuellement si nécessaire.

```bash
pnpm prisma generate
``` 