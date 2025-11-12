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
    departmentId?: string | null;
    siteId?: string | null;
  };
  error?: "RefetchUser";
}

// Extend the JWT type
interface ExtendedJWT extends JWT {
  id: string;
  role: UserRole;
  departmentId?: string | null;
  siteId?: string | null;
  updatedAt: number;
  error?: "RefetchUser";
  version?: number;
}

// Extend the User type
interface ExtendedUser extends NextAuthUser {
  id: string;
  role: UserRole;
  departmentId?: string | null;
  siteId?: string | null;
  updatedAt: number;
}

// Get JWT version from environment
const JWT_VERSION = process.env.JWT_VERSION
  ? parseInt(process.env.JWT_VERSION)
  : 1;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
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

        // Normalize email to lowercase for consistent lookup
        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
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

        // Set default site if not set
        let userWithSite = user;
        if (!user.siteId) {
          // Find or create default site
          const defaultSite =
            (await prisma.site.findFirst({
              where: { name: "default-site" },
            })) ||
            (await prisma.site.create({
              data: {
                name: "default-site",
                description: "Default site",
              },
            }));

          // Update user with default site
          userWithSite = await prisma.user.update({
            where: { id: user.id },
            data: { siteId: defaultSite.id },
          });
        }

        return {
          id: userWithSite.id,
          email: userWithSite.email,
          name: userWithSite.name,
          role: userWithSite.role,
          departmentId: userWithSite.departmentId,
          siteId: userWithSite.siteId,
          updatedAt: userWithSite.updatedAt.getTime(),
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
          departmentId: latestUser.departmentId,
          siteId: latestUser.siteId,
          updatedAt: latestUser.updatedAt.getTime(),
        } as JWT;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as ExtendedUser).role,
          departmentId: (user as ExtendedUser).departmentId,
          siteId: (user as ExtendedUser).siteId,
          updatedAt: (user as ExtendedUser).updatedAt,
          version: JWT_VERSION,
        } as JWT;
      }

      // Check if user still exists, hasn't been modified, and JWT version matches
      const existingUser = await prisma.user.findUnique({
        where: { id: token.id },
      });

      if (
        !existingUser ||
        existingUser.updatedAt.getTime() !== (token as ExtendedJWT).updatedAt ||
        (token as ExtendedJWT).version !== JWT_VERSION
      ) {
        // User was deleted, modified, or JWT version changed - force re-auth
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
          departmentId: (token as ExtendedJWT).departmentId,
          siteId: (token as ExtendedJWT).siteId,
        },
      } as ExtendedSession;
    },
    // Industry standard: Use default NextAuth redirect behavior
    // This validates against NEXTAUTH_URL to prevent open redirect vulnerabilities
    // For 127.0.0.1 vs localhost, handle redirect client-side after signout
    async redirect({ url, baseUrl }) {
      // Only allow relative URLs or URLs on the same origin as NEXTAUTH_URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Validate absolute URLs are on same origin
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === new URL(baseUrl).origin) {
          return url;
        }
      } catch {
        // Invalid URL
      }
      // Default to trusted baseUrl (NEXTAUTH_URL)
      return baseUrl;
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
