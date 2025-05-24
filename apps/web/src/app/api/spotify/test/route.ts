import { NextRequest, NextResponse } from 'next/server';

// Route de test pour récupérer les données de base de l'utilisateur Spotify
export async function GET(request: NextRequest) {
  try {
    // Pour ce test, nous allons utiliser le Client Credentials Flow de Spotify
    // qui permet d'accéder aux données publiques sans authentification utilisateur
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Configuration Spotify manquante' },
        { status: 500 }
      );
    }

    // Obtenir un token d'accès avec Client Credentials Flow
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Erreur lors de l\'obtention du token Spotify');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Test avec une recherche d'artiste populaire
    const searchResponse = await fetch(
      'https://api.spotify.com/v1/search?q=artist:Daft%20Punk&type=artist&limit=1',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Erreur lors de la recherche Spotify');
    }

    const searchData = await searchResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Connexion à l\'API Spotify réussie !',
      data: {
        artist: searchData.artists?.items[0] || null,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Erreur API Spotify:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la connexion à l\'API Spotify',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 