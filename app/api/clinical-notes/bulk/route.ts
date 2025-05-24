import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, noteIds, data } = await request.json()
    const tenantId = data?.tenant_id || DEFAULT_TENANT_ID

    if (!action || !noteIds || !Array.isArray(noteIds)) {
      return NextResponse.json({ error: "Action and noteIds array are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    let result

    switch (action) {
      case "delete":
        result = await sql`
          DELETE FROM clinical_notes
          WHERE id = ANY(${noteIds}) AND tenant_id = ${tenantId}
        `
        return NextResponse.json({
          success: true,
          message: `${noteIds.length} clinical notes deleted successfully`,
        })

      case "update_category":
        if (!data.category_id) {
          return NextResponse.json({ error: "Category ID is required for bulk update" }, { status: 400 })
        }
        result = await sql`
          UPDATE clinical_notes
          SET category_id = ${data.category_id}, updated_at = NOW()
          WHERE id = ANY(${noteIds}) AND tenant_id = ${tenantId}
        `
        return NextResponse.json({
          success: true,
          message: `${noteIds.length} clinical notes updated successfully`,
        })

      case "update_privacy":
        if (typeof data.is_private !== "boolean") {
          return NextResponse.json({ error: "Privacy setting is required for bulk update" }, { status: 400 })
        }
        result = await sql`
          UPDATE clinical_notes
          SET is_private = ${data.is_private}, updated_at = NOW()
          WHERE id = ANY(${noteIds}) AND tenant_id = ${tenantId}
        `
        return NextResponse.json({
          success: true,
          message: `${noteIds.length} clinical notes privacy updated successfully`,
        })

      case "add_tags":
        if (!data.tags || !Array.isArray(data.tags)) {
          return NextResponse.json({ error: "Tags array is required for bulk tag addition" }, { status: 400 })
        }
        result = await sql`
          UPDATE clinical_notes
          SET tags = array_cat(tags, ${data.tags}), updated_at = NOW()
          WHERE id = ANY(${noteIds}) AND tenant_id = ${tenantId}
        `
        return NextResponse.json({
          success: true,
          message: `Tags added to ${noteIds.length} clinical notes successfully`,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in POST /api/clinical-notes/bulk:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
