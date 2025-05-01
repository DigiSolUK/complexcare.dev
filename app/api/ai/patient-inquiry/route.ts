import { type NextRequest, NextResponse } from "next/server"
import { patientInquiry } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const result = await patientInquiry(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in patient inquiry API:", error)
    return NextResponse.json({ error: "Failed to process patient inquiry" }, { status: 500 })
  }
}
