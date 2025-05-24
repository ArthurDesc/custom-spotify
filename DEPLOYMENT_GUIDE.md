# 🚀 Guide de Déploiement - Custom Spotify

## 🎯 **Pourquoi déployer en ligne ?**

- ✅ **URLs HTTPS stables** - Plus de problème de redirect URI
- ✅ **Accessible partout** - Pas de configuration réseau
- ✅ **Environnement de production** - Plus proche de la réalité
- ✅ **Partage facile** - Envoyez juste un lien

---

## 🚀 **Option 1 : Vercel (RECOMMANDÉE)**

### **Avantages :**
- ✅ **Gratuit** pour les projets personnels
- ✅ **Déploiement en 2 minutes**
- ✅ **HTTPS automatique**
- ✅ **Intégration Git**

### **Étapes :**

#### **1. Préparer le projet**
```bash
cd /c/laragon/www/custom-spotify
git add .
git commit -m "Préparation pour déploiement Vercel"
git push
```

#### **2. Déployer avec Vercel**
```bash
cd apps/web
vercel
```

Suivez les instructions :
- **Set up and deploy "apps/web"?** → `Y`
- **Which scope?** → Votre compte
- **Link to existing project?** → `N`
- **Project name** → `custom-spotify`
- **Directory** → `./` (par défaut)
- **Override settings?** → `N`

#### **3. Configurer les variables d'environnement**
```bash
# Ajouter les secrets Vercel
vercel env add NEXTAUTH_SECRET
# Coller: 0R+Sma0TfG1S+dyOGQMvxqix7tDjDAN0mg6cPPVe9zw=

vercel env add SPOTIFY_CLIENT_ID
# Coller: 9a090128ced9401aaf6b34a49054ed9e

vercel env add SPOTIFY_CLIENT_SECRET
# Coller: 3047c0f47f9747ad9caa21a3bba14b0e

vercel env add DATABASE_URL
# Coller votre URL de base de données (voir section DB ci-dessous)
```

#### **4. Redéployer avec les variables**
```bash
vercel --prod
```

---

## 🗄️ **Base de Données en Ligne**

### **Option A : Supabase (Gratuit)**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet
3. Récupérez l'URL PostgreSQL
4. Ajoutez-la dans Vercel : `vercel env add DATABASE_URL`

### **Option B : PlanetScale (Gratuit)**
1. Allez sur [planetscale.com](https://planetscale.com)
2. Créez une base MySQL
3. Récupérez l'URL de connexion
4. Ajoutez-la dans Vercel

### **Option C : Railway (Gratuit)**
1. Allez sur [railway.app](https://railway.app)
2. Créez une base PostgreSQL
3. Récupérez l'URL de connexion

---

## 📱 **Configuration Mobile**

Une fois déployé, vous obtiendrez une URL comme :
`https://custom-spotify-abc123.vercel.app`

### **Mettre à jour l'app mobile :**

```bash
# apps/mobile/.env
EXPO_PUBLIC_API_URL=https://custom-spotify-abc123.vercel.app
```

### **Publier l'app mobile :**
```bash
cd apps/mobile
npx expo publish
```

---

## 🎵 **Configuration Spotify Dashboard**

### **URLs à ajouter :**
```
https://custom-spotify-abc123.vercel.app/api/auth/callback/spotify
custom-spotify://auth
```

### **Website :**
```
https://custom-spotify-abc123.vercel.app
```

---

## 🌐 **Option 2 : Netlify**

```bash
npm install -g netlify-cli
cd apps/web
netlify deploy --prod
```

---

## 🔧 **Option 3 : Railway**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## ⚡ **Déploiement Express (5 minutes)**

### **Commandes rapides :**
```bash
# 1. Installer Vercel
npm install -g vercel

# 2. Aller dans le dossier web
cd apps/web

# 3. Déployer
vercel

# 4. Configurer les variables (suivre les prompts)
vercel env add NEXTAUTH_SECRET
vercel env add SPOTIFY_CLIENT_ID  
vercel env add SPOTIFY_CLIENT_SECRET
vercel env add DATABASE_URL

# 5. Redéployer en production
vercel --prod
```

---

## 🎯 **Résultat Final**

Après déploiement, vous aurez :
- ✅ **URL HTTPS stable** (ex: `https://custom-spotify.vercel.app`)
- ✅ **API accessible** depuis mobile
- ✅ **Authentification Spotify** fonctionnelle
- ✅ **Base de données en ligne**
- ✅ **App mobile** qui fonctionne partout

---

## 🆘 **Dépannage**

### **Erreur de build :**
```bash
# Vérifier que le build fonctionne localement
cd apps/web
pnpm build
```

### **Variables d'environnement manquantes :**
```bash
# Lister les variables
vercel env ls

# Ajouter une variable manquante
vercel env add VARIABLE_NAME
```

### **Base de données non accessible :**
- Vérifier l'URL de connexion
- Vérifier les permissions réseau
- Tester la connexion localement

---

## 🎉 **Avantages du Déploiement**

- **Fini les problèmes localhost** sur mobile
- **URLs HTTPS natives** pour Spotify
- **Environnement stable** pour développer
- **Partage facile** avec d'autres développeurs
- **Proche de la production** réelle

**Votre app sera accessible 24/7 depuis n'importe où ! 🌍** 