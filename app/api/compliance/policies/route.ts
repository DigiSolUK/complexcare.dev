import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { getPolicies, createPolicy } from "@/lib/services/compliance-service"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view compliance policies
    await requirePermission(PERMISSIONS.COMPLIANCE_VIEW, tenantId)

    // Get compliance policies
    const policies = await getPolicies(tenantId)

    return NextResponse.json(policies)
  } catch (error) {
    console.error("Error fetching compliance policies:", error)
    return NextResponse.json({ error: "Failed to fetch compliance policies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create compliance policies
    await requirePermission(PERMISSIONS.COMPLIANCE_CREATE, tenantId)

    // Get request body
    const policyData = await request.json()

    // Create compliance policy
    const policy = await createPolicy(tenantId, policyData, userId)

    return NextResponse.json(policy, { status: 201 })
  } catch (error) {
    console.error("Error creating compliance policy:", error)
    return NextResponse.json({ error: "Failed to create compliance policy" }, { status: 500 })
  }
}

