import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

interface RouteParams {
  params: {
    id: string
  }
}

// GET invitations for a tenant
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

    // Get invitations for the tenant
    const result = await sql`
      SELECT id, tenant_id, email, role, token, expires_at, created_at, updated_at, accepted_at
      FROM tenant_invitations
      WHERE tenant_id = ${id} AND accepted_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching tenant invitations:", error)
    return NextResponse.json({ error: "Failed to fetch tenant invitations" }, { status: 500 })
  }
}

// POST create an invitation
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { email, role } = body

    // Check if tenant exists
    const tenantCheck = await sql`
      SELECT id, name FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (tenantCheck.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Check if user with this email already exists in the tenant
    const userCheck = await sql`
      SELECT tu.id
      FROM tenant_users tu
      JOIN users u ON tu.user_id = u.id
      WHERE tu.tenant_id = ${id} AND u.email = ${email} AND tu.deleted_at IS NULL
    `

    if (userCheck.length > 0) {
      return NextResponse.json({ error: "User with this email is already in this tenant" }, { status: 409 })
    }

    // Check if there's already an active invitation for this email
    const invitationCheck = await sql`
      SELECT id FROM tenant_invitations
      WHERE tenant_id = ${id} AND email = ${email} AND accepted_at IS NULL AND expires_at > NOW()
    `

    if (invitationCheck.length > 0) {
      return NextResponse.json({ error: "There is already an active invitation for this email" }, { status: 409 })
    }

    // Create invitation
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const token = uuidv4()

    const result = await sql`
      INSERT INTO tenant_invitations (
        tenant_id, email, role, token, expires_at, created_at, updated_at
      ) VALUES (
        ${id}, ${email}, ${role}, ${token}, ${expiresAt}, ${now}, ${now}
      )
      RETURNING id, tenant_id, email, role, token, expires_at, created_at, updated_at
    `

    // TODO: Send invitation email

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}
