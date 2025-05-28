import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
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
    async session({ session }) {
      // Add roles to session for public mode
      if (session?.user) {
        session.user.id = "public-user"
        session.user.roles = ["admin", "user"]
      }
      return session
    },
    async jwt({ token }) {
      // Add roles to token
      token.roles = ["admin", "user"]
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
})

export { handler as GET, handler as POST }
