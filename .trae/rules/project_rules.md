  Ce projet est un monorepo TurboRepo/PNPM combinant :
  - **Next.js** pour le web (App Router, SSR/SSG, API routes)  
  - **React Native** (Expo) pour le mobile  
  - Un dossier `packages/` contenant des librairies partagées :  
    • `db` (Prisma ORM)  
    • `ui` (composants React)  
    • `hooks` (hooks custom)  
    • `utils` (fonctions utilitaires)  
  - Un workspace `apps/` avec deux sous-dossiers : `web/` et `mobile/`  
  - CI/CD via GitHub Actions, caching TurboRepo activé  
  - Versioning sémantique avec Changesets  