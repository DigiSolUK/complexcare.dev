import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

// GET tenant by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const result = await sql`
      SELECT id, name, slug, domain, subscription_tier, status, created_at, updated_at
      FROM tenants
      WHERE id = ${id} AND deleted_at IS NULL
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json({ error: "Failed to fetch tenant" }, { status: 500 })
  }
}

// PATCH update tenant
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, slug, domain, subscription_tier, status } = body

    // Check if tenant exists
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (existingTenant.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Check if slug is already taken by another tenant
    if (slug) {
      const slugCheck = await sql`
        SELECT id FROM tenants 
        WHERE slug = ${slug} AND id != ${id} AND deleted_at IS NULL
      `

      if (slugCheck.length > 0) {
        return NextResponse.json({ error: "Slug is already taken" }, { status: 409 })
      }
    }

    // Update the tenant
    const now = new Date()

    // Build the update query dynamically
    let updateQuery = `
      UPDATE tenants
      SET updated_at = $1
    `

    const queryParams = [now]
    let paramIndex = 2

    if (name) {
      updateQuery += `, name = $${paramIndex}`
      queryParams.push(name)
      paramIndex++
    }

    if (slug) {
      updateQuery += `, slug = $${paramIndex}`
      queryParams.push(slug)
      paramIndex++
    }

    if (domain !== undefined) {
      updateQuery += `, domain = $${paramIndex}`
      queryParams.push(domain)
      paramIndex++
    }

    if (subscription_tier) {
      updateQuery += `, subscription_tier = $${paramIndex}`
      queryParams.push(subscription_tier)
      paramIndex++
    }

    if (status) {
      updateQuery += `, status = $${paramIndex}`
      queryParams.push(status)
      paramIndex++
    }

    updateQuery += ` WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING id, name, slug, domain, subscription_tier, status, created_at, updated_at`
    queryParams.push(id)

    const result = await sql.query(updateQuery, queryParams)

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 })
  }
}

// DELETE tenant (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Check if tenant exists
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (existingTenant.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Soft delete the tenant
    const now = new Date()

    await sql`
      UPDATE tenants
      SET deleted_at = ${now}, updated_at = ${now}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json({ error: "Failed to delete tenant" }, { status: 500 })
  }
}
