import { type NextRequest, NextResponse } from "next/server"
import { getCarePlans, createCarePlan, getCarePlansForPatient } from "@/lib/services/care-plan-service"

export async function GET(request: NextRequest) {
  try {
    // In demo mode, we'll use a fixed tenant ID
    const tenantId = "demo-tenant-1"

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const patientId = searchParams.get("patientId")

    // Get care plans (filtered by patient if patientId is provided)
    const carePlans = patientId ? await getCarePlansForPatient(tenantId, patientId) : await getCarePlans(tenantId)

    return NextResponse.json({ carePlans })
  } catch (error) {
    console.error("Error in care plans API:", error)
    return NextResponse.json({ error: "Failed to fetch care plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In demo mode, we'll use fixed values
    const tenantId = "demo-tenant-1"
    const userId = "demo-user-1"

    // Create the care plan
    const newCarePlan = await createCarePlan(tenantId, body, userId)

    if (!newCarePlan) {
      return NextResponse.json({ error: "Failed to create care plan" }, { status: 500 })
    }

    return NextResponse.json({ carePlan: newCarePlan }, { status: 201 })
  } catch (error) {
    console.error("Error in care plans API:", error)
    return NextResponse.json({ error: "Failed to create care plan" }, { status: 500 })
  }
}

