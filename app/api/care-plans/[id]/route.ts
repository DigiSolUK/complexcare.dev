import { type NextRequest, NextResponse } from "next/server"
import { getCarePlanById, updateCarePlan, deleteCarePlan } from "@/lib/services/care-plan-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    // In demo mode, we'll use a fixed tenant ID
    const tenantId = "demo-tenant-1"

    const carePlan = await getCarePlanById(id, tenantId)

    if (!carePlan) {
      return NextResponse.json({ error: "Care plan not found" }, { status: 404 })
    }

    return NextResponse.json({ carePlan })
  } catch (error) {
    console.error("Error in care plan API:", error)
    return NextResponse.json({ error: "Failed to fetch care plan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    // In demo mode, we'll use a fixed tenant ID
    const tenantId = "demo-tenant-1"

    const updatedCarePlan = await updateCarePlan(id, body, tenantId)

    if (!updatedCarePlan) {
      return NextResponse.json({ error: "Failed to update care plan" }, { status: 500 })
    }

    return NextResponse.json({ carePlan: updatedCarePlan })
  } catch (error) {
    console.error("Error in care plan API:", error)
    return NextResponse.json({ error: "Failed to update care plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    // In demo mode, we'll use a fixed tenant ID
    const tenantId = "demo-tenant-1"

    const success = await deleteCarePlan(id, tenantId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete care plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in care plan API:", error)
    return NextResponse.json({ error: "Failed to delete care plan" }, { status: 500 })
  }
}

