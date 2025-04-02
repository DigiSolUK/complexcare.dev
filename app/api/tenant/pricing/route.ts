import { NextResponse } from "next/server"
import { updateTenantPricingTier } from "@/lib/services/pricing-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { tierId } = await request.json()

    if (!tierId) {
      return NextResponse.json({ success: false, error: "Tier ID is required" }, { status: 400 })
    }

    const result = await updateTenantPricingTier(tierId)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating pricing tier:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

