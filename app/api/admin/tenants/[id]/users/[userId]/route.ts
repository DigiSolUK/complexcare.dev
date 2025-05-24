import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
    userId: string
  }
}

// GET a specific user in a tenant
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, userId } = params

    const result = await sql`
      SELECT 
        tu.id, tu.tenant_id, tu.user_id, tu.role, tu.is_primary, tu.created_at as joined_at,
        u.email, u.name, u.image
      FROM tenant_users tu
      JOIN users u ON tu.user_id = u.id
      WHERE tu.tenant_id = ${id} AND tu.user_id = ${userId} AND tu.deleted_at IS NULL
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found in this tenant" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching tenant user:", error)
    return NextResponse.json({ error: "Failed to fetch tenant user" }, { status: 500 })
  }
}

// PATCH update a user's role in a tenant
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, userId } = params
    const body = await request.json()
    const { role } = body

    // Check if user exists in tenant
    const userCheck = await sql`
      SELECT id, is_primary FROM tenant_users 
      WHERE tenant_id = ${id} AND user_id = ${userId} AND deleted_at IS NULL
    `

    if (userCheck.length === 0) {
      return NextResponse.json({ error: "User not found in this tenant" }, { status: 404 })
    }

    // Don't allow changing role of primary user
    if (userCheck[0].is_primary) {
      return NextResponse.json({ error: "Cannot change role of primary user" }, { status: 403 })
    }

    // Update user role
    const now = new Date()

    const result = await sql`
      UPDATE tenant_users
      SET role = ${role}, updated_at = ${now}
      WHERE tenant_id = ${id} AND user_id = ${userId} AND deleted_at IS NULL
      RETURNING id, tenant_id, user_id, role, is_primary, created_at, updated_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating tenant user:", error)
    return NextResponse.json({ error: "Failed to update tenant user" }, { status: 500 })
  }
}

// DELETE remove a user from a tenant
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, userId } = params

    // Check if user exists in tenant
    const userCheck = await sql`
      SELECT id, is_primary FROM tenant_users 
      WHERE tenant_id = ${id} AND user_id = ${userId} AND deleted_at IS NULL
    `

    if (userCheck.length === 0) {
      return NextResponse.json({ error: "User not found in this tenant" }, { status: 404 })
    }

    // Don't allow removing primary user
    if (userCheck[0].is_primary) {
      return NextResponse.json({ error: "Cannot remove primary user from tenant" }, { status: 403 })
    }

    // Soft delete the user from tenant
    const now = new Date()

    await sql`
      UPDATE tenant_users
      SET deleted_at = ${now}, updated_at = ${now}
      WHERE tenant_id = ${id} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing user from tenant:", error)
    return NextResponse.json({ error: "Failed to remove user from tenant" }, { status: 500 })
  }
}
