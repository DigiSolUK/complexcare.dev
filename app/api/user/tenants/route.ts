import { NextResponse } from "next/server"
import { getUserTenants } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"

// Get tenants for the current user
export async function GET() {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user tenants
    const tenants = await getUserTenants(userId)

    return NextResponse.json(tenants)
  } catch (error) {
    console.error("Error fetching user tenants:", error)
    return NextResponse.json({ error: "Failed to fetch user tenants" }, { status: 500 })
  }
}
