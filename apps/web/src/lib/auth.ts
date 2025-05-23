import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, User as NextAuthUser } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@cineverse/db";
import type { User as PrismaUserType } from "@cineverse/db/generated/client";
import bcrypt from 'bcryptjs';
import { JWT } from "next-auth/jwt";

// Define a type for our user object that includes id
interface UserWithId extends NextAuthUser {
  id: string;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<UserWithId | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userFromDb = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userFromDb) {
          return null;
        }
        
        // Assert the type for hashedPassword and image if TypeScript is not inferring them
        const user = userFromDb as PrismaUserType;

        if (!user.hashedPassword) { // Check for existence of hashedPassword
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword as string);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image as string | null, // Assert type for image
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout', // Uncomment if you create a custom signout page
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // The user object passed here is the one returned by the authorize callback or from adapter
      if (user) {
        token.id = user.id; // user.id is available due to UserWithId and our type augmentations
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) { // Ensure token.id exists
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 