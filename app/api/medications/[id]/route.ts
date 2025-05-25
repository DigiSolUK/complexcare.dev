import { type NextRequest, NextResponse } from "next/server"
import { DmdService } from "@/lib/services/dmd-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get the current user and tenant ID
    let tenantId = "demo-tenant"
    try {
      const user = await getCurrentUser()
      if (user) {
        tenantId = user.tenant_id
      }
    } catch (authError) {
      console.error("Authentication error:", authError)
      // Continue without user - we'll use demo tenant
    }

    // Get medication details
    const medicationDetails = await DmdService.getMedicationDetails(id, tenantId)

    if (!medicationDetails) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 })
    }

    return NextResponse.json(medicationDetails)
  } catch (error) {
    console.error("Error getting medication details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
