import { NextResponse } from "next/server"
import { getMedicationsByPatientId } from "@/lib/services/medication-service"
import { getAuth } from "@/lib/auth/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { tenantId, userId } = await getAuth()
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const patientId = params.id

    const medications = await getMedicationsByPatientId(tenantId, patientId)
    return NextResponse.json(medications)
  } catch (error: any) {
    console.error("Error fetching patient medications:", error)
    return NextResponse.json({ error: "Failed to fetch patient medications", details: error.message }, { status: 500 })
  }
}
