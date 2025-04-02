export const auth0Config = {
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
}

// NextAuth configuration
export const nextAuthConfig = {
  // Make sure this matches the NEXTAUTH_URL environment variable
  baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
}

