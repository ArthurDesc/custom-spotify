import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le profil utilisateur Spotify
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    const profile = await profileResponse.json();

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Erreur API Spotify Profile:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 