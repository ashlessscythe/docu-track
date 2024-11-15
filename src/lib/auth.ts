import {
  NextAuthOptions,
  Session,
  User as NextAuthUser,
  DefaultSession,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { User, UserRole } from "@prisma/client";

// Extend the built-in session types
interface ExtendedSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role: UserRole;
  };
  error?: "RefetchUser";
}

// Extend the JWT type
interface ExtendedJWT extends JWT {
  id: string;
  role: UserRole;
  updatedAt: number;
  error?: "RefetchUser";
}

// Extend the User type
interface ExtendedUser extends NextAuthUser {
  id: string;
  role: UserRole;
  updatedAt: number;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          updatedAt: user.updatedAt.getTime(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "update") {
        // Fetch the latest user data on update
        const latestUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (!latestUser) {
          // User was deleted, return minimal JWT to force re-auth
          return { ...token, error: "RefetchUser" } as JWT;
        }

        return {
          ...token,
          role: latestUser.role,
          updatedAt: latestUser.updatedAt.getTime(),
        } as JWT;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as ExtendedUser).role,
          updatedAt: (user as ExtendedUser).updatedAt,
        } as JWT;
      }

      // Check if user still exists and hasn't been modified
      const existingUser = await prisma.user.findUnique({
        where: { id: token.id },
      });

      if (
        !existingUser ||
        existingUser.updatedAt.getTime() !== (token as ExtendedJWT).updatedAt
      ) {
        // User was deleted or modified, return minimal JWT to force re-auth
        return { ...token, error: "RefetchUser" } as JWT;
      }

      return token as JWT;
    },
    async session({ session, token }) {
      // If token has error, return minimal session to force re-auth
      if ((token as ExtendedJWT).error === "RefetchUser") {
        return {
          ...session,
          error: "RefetchUser",
        } as ExtendedSession;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: (token as ExtendedJWT).role,
        },
      } as ExtendedSession;
    },
  },
  events: {
    async signOut({ token }) {
      // Perform any cleanup needed on signout
    },
  },
};

// Add middleware to check session error and redirect to sign in
export async function sessionHasError(
  session: Session | null
): Promise<boolean> {
  if (!session || (session as ExtendedSession).error === "RefetchUser") {
    return true;
  }
  return false;
}
