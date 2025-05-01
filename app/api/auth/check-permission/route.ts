import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, hasPermission } from "@/lib/auth/auth-utils"
import type { Permission } from "@/lib/auth/permissions"

export async function GET(request: NextRequest) {
  try {
    // Get permission from query parameter
    const searchParams = request.nextUrl.searchParams
    const permission = searchParams.get("permission") as Permission

    if (!permission) {
      return NextResponse.json({ error: "Permission parameter is required" }, { status: 400 })
    }

    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ hasPermission: false }, { status: 200 })
    }

    // Check if user has the required permission
    const userHasPermission = await hasPermission(userId, tenantId, permission)

    return NextResponse.json({ hasPermission: userHasPermission })
  } catch (error) {
    console.error("Error checking permission:", error)
    return NextResponse.json({ error: "Failed to check permission" }, { status: 500 })
  }
}
