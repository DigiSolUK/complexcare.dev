import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET tenant settings
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = params.id

    // Check if tenant exists
    const tenants = await executeQuery(`SELECT * FROM tenants WHERE id = $1`, [tenantId])

    if (tenants.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get tenant settings
    const settings = await executeQuery(`SELECT * FROM tenant_settings WHERE tenant_id = $1 ORDER BY setting_key ASC`, [
      tenantId,
    ])

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching tenant settings:", error)
    return NextResponse.json({ error: "Failed to fetch tenant settings" }, { status: 500 })
  }
}

// UPDATE tenant settings
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = params.id
    const { settings } = await request.json()

    // Check if tenant exists
    const tenants = await executeQuery(`SELECT * FROM tenants WHERE id = $1`, [tenantId])

    if (tenants.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Start transaction
    await executeQuery("BEGIN")

    try {
      // Delete existing settings
      await executeQuery(`DELETE FROM tenant_settings WHERE tenant_id = $1`, [tenantId])

      // Insert new settings
      const newSettings = []

      for (const setting of settings) {
        if (setting.setting_key && setting.setting_value) {
          const result = await executeQuery(
            `INSERT INTO tenant_settings (tenant_id, setting_key, setting_value) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [tenantId, setting.setting_key, setting.setting_value],
          )

          newSettings.push(result[0])
        }
      }

      // Commit transaction
      await executeQuery("COMMIT")

      return NextResponse.json(newSettings)
    } catch (error) {
      // Rollback transaction on error
      await executeQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Error updating tenant settings:", error)
    return NextResponse.json({ error: "Failed to update tenant settings" }, { status: 500 })
  }
}
