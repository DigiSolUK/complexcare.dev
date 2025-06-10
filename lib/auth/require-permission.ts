import { hasPermission } from "./auth-utils"
import type { Permission } from "./permissions"

class NotAuthorizedError extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message)
    this.name = "NotAuthorizedError"
  }
}

export async function requirePermission(permission: Permission): Promise<void> {
  const userHasPermission = await hasPermission(permission)
  if (!userHasPermission) {
    throw new NotAuthorizedError()
  }
}
