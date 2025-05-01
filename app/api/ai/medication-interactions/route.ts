import { type NextRequest, NextResponse } from "next/server"
import { checkMedicationInteractions } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { medications } = await request.json()

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: "Valid medications array is required" }, { status: 400 })
    }

    const result = await checkMedicationInteractions(medications)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in medication interactions API:", error)
    return NextResponse.json({ error: "Failed to check medication interactions" }, { status: 500 })
  }
}
