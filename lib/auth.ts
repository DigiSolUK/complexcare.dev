import type { NextAuthOptions } from "next-auth"
import * as CredentialsProviderModule from "next-auth/providers/credentials" // Changed import
import { DEFAULT_TENANT_ID } from "@/lib/tenant-utils"
import { isValidUUID } from "@/lib/db-utils"

const CredentialsProvider = CredentialsProviderModule.default // Access the default export

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.TEST_USERNAME &&
          credentials?.password === process.env.TEST_PASSWORD
        ) {
          // Ensure tenantId is a valid UUID, falling back if necessary
          const tenantId =
            process.env.DEFAULT_TENANT_ID && isValidUUID(process.env.DEFAULT_TENANT_ID)
              ? process.env.DEFAULT_TENANT_ID
              : DEFAULT_TENANT_ID

          return {
            id: "demo-user-1", // This should be a UUID in production
            name: "Demo User",
            email: "demo@example.com",
            tenantId: tenantId,
            role: "admin",
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.tenantId = token.tenantId as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Export `auth` for direct use in API routes and server components
export const auth = async () => {
  // Ensure tenantId is a valid UUID, falling back if necessary
  const tenantId =
    process.env.DEFAULT_TENANT_ID && isValidUUID(process.env.DEFAULT_TENANT_ID)
      ? process.env.DEFAULT_TENANT_ID
      : DEFAULT_TENANT_ID

  return {
    user: {
      id: "demo-user-1", // Should be a UUID
      name: "Demo User",
      email: "demo@example.com",
      tenantId: tenantId,
      role: "admin",
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  }
}

// Helper to get session on the server
export async function getSession() {
  return auth() // Calls the mock `auth` function
}
