const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Trouver le répertoire racine du workspace
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Surveiller les fichiers dans le workspace entier
config.watchFolders = [workspaceRoot];

// 2. Permettre à Metro de résoudre les modules depuis le workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Résoudre les packages du monorepo
config.resolver.alias = {
  '@cineverse/db': path.resolve(workspaceRoot, 'packages/db'),
  '@cineverse/ui': path.resolve(workspaceRoot, 'packages/ui'),
  '@cineverse/hooks': path.resolve(workspaceRoot, 'packages/hooks'),
  '@cineverse/utils': path.resolve(workspaceRoot, 'packages/utils'),
  '@cineverse/types': path.resolve(workspaceRoot, 'packages/types'),
};

// 4. Éviter les duplicatas en excluant certains dossiers
config.resolver.blockList = [
  // Exclure les node_modules des packages pour éviter les duplicatas
  /.*\/packages\/.*\/node_modules\/.*/,
  // Exclure les builds
  /.*\/packages\/.*\/dist\/.*/,
  /.*\/packages\/.*\/build\/.*/,
];

// 5. Configuration pour éviter les conflits de cache
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// 6. S'assurer que le projectRoot est correct
config.projectRoot = projectRoot;

module.exports = config; 