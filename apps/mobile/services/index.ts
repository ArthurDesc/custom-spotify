// Export de tous les services Spotify
export { authService } from './authService';
export { playerService } from './playerService';
export { deviceService } from './deviceService';
export { profileService } from './profileService';
export { searchService } from './searchService';
export { playlistService } from './playlistService';

// Export par défaut pour la compatibilité avec l'ancien spotifyService
export { authService as default } from './authService'; 