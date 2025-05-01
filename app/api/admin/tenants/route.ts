import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"
import { seedTenantData } from "@/lib/db/migration"
import type { NextRequest } from "next/server"

// Get all tenants (super admin only)
export async function GET(request: NextRequest) {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view tenants
    // For this endpoint, we use a special tenant ID for super admin permissions
    await requirePermission(PERMISSIONS.TENANT_VIEW, "system")

    // Get tenants
    const tenants = await executeQuery(`
     SELECT * FROM tenants ORDER BY name
   `)

    return NextResponse.json(tenants)
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 })
  }
}

// Create a new tenant (super admin only)
export async function POST(request: NextRequest) {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create tenants
    await requirePermission(PERMISSIONS.TENANT_CREATE, "system")

    // Get request body
    const tenantData = await request.json()

    // Validate tenant data
    if (!tenantData.name) {
      return NextResponse.json({ error: "Tenant name is required" }, { status: 400 })
    }

    // Create tenant
    const tenants = await executeQuery(
      `
     INSERT INTO tenants (
       name,
       domain,
       settings,
       features,
       status
     ) VALUES (
       $1, $2, $3, $4, $5
     ) RETURNING *
   `,
      [
        tenantData.name,
        tenantData.domain || null,
        JSON.stringify(tenantData.settings || {}),
        tenantData.features || [],
        tenantData.status || "active",
      ],
    )

    const tenant = tenants[0]

    // Seed tenant data
    await seedTenantData(tenant.id, tenant.name, userId)

    // Add user as tenant admin
    await executeQuery(
      `
     INSERT INTO user_roles (
       user_id,
       role,
       tenant_id
     ) VALUES (
       $1, $2, $3
     )
   `,
      [userId, "tenant_admin", tenant.id],
    )

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error("Error creating tenant:", error)
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 })
  }
}
