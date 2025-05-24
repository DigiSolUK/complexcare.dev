import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// GET all tenants
export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT id, name, slug, domain, subscription_tier, status, created_at, updated_at
      FROM tenants
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 })
  }
}

// POST create a new tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, domain, subscription_tier, status } = body

    // Validate required fields
    if (!name || !slug || !subscription_tier || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug is already taken
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE slug = ${slug} AND deleted_at IS NULL
    `

    if (existingTenant.length > 0) {
      return NextResponse.json({ error: "Slug is already taken" }, { status: 409 })
    }

    // Create the tenant
    const id = uuidv4()
    const now = new Date()

    const result = await sql`
      INSERT INTO tenants (
        id, name, slug, domain, subscription_tier, status, created_at, updated_at
      ) VALUES (
        ${id}, ${name}, ${slug}, ${domain}, ${subscription_tier}, ${status}, ${now}, ${now}
      )
      RETURNING id, name, slug, domain, subscription_tier, status, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating tenant:", error)
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 })
  }
}
