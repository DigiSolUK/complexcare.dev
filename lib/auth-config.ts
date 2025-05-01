// Auth0 configuration
export const auth0Config = {
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  secret: process.env.AUTH0_SECRET,
}

// NextAuth configuration
export const nextAuthConfig = {
  secret: process.env.JWT_SECRET || process.env.AUTH0_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
}

// Export authOptions for use in API routes
export const authOptions = {
  ...nextAuthConfig,
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
      session.user.auth0Id = token.auth0Id
      return session
    },
  },
  secret: auth0Config.secret,
}
