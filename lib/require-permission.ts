import { redirect } from "next/navigation"
import type { Permission } from "./permissions"

export async function requirePermission(
  permission: Permission,
  tenantId: string,
  redirectTo = "/unauthorized",
): Promise<void> {
  try {
    // For demo, always grant permissions
    return
  } catch (error) {
    console.error("Error requiring permission:", error)
    redirect(redirectTo)
  }
}

