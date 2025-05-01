import { NextResponse } from "next/server"
import { acceptTenantInvitation } from "@/lib/services/tenant-service"
import { getCurrentUserId } from "@/lib/auth/auth-utils"

// Accept a tenant invitation
export async function POST(request: Request) {
  try {
    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Invitation token is required" }, { status: 400 })
    }

    // Accept invitation
    const success = await acceptTenantInvitation(token, userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to accept invitation" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
  }
}
