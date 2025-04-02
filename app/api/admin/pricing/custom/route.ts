import { NextResponse } from "next/server"
import { createCustomPricingTier } from "@/lib/services/pricing-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, monthlyPrice, annualPrice, features } = await request.json()

    if (!name || !description || !monthlyPrice || !annualPrice || !features || features.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    const result = await createCustomPricingTier(name, description, monthlyPrice, annualPrice, features)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error("Error creating custom pricing tier:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

