import { UserRole, PERMISSIONS } from "@/lib/auth/permissions"
import { getServerSession } from "next-auth" // Assuming NextAuth is used for session management
import { authOptions } from "@/lib/auth" // Assuming you have authOptions defined here

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

// Re-export existing types/constants if needed
export { UserRole, PERMISSIONS }
