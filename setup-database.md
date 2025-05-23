# Configuration de la base de données PostgreSQL avec Laragon

## Étapes pour configurer PostgreSQL dans Laragon

### 1. Activer PostgreSQL dans Laragon
1. Ouvrez Laragon
2. Cliquez sur "Menu" → "PostgreSQL" → "Installer" (si pas déjà installé)
3. Démarrez PostgreSQL depuis le menu Laragon

### 2. Créer la base de données
1. Ouvrez pgAdmin (inclus avec Laragon) ou utilisez la ligne de commande
2. Connectez-vous avec :
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: (vide par défaut dans Laragon)

### 3. Créer la base de données via pgAdmin
```sql
CREATE DATABASE custom_spotify_db;
```

### 4. Ou via la ligne de commande
```bash
# Ouvrez un terminal et exécutez :
createdb -U postgres custom_spotify_db
```

### 5. Vérifier la configuration
Votre URL de base de données dans le fichier `.env` devrait être :
```
DATABASE_URL="postgresql://postgres:@localhost:5432/custom_spotify_db?schema=public"
```

### 6. Exécuter les migrations Prisma
```bash
# Générer le client Prisma
pnpm db:generate

# Appliquer les migrations
pnpm db:push
```

## Commandes utiles

### Réinitialiser la base de données
```bash
pnpm db:reset
```

### Ouvrir Prisma Studio
```bash
pnpm db:studio
```

### Créer une nouvelle migration
```bash
pnpm db:migrate
```

## Dépannage

### Si PostgreSQL ne démarre pas
1. Vérifiez que le port 5432 n'est pas utilisé par un autre service
2. Redémarrez Laragon en tant qu'administrateur
3. Vérifiez les logs dans Laragon

### Si la connexion échoue
1. Vérifiez que PostgreSQL est bien démarré dans Laragon
2. Vérifiez l'URL de la base de données dans `.env`
3. Assurez-vous que la base de données `custom_spotify_db` existe 