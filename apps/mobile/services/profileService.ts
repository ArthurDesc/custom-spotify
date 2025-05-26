import { SpotifyProfile } from '../types/spotify';
import { authService } from './authService';

class ProfileService {
  // Profil utilisateur
  async getUserProfile(): Promise<SpotifyProfile> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
}

// Instance singleton
export const profileService = new ProfileService();
export default profileService; 