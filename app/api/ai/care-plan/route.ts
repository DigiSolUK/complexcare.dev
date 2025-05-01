import { type NextRequest, NextResponse } from "next/server"
import { generateCarePlan } from "@/lib/ai/groq-client"
import { getPatientById } from "@/lib/services/patient-service"

export async function POST(request: NextRequest) {
  try {
    const { patientId, tenantId } = await request.json()

    if (!patientId || !tenantId) {
      return NextResponse.json({ error: "Patient ID and Tenant ID are required" }, { status: 400 })
    }

    // Get patient data
    const patient = await getPatientById(tenantId, patientId)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Generate care plan
    const result = await generateCarePlan(patient)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to generate care plan" }, { status: 500 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in care plan generation API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
