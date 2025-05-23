import { AuthOptions, User as NextAuthUser } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@cineverse/db/generated/client";
import type { User as PrismaUserType } from "@cineverse/db/generated/client";
import bcrypt from 'bcryptjs';
import { JWT } from "next-auth/jwt";

// Créer une instance Prisma locale
const prisma = new PrismaClient({
  log: ['error'],
});

// Define a type for our user object that includes id
interface UserWithId extends NextAuthUser {
  id: string;
}

export const authOptions: AuthOptions = {
  // Retirer l'adaptateur Prisma pour éviter les conflits avec JWT + Credentials
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<UserWithId | null> {
        console.log('🔍 NextAuth Credentials - Début autorisation');
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credentials manquantes');
          return null;
        }

        console.log('🔍 Recherche utilisateur:', credentials.email);
        const userFromDb = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userFromDb) {
          console.log('❌ Utilisateur non trouvé');
          return null;
        }
        
        console.log('✅ Utilisateur trouvé:', userFromDb.id);
        
        // Assert the type for hashedPassword and image if TypeScript is not inferring them
        const user = userFromDb as PrismaUserType;

        if (!user.hashedPassword) { // Check for existence of hashedPassword
          console.log('❌ Pas de mot de passe hashé');
          return null;
        }

        console.log('🔐 Vérification mot de passe...');
        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword as string);

        if (!isValidPassword) {
          console.log('❌ Mot de passe incorrect');
          return null;
        }

        console.log('✅ Authentification réussie');
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image as string | null,
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      // The user object passed here is the one returned by the authorize callback
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 