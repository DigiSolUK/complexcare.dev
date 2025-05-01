import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { getAuditLogs, logAuditEvent } from "@/lib/services/compliance-service"
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

    // Check if user has permission to view compliance audit logs
    await requirePermission(PERMISSIONS.COMPLIANCE_VIEW, tenantId)

    // Get limit from query parameter
    const searchParams = request.nextUrl.searchParams
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 100

    // Get compliance audit logs
    const auditLogs = await getAuditLogs(tenantId, limit)

    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error("Error fetching compliance audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch compliance audit logs" }, { status: 500 })
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

    // Get request body
    const auditData = await request.json()

    // Add user ID if available
    if (userId) {
      auditData.user_id = userId
    }

    // Add IP address and user agent
    auditData.ip_address = request.headers.get("x-forwarded-for") || request.ip
    auditData.user_agent = request.headers.get("user-agent")

    // Log audit event
    const auditLog = await logAuditEvent(tenantId, auditData)

    return NextResponse.json(auditLog, { status: 201 })
  } catch (error) {
    console.error("Error logging audit event:", error)
    return NextResponse.json({ error: "Failed to log audit event" }, { status: 500 })
  }
}
