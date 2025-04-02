import { type NextRequest, NextResponse } from "next/server"
import { fetchPatientRecord } from "@/lib/services/gp-connect-service"

export async function GET(request: NextRequest, { params }: { params: { nhsNumber: string } }) {
  try {
    const { nhsNumber } = params

    // Validate NHS number format (10 digits)
    if (!/^\d{10}$/.test(nhsNumber)) {
      return NextResponse.json({ error: "Invalid NHS number format. Must be 10 digits." }, { status: 400 })
    }

    // Fetch patient record from GP Connect (currently mock data)
    const patientRecord = await fetchPatientRecord(nhsNumber)

    return NextResponse.json(patientRecord)
  } catch (error) {
    console.error("Error fetching patient record:", error)
    return NextResponse.json({ error: "Failed to fetch patient record" }, { status: 500 })
  }
}

