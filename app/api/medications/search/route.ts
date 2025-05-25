import { type NextRequest, NextResponse } from "next/server"
import { DmdService } from "@/lib/services/dmd-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Get the search term from the query parameters
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("term")

    if (!searchTerm) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 })
    }

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

    // Search for medications
    const medications = await DmdService.searchMedications(searchTerm, tenantId)

    return NextResponse.json(medications)
  } catch (error) {
    console.error("Error searching medications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
