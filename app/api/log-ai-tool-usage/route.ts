import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getSession } from "@auth0/nextjs-auth0"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.sub
    const tenantId = session.user.org_id || process.env.DEFAULT_TENANT_ID

    const data = await request.json()
    const { toolName, patientId, result, duration, assessmentType, noteType } = data

    // Calculate execution time if duration is provided
    const executionTimeMs = duration || null

    // Insert into ai_tool_analytics table using the existing structure
    await sql`
      INSERT INTO ai_tool_analytics (
        tenant_id, 
        user_id, 
        tool_name, 
        input_text, 
        output_text, 
        success,
        execution_time_ms,
        created_at
      ) 
      VALUES (
        ${tenantId}, 
        ${userId}, 
        ${toolName}, 
        ${JSON.stringify({
          patientId,
          assessmentType,
          noteType,
        })}, 
        ${result || null}, 
        ${true},
        ${executionTimeMs},
        NOW()
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging AI tool usage:", error)
    return NextResponse.json({ error: "Failed to log AI tool usage" }, { status: 500 })
  }
}
