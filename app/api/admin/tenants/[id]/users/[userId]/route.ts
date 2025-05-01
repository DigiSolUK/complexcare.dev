import { NextResponse } from "next/server"
import { removeUserFromTenant } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Remove user from tenant (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string; userId: string } }) {
  try {
    const { id, userId } = params

    // Get current user ID
    const currentUserId = await getCurrentUserId()

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to remove users from tenants
    await requirePermission(PERMISSIONS.TENANT_USER_DELETE, "system")

    // Remove user from tenant
    const success = await removeUserFromTenant(id, userId)

    if (!success) {
      return NextResponse.json({ error: "User not found in tenant" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error removing user ${params.userId} from tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to remove user from tenant" }, { status: 500 })
  }
}
