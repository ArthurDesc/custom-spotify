import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Headers CORS pour permettre les requêtes depuis l'app mobile
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { code, redirectUri } = await request.json();

    console.log('🔍 Token exchange request:', { code: code?.substring(0, 20) + '...', redirectUri });

    if (!code) {
      return NextResponse.json({ error: 'Code manquant' }, { status: 400, headers });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Configuration Spotify manquante');
      return NextResponse.json({ error: 'Configuration Spotify manquante' }, { status: 500, headers });
    }

    console.log('🔍 Échange de token avec Spotify...');

    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('❌ Spotify token error:', errorData);
      return NextResponse.json({ 
        error: 'Échec de l\'échange de token',
        details: errorData 
      }, { status: 400, headers });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token échangé avec succès');
    
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    }, { headers });

  } catch (error) {
    console.error('❌ Erreur token exchange:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500, headers });
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 