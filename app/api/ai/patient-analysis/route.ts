import { type NextRequest, NextResponse } from "next/server"
import { analyzePatientData } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data) {
      return NextResponse.json({ error: "Patient data is required" }, { status: 400 })
    }

    const result = await analyzePatientData(data)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in patient analysis API:", error)
    return NextResponse.json({ error: "Failed to analyze patient data" }, { status: 500 })
  }
}
