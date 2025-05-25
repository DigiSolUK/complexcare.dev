import { type NextRequest, NextResponse } from "next/server"
import { MigrationRunner } from "@/lib/db/migration-framework"
import { requirePermission } from "@/lib/auth/require-permission"

export async function POST(req: NextRequest) {
  try {
    // Check if user has admin permissions
    const permissionCheck = await requirePermission(req, "admin.database.manage")
    if (!permissionCheck.hasPermission) {
      return NextResponse.json({ error: "Unauthorized: Insufficient permissions" }, { status: 403 })
    }

    const { dryRun = false } = await req.json()

    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database URL not configured" }, { status: 500 })
    }

    const runner = new MigrationRunner(databaseUrl)
    await runner.rollbackLastMigration(dryRun)

    const status = await runner.getStatus()

    return NextResponse.json({
      success: true,
      message: dryRun ? "Dry run completed" : "Rollback completed successfully",
      status,
    })
  } catch (error) {
    console.error("Failed to rollback migration:", error)
    return NextResponse.json(
      { error: "Failed to rollback migration", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
