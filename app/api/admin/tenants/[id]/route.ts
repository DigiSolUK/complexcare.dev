import { NextResponse } from "next/server"
import { getTenantById, updateTenant, deleteTenant } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Get tenant by ID (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view tenants
    await requirePermission(PERMISSIONS.TENANT_VIEW, "system")

    // Get tenant by ID
    const tenant = await getTenantById(id)

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error(`Error fetching tenant with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch tenant" }, { status: 500 })
  }
}

// Update tenant (admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to update tenants
    await requirePermission(PERMISSIONS.TENANT_UPDATE, "system")

    // Get request body
    const tenantData = await request.json()

    // Update tenant
    const tenant = await updateTenant(id, tenantData)

    return NextResponse.json(tenant)
  } catch (error) {
    console.error(`Error updating tenant with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 })
  }
}

// Delete tenant (admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to delete tenants
    await requirePermission(PERMISSIONS.TENANT_DELETE, "system")

    // Delete tenant
    const success = await deleteTenant(id)

    if (!success) {
      return NextResponse.json({ error: "Tenant not found or already deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting tenant with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete tenant" }, { status: 500 })
  }
}
