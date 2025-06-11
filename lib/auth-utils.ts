import { UserRole, PERMISSIONS } from "@/lib/auth/permissions"
import { getServerSession } from "@/lib/auth/stack-auth-server" // Use Stack Auth's getServerSession

export async function getCurrentUser() {
  const session = await getServerSession() // Call getServerSession without request object if it's a server component/action
  return session?.user || null
}

// Re-export existing types/constants if needed
export { UserRole, PERMISSIONS }
