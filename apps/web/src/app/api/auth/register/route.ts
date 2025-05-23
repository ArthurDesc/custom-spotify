import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@cineverse/db/generated/client';

// Créer une instance Prisma locale pour éviter les problèmes d'import
const prisma = new PrismaClient({
  log: ['error'],
});

export async function POST(request: Request) {
  try {
    console.log('🔍 API Register - Début');
    
    const { name, email, password } = await request.json();
    console.log('📝 Données reçues:', { name, email, password: '***' });

    if (!name || !email || !password) {
      console.log('❌ Données manquantes');
      return NextResponse.json({ message: 'Missing name, email, or password' }, { status: 400 });
    }

    console.log('🔗 Test connexion base de données...');
    await prisma.$connect();
    console.log('✅ Connexion réussie');

    console.log('🔍 Vérification utilisateur existant...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Utilisateur existe déjà');
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    console.log('🔐 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Création de l\'utilisateur...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    console.log('✅ Utilisateur créé:', user.id);
    await prisma.$disconnect();

    return NextResponse.json({ 
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email }
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 