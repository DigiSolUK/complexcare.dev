import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MedicationInteractionService } from "@/lib/services/medication-interaction-service"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { medications, patientId } = await request.json()

    if (!medications || !Array.isArray(medications) || medications.length < 2) {
      return NextResponse.json({ error: "At least two medications are required" }, { status: 400 })
    }

    const result = await MedicationInteractionService.checkInteractions(medications, patientId, session.user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking medication interactions:", error)
    return NextResponse.json({ error: "Failed to check medication interactions" }, { status: 500 })
  }
}
