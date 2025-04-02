import type { AuthOptions } from "next-auth"

// Demo mode auth utilities

export async function getCurrentUser() {
  // Return a demo user
  return {
    id: "demo-user-id",
    name: "Demo User",
    email: "demo@complexcare.dev",
    image: "",
    roles: ["user", "admin"],
  }
}

export async function isAuthenticated() {
  // Always authenticated in demo mode
  return true
}

export async function hasRole(role: string) {
  // Demo user has all roles
  return true
}

export async function getSession() {
  // Always return a demo session in demo mode
  return {
    user: await getCurrentUser(),
  }
}

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "auth0",
      name: "Auth0",
      type: "oauth",
      wellKnown: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid email profile" } },
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          roles: profile["https://complexcare.dev/roles"] || [],
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.roles = profile["https://complexcare.dev/roles"] || []
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.roles) {
        session.user.roles = token.roles as string[]
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// In demo mode, we'll use the existing functions

