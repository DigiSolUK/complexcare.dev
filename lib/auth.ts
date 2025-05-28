import { executeQuery } from "@/lib/db"
import type { NextAuthOptions } from "next-auth"
import { getServerSession as nextAuthGetServerSession } from "next-auth"

// Session management - Server-side only
export async function getSession() {
  // In a real implementation, you would use getServerSession from next-auth
  return await getServerSession()
}

// Authentication
export async function signIn(email: string, password: string) {
  try {
    // Find user by email
    const users = await executeQuery(
      `
      SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL
    `,
      [email],
    )

    if (users.length === 0) {
      return { success: false, message: "Invalid email or password" }
    }

    const user = users[0]

    // In a real implementation, you would verify the password here
    // For now, we'll just return success
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, message: "An error occurred during sign in" }
  }
}

export async function signOut() {
  // In a real implementation, you would clear the session here
  return { success: true }
}

// Authorization
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return session
}

export async function requireRole(role: string | string[]) {
  const session = await getSession()

  if (!session) {
    return null
  }

  const roles = Array.isArray(role) ? role : [role]

  if (!session.user || !roles.includes(session.user.role)) {
    return null
  }

  return session
}

// Auth0 configuration
const auth0Config = {
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH0_SECRET,
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "auth0",
      name: "Auth0",
      type: "oauth",
      version: "2.0",
      clientId: auth0Config.clientId,
      clientSecret: auth0Config.clientSecret,
      issuer: auth0Config.issuer,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.auth0Id = profile.sub
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.auth0Id = token.auth0Id
      }
      return session
    },
  },
  secret: auth0Config.secret,
}

// Export a wrapper for getServerSession that uses our authOptions
export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions)
}
