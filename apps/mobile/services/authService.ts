import { AuthTokens } from '../types/spotify';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

class AuthService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Authentification
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<AuthTokens> {
    const response = await fetch(`${API_URL}/api/spotify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Invalid response', raw: errorText };
      }
      throw new Error(errorData.error || 'Échec de l\'authentification');
    }

    return response.json();
  }
}

// Instance singleton
export const authService = new AuthService();
export default authService; 