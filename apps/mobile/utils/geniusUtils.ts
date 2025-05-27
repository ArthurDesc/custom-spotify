/**
 * Utilitaires pour générer des URLs Genius à partir des données de tracks
 */

/**
 * Nettoie et formate une chaîne pour l'URL Genius
 * @param text - Le texte à nettoyer
 * @returns Le texte formaté pour l'URL
 */
export function formatForGeniusUrl(text: string): string {
  return text
    // Supprimer les caractères spéciaux et garder seulement lettres, chiffres, espaces et traits d'union
    .replace(/[^\w\s-]/g, '')
    // Remplacer les espaces multiples par un seul
    .replace(/\s+/g, ' ')
    // Supprimer les espaces en début/fin
    .trim()
    // Remplacer les espaces par des traits d'union
    .replace(/\s/g, '-')
    // Supprimer les traits d'union multiples
    .replace(/-+/g, '-')
    // Supprimer les traits d'union en début/fin
    .replace(/^-|-$/g, '')
    // Convertir en minuscules
    .toLowerCase();
}

/**
 * Génère l'URL Genius pour une chanson
 * @param artistName - Nom de l'artiste
 * @param trackName - Nom de la chanson
 * @returns L'URL Genius complète
 */
export function generateGeniusUrl(artistName: string, trackName: string): string {
  // Nettoyer le nom de l'artiste et le titre
  const cleanArtist = formatForGeniusUrl(artistName);
  const cleanTrack = formatForGeniusUrl(trackName);
  
  // Construire l'URL selon le format Genius
  // Format: https://genius.com/artist-song-title-lyrics
  return `https://genius.com/${cleanArtist}-${cleanTrack}-lyrics`;
}

/**
 * Valide si une URL Genius est potentiellement valide
 * @param url - L'URL à valider
 * @returns true si l'URL semble valide
 */
export function isValidGeniusUrl(url: string): boolean {
  const geniusUrlPattern = /^https:\/\/genius\.com\/[a-z0-9-]+-lyrics$/;
  return geniusUrlPattern.test(url);
}

/**
 * Extrait le nom de l'artiste et le titre depuis une URL Genius
 * @param url - L'URL Genius
 * @returns Un objet avec l'artiste et le titre, ou null si invalide
 */
export function parseGeniusUrl(url: string): { artist: string; track: string } | null {
  const match = url.match(/^https:\/\/genius\.com\/(.+)-lyrics$/);
  if (!match) return null;
  
  const parts = match[1].split('-');
  if (parts.length < 2) return null;
  
  // Tenter de séparer l'artiste du titre (pas parfait mais fonctionnel)
  // Pour une implémentation plus robuste, il faudrait une API ou plus de logique
  const midPoint = Math.floor(parts.length / 2);
  const artist = parts.slice(0, midPoint).join(' ');
  const track = parts.slice(midPoint).join(' ');
  
  return { artist, track };
} 