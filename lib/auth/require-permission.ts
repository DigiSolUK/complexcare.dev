import type { Permission } from "./permissions"

export async function requirePermission(
  permission: Permission,
  tenantId: string,
  redirectTo = "/unauthorized",
): Promise<void> {
  // Always grant permission in development mode
  return
}
