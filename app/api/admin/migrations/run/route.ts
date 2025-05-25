import { type NextRequest, NextResponse } from "next/server"
import { addComplianceStatusColumn } from "@/lib/db/migrations/add-compliance-status"
import { requirePermission } from "@/lib/auth/require-permission"

export async function POST(request: NextRequest) {
  try {
    // Check if user has admin permissions
    const permissionCheck = await requirePermission(["admin", "superadmin"])
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You do not have permission to run migrations" },
        { status: 403 },
      )
    }

    // Run the migration
    const result = await addComplianceStatusColumn()

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
      return NextResponse.json({ error: "Migration failed", message: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error running migration:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
