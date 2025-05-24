import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  console.log('📱 Mobile callback appelé');
  
  try {
    // Attendre un peu pour que NextAuth termine le processus
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Récupérer la session NextAuth
    const session = await getServerSession(authOptions);
    
    console.log('🔍 Session récupérée:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      hasAccessToken: !!session?.accessToken
    });
    
    if (!session || !session.user) {
      console.log('❌ Aucune session trouvée');
      const errorUrl = `custom-spotify://auth?error=no_session`;
      return NextResponse.redirect(errorUrl);
    }

    // Préparer les données de session pour l'app mobile
    const sessionData = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    };

    // Encoder les données en base64 pour les passer dans l'URL
    const encodedSession = btoa(JSON.stringify(sessionData));
    
    // Rediriger vers l'app mobile avec les données de session
    const redirectUrl = `custom-spotify://auth?session=${encodedSession}`;
    
    console.log('✅ Redirection mobile avec session:', {
      userId: session.user.id,
      userName: session.user.name,
      hasAccessToken: !!session.accessToken,
      redirectUrl: redirectUrl.substring(0, 100) + '...'
    });
    
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('❌ Erreur dans mobile-callback:', error);
    
    // Rediriger vers l'app avec une erreur
    const errorUrl = `custom-spotify://auth?error=server_error&message=${encodeURIComponent((error as Error).message)}`;
    return NextResponse.redirect(errorUrl);
  }
} 