import { NextResponse } from "next/server"
import { getCarePlans, createCarePlan } from "@/lib/services/care-plan-service"
import { auth } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const carePlans = await getCarePlans(tenantId)
    return NextResponse.json(carePlans)
  } catch (error) {
    console.error("Failed to fetch care plans:", error)
    return NextResponse.json({ error: "Failed to fetch care plans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const carePlanData = await request.json()
    const newCarePlan = await createCarePlan(tenantId, carePlanData, session.user.id)

    if (!newCarePlan) {
      return NextResponse.json({ error: "Failed to create care plan" }, { status: 500 })
    }

    return NextResponse.json(newCarePlan, { status: 201 })
  } catch (error) {
    console.error("Failed to create care plan:", error)
    return NextResponse.json({ error: "Failed to create care plan" }, { status: 500 })
  }
}
