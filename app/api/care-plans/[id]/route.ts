import { NextResponse } from "next/server"
import { getCarePlanById, updateCarePlan, deleteCarePlan } from "@/lib/services/care-plan-service"
import { auth } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const carePlanId = params.id
    const carePlan = await getCarePlanById(tenantId, carePlanId)

    if (!carePlan) {
      return NextResponse.json({ error: "Care plan not found" }, { status: 404 })
    }

    return NextResponse.json(carePlan)
  } catch (error) {
    console.error("Failed to fetch care plan:", error)
    return NextResponse.json({ error: "Failed to fetch care plan" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const carePlanId = params.id
    const carePlanData = await request.json()
    const updatedCarePlan = await updateCarePlan(tenantId, carePlanId, carePlanData, session.user.id)

    if (!updatedCarePlan) {
      return NextResponse.json({ error: "Failed to update care plan" }, { status: 500 })
    }

    return NextResponse.json(updatedCarePlan)
  } catch (error) {
    console.error("Failed to update care plan:", error)
    return NextResponse.json({ error: "Failed to update care plan" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const carePlanId = params.id
    const success = await deleteCarePlan(tenantId, carePlanId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete care plan" }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete care plan:", error)
    return NextResponse.json({ error: "Failed to delete care plan" }, { status: 500 })
  }
}
