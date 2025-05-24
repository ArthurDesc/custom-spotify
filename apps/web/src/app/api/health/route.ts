import { NextResponse } from 'next/server';

/**
 * Endpoint de santé pour valider la connectivité de l'API
 * Utilisé par l'app mobile pour détecter automatiquement l'environnement
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Service unavailable' 
      },
      { status: 503 }
    );
  }
} 