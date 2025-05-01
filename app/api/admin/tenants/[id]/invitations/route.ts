import { NextResponse } from "next/server"
import { getTenantInvitations, createTenantInvitation } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Get tenant invitations (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view tenant invitations
    await requirePermission(PERMISSIONS.TENANT_USER_VIEW, "system")

    // Get tenant invitations
    const invitations = await getTenantInvitations(id)

    return NextResponse.json(invitations)
  } catch (error) {
    console.error(`Error fetching invitations for tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch tenant invitations" }, { status: 500 })
  }
}

// Create a new invitation (admin only)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create tenant invitations
    await requirePermission(PERMISSIONS.TENANT_USER_CREATE, "system")

    // Get request body
    const { email, role } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create invitation
    const invitation = await createTenantInvitation(id, email, role || "user")

    // TODO: Send invitation email

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error(`Error creating invitation for tenant ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}
