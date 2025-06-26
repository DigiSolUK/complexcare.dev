// lib/auth.ts

// In demo mode, we're always "authenticated" with a mock session.
// In a real application, this would be your NextAuth.js configuration.

export async function getSession() {
  return {
    user: {
      id: "demo-user-1",
      name: "Demo Admin",
      email: "admin@complexcare.dev",
      roles: ["admin", "tenant_admin"], // Added tenant_admin role for broader demo permissions
      tenantId: "demo-tenant-1",
    },
  }
}

// This 'auth' export is typically provided by NextAuth.js.
// For demo mode, we provide a placeholder.
export const auth = {
  getSession,
  // Add other NextAuth.js related functions if needed by other parts of the app
  // e.g., signIn, signOut, etc.
}
