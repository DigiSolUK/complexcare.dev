import { NextResponse } from "next/server"
import { getUserPrimaryTenant, setUserPrimaryTenant } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"

// Get primary tenant for the current user
export async function GET() {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's primary tenant
    const tenant = await getUserPrimaryTenant(userId)

    if (!tenant) {
      return NextResponse.json({ error: "No primary tenant found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error fetching primary tenant:", error)
    return NextResponse.json({ error: "Failed to fetch primary tenant" }, { status: 500 })
  }
}

// Set primary tenant for the current user
export async function POST(request: Request) {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { tenantId } = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Set primary tenant
    const success = await setUserPrimaryTenant(userId, tenantId)

    if (!success) {
      return NextResponse.json({ error: "Failed to set primary tenant" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting primary tenant:", error)
    return NextResponse.json({ error: "Failed to set primary tenant" }, { status: 500 })
  }
}
