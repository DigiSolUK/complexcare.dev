import { NextResponse } from "next/server"
import { updateUserRole } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Update user role in tenant (admin only)
export async function PATCH(request: Request, { params }: { params: { id: string; userId: string } }) {
  try {
    const { id, userId } = params

    // Get current user ID
    const currentUserId = await getCurrentUserId()

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to update user roles
    await requirePermission(PERMISSIONS.TENANT_USER_UPDATE, "system")

    // Get request body
    const { role } = await request.json()

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["admin", "manager", "user"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const tenantUser = await updateUserRole(id, userId, role)

    return NextResponse.json(tenantUser)
  } catch (error) {
    console.error(`Error updating role for user ${params.userId} in tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
