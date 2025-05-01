import { type NextRequest, NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json()

    if (!profile) {
      return NextResponse.json({ error: "Patient profile is required" }, { status: 400 })
    }

    const result = await getPersonalizedRecommendations(profile)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
