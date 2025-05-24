import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@cineverse/db/generated/client';

// Créer une instance Prisma locale
const prisma = new PrismaClient({
  log: ['error'],
});

export async function POST(request: Request) {
  try {
    console.log('🔍 API Login - Début');
    
    const { email, password } = await request.json();
    console.log('📝 Tentative de connexion pour:', email);

    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant');
      return NextResponse.json({ message: 'Email et mot de passe requis' }, { status: 400 });
    }

    console.log('🔗 Connexion à la base de données...');
    await prisma.$connect();

    console.log('🔍 Recherche de l\'utilisateur...');
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        hashedPassword: true,
      }
    });

        if (!user || !user.hashedPassword) {      console.log('❌ Utilisateur non trouvé ou pas de mot de passe');      await prisma.$disconnect();      return NextResponse.json({         message: 'Email ou mot de passe incorrect. Si vous n\'avez pas de compte, veuillez vous inscrire d\'abord.'       }, { status: 401 });    }

    console.log('🔐 Vérification du mot de passe...');
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      await prisma.$disconnect();
      return NextResponse.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    console.log('✅ Connexion réussie pour:', user.email);

    // Créer un token JWT simple pour l'app mobile
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    await prisma.$disconnect();

    return NextResponse.json({ 
      message: 'Connexion réussie',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      message: 'Erreur interne du serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 