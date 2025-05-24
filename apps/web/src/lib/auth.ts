import { AuthOptions, User as NextAuthUser } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@cineverse/db/generated/client";

// Créer une instance Prisma locale
const prisma = new PrismaClient({
  log: ['error'],
});

// Fonction pour obtenir l'URL de base
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return 'http://localhost:3000';
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "user-read-email",
            "user-read-private", 
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "user-library-read",
            "user-library-modify",
            "playlist-read-private",
            "playlist-modify-public", 
            "playlist-modify-private",
            "user-top-read",
            "user-read-recently-played"
          ].join(" ")
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, account }) {
      // Sauvegarder les tokens Spotify
      if (account && account.provider === "spotify") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      return token;
    },
    async session({ session, token, user }) {
      // Ajouter l'ID utilisateur à la session
      if (user) {
        session.user.id = user.id;
      }
      
      // Ajouter les tokens Spotify à la session si disponibles
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Utiliser l'URL de base dynamique
      const dynamicBaseUrl = getBaseUrl();
      
      // Gérer la redirection pour l'app mobile
      if (url.includes('/api/auth/mobile-callback')) {
        // Rediriger vers notre endpoint mobile après que NextAuth ait créé la session
        return `${dynamicBaseUrl}/api/auth/mobile-callback`;
      }
      
      // Redirection par défaut
      if (url.startsWith("/")) return `${dynamicBaseUrl}${url}`;
      if (new URL(url).origin === dynamicBaseUrl) return url;
      return dynamicBaseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 