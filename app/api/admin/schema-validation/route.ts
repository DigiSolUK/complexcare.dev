import { type NextRequest, NextResponse } from "next/server"
import { validateDatabaseSchema, generateFixSql } from "@/lib/db/schema-validator"
import { requirePermission } from "@/lib/auth/require-permission"

export async function GET(req: NextRequest) {
  try {
    // Check if user has admin permissions
    const permissionCheck = await requirePermission(req, "admin.database.manage")
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: "Unauthorized: Insufficient permissions" }, { status: 403 })
    }

    const result = await validateDatabaseSchema()

    return NextResponse.json({
      ...result,
      fixSql: result.isValid ? null : generateFixSql(result.mismatches),
    })
  } catch (error) {
    console.error("Schema validation API error:", error)
    return NextResponse.json(
      { error: "Failed to validate schema", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
