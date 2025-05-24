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

    // Récupérer les playlists de l'utilisateur
    const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
      },
    });

    if (!playlistsResponse.ok) {
      throw new Error('Erreur lors de la récupération des playlists');
    }

    const playlists = await playlistsResponse.json();

    return NextResponse.json({
      success: true,
      playlists: playlists.items,
    });

  } catch (error) {
    console.error('Erreur API Spotify Playlists:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 