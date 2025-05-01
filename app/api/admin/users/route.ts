import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

// Get all users (admin only)
export async function GET(request: Request) {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view users
    await requirePermission(PERMISSIONS.USER_VIEW, "system")

    // Get all users
    const users = await executeQuery(`
      SELECT id, email, name, created_at
      FROM neon_auth.users_sync
      ORDER BY name ASC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
