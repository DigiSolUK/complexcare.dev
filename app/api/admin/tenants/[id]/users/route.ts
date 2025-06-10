import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

// GET users for a tenant
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Check if tenant exists
    const tenantCheck = await sql`
      SELECT id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (tenantCheck.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get users for the tenant
    const result = await sql`
      SELECT 
        tu.id, tu.tenant_id, tu.user_id, tu.role, tu.is_primary, tu.created_at as joined_at,
        u.email, u.name, u.image
      FROM tenant_users tu
      JOIN users u ON tu.user_id = u.id
      WHERE tu.tenant_id = ${id} AND tu.deleted_at IS NULL
      ORDER BY tu.is_primary DESC, u.name ASC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching tenant users:", error)
    return NextResponse.json({ error: "Failed to fetch tenant users" }, { status: 500 })
  }
}

// POST add a user to a tenant
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { user_id, role, is_primary } = body

    // Check if tenant exists
    const tenantCheck = await sql`
      SELECT id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (tenantCheck.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Check if user exists
    const userCheck = await sql`
      SELECT id FROM users WHERE id = ${user_id}
    `

    if (userCheck.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already in the tenant
    const existingUser = await sql`
      SELECT id FROM tenant_users 
      WHERE tenant_id = ${id} AND user_id = ${user_id} AND deleted_at IS NULL
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User is already in this tenant" }, { status: 409 })
    }

    // Add user to tenant
    const now = new Date()

    const result = await sql`
      INSERT INTO tenant_users (
        tenant_id, user_id, role, is_primary, created_at, updated_at
      ) VALUES (
        ${id}, ${user_id}, ${role}, ${is_primary || false}, ${now}, ${now}
      )
      RETURNING id, tenant_id, user_id, role, is_primary, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding user to tenant:", error)
    return NextResponse.json({ error: "Failed to add user to tenant" }, { status: 500 })
  }
}
