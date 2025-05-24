import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// POST accept an invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, name, password } = body

    // Validate required fields
    if (!token || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the invitation
    const invitation = await sql`
      SELECT id, tenant_id, email, role, expires_at
      FROM tenant_invitations
      WHERE token = ${token} AND accepted_at IS NULL AND expires_at > NOW()
    `

    if (invitation.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 })
    }

    const { id: invitationId, tenant_id, email, role, expires_at } = invitation[0]

    // Check if user with this email already exists
    let userId
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    const now = new Date()

    if (existingUser.length > 0) {
      // User exists, use existing user ID
      userId = existingUser[0].id
    } else {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (
          id, email, name, password_hash, created_at, updated_at
        ) VALUES (
          ${uuidv4()}, ${email}, ${name}, ${password}, ${now}, ${now}
        )
        RETURNING id
      `
      userId = newUser[0].id
    }

    // Add user to tenant
    await sql`
      INSERT INTO tenant_users (
        tenant_id, user_id, role, is_primary, created_at, updated_at
      ) VALUES (
        ${tenant_id}, ${userId}, ${role}, false, ${now}, ${now}
      )
    `

    // Mark invitation as accepted
    await sql`
      UPDATE tenant_invitations
      SET accepted_at = ${now}, updated_at = ${now}
      WHERE id = ${invitationId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
  }
}
