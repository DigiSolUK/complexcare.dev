import { type NextRequest, NextResponse } from "next/server"
import { isTenantFeatureEnabled } from "@/lib/services/feature-service"
import { getDefaultTenantId } from "@/lib/tenant"
import { z } from "zod"

const querySchema = z.object({
  featureId: z.string(),
  tenantId: z.string().uuid().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const featureId = url.searchParams.get("featureId")
    const tenantId = url.searchParams.get("tenantId") || getDefaultTenantId()

    // Validate query parameters
    const result = querySchema.safeParse({ featureId, tenantId })
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request parameters", details: result.error.format() }, { status: 400 })
    }

    // Check if feature is enabled
    const enabled = await isTenantFeatureEnabled(featureId, tenantId)

    return NextResponse.json({ enabled })
  } catch (error) {
    console.error("Error checking feature:", error)
    return NextResponse.json({ error: "Failed to check feature" }, { status: 500 })
  }
}
