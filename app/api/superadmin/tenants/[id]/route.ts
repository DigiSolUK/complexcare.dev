import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validate ID format (basic UUID check)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ message: "Invalid tenant ID format" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get tenant details
    const tenantResult = await sql`
      SELECT * FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (tenantResult.length === 0) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    const tenant = tenantResult[0]

    // Get tenant settings
    const settingsResult = await sql`
      SELECT key, value FROM tenant_settings WHERE tenant_id = ${id}
    `

    // Get tenant users count
    const usersCountResult = await sql`
      SELECT COUNT(*) as count FROM tenant_users WHERE tenant_id = ${id} AND deleted_at IS NULL
    `

    // Format response
    const response = {
      ...tenant,
      settings: settingsResult.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {}),
      users_count: Number.parseInt(usersCountResult[0]?.count || "0"),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching tenant details:", error)
    return NextResponse.json(
      { message: "Failed to fetch tenant details", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate ID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ message: "Invalid tenant ID format" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if tenant exists
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (existingTenant.length === 0) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    // Update tenant fields
    const updateFields = []
    const values = [id] // First value is always the ID

    if (body.name) {
      updateFields.push(`name = ${body.name}`)
    }

    if (body.slug) {
      // Check if slug is already taken by another tenant
      const slugCheck = await sql`
        SELECT id FROM tenants 
        WHERE slug = ${body.slug} AND id != ${id} AND deleted_at IS NULL
      `

      if (slugCheck.length > 0) {
        return NextResponse.json({ message: "Slug already in use by another tenant" }, { status: 409 })
      }

      updateFields.push(`slug = ${body.slug}`)
    }

    if (body.domain !== undefined) {
      updateFields.push(`domain = ${body.domain}`)
    }

    if (body.status) {
      updateFields.push(`status = ${body.status}`)
    }

    if (body.subscription_tier) {
      updateFields.push(`subscription_tier = ${body.subscription_tier}`)
    }

    if (body.settings) {
      updateFields.push(`settings = ${JSON.stringify(body.settings)}`)
    }

    if (body.branding) {
      updateFields.push(`branding = ${JSON.stringify(body.branding)}`)
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }

    // Add updated_at
    updateFields.push(`updated_at = NOW()`)

    // Build and execute update query
    const query = `
      UPDATE tenants 
      SET ${updateFields.join(", ")} 
      WHERE id = ${id}
      RETURNING *
    `

    const result = await sql.query(query)

    if (!result || result.rows.length === 0) {
      throw new Error("Failed to update tenant")
    }

    return NextResponse.json({
      message: "Tenant updated successfully",
      tenant: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json({ message: "Failed to update tenant", error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validate ID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ message: "Invalid tenant ID format" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Soft delete the tenant
    const result = await sql`
      UPDATE tenants 
      SET deleted_at = NOW(), status = 'deleted' 
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "Tenant not found or already deleted" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tenant deleted successfully" })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json({ message: "Failed to delete tenant", error: (error as Error).message }, { status: 500 })
  }
}
