import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Add credentials provider for public mode
    CredentialsProvider({
      name: "Public Access",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "public" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // In public mode, always return a user
        return {
          id: "public-user",
          name: "Public User",
          email: "public@example.com",
          image: "/abstract-geometric-shapes.png",
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      // Add roles to session for public mode
      if (session?.user) {
        session.user.roles = ["admin", "user"]
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ account, profile }) {
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }
