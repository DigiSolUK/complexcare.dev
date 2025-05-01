import { NextResponse } from "next/server"
import { getTenantUsers, addUserToTenant, createTenantInvitation } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Get tenant users (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view tenant users
    await requirePermission(PERMISSIONS.TENANT_USER_VIEW, "system")

    // Get tenant users
    const users = await getTenantUsers(id)

    return NextResponse.json(users)
  } catch (error) {
    console.error(`Error fetching users for tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch tenant users" }, { status: 500 })
  }
}

// Add user to tenant or invite a new user (admin only)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to add users to tenants
    await requirePermission(PERMISSIONS.TENANT_USER_CREATE, "system")

    // Get request body
    const { email, role, existingUserId } = await request.json()

    if (!email && !existingUserId) {
      return NextResponse.json({ error: "Either email or existingUserId is required" }, { status: 400 })
    }

    // If existingUserId is provided, add the user directly
    if (existingUserId) {
      const tenantUser = await addUserToTenant(id, existingUserId, role || "user")
      return NextResponse.json(tenantUser, { status: 201 })
    }

    // Otherwise, create an invitation
    const invitation = await createTenantInvitation(id, email, role || "user")

    // TODO: Send invitation email

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error(`Error adding user to tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to add user to tenant" }, { status: 500 })
  }
}
