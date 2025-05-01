import { type NextRequest, NextResponse } from "next/server"
import { generateTreatmentProtocol } from "@/lib/ai/groq-client"
import { getSession } from "@/lib/auth"
import { logError } from "@/lib/services/error-logging-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Only allow authenticated users
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { condition, patientDetails, protocolType, patientId } = await request.json()

    if (!condition) {
      return NextResponse.json({ error: "Medical condition is required" }, { status: 400 })
    }

    const result = await generateTreatmentProtocol({
      condition,
      patientDetails: patientDetails || "",
      protocolType: protocolType || "standard",
      patientId,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in treatment protocol generation:", error)

    // Log error to database
    await logError({
      message: `Treatment protocol API error: ${error.message}`,
      stack: error.stack,
      componentPath: "app/api/ai/treatment-protocol/route.ts",
      method: "POST",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to generate treatment protocol" }, { status: 500 })
  }
}
