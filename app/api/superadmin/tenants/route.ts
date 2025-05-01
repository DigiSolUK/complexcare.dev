import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.subdomain || !body.contact_email) {
      return NextResponse.json(
        { message: "Missing required fields: name, subdomain, and contact_email are required" },
        { status: 400 },
      )
    }

    // Check if slug already exists (using slug instead of subdomain)
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE slug = ${body.subdomain}
    `

    if (existingTenant.length > 0) {
      return NextResponse.json({ message: "Subdomain already exists" }, { status: 409 })
    }

    // Create the new tenant (using slug instead of subdomain)
    const result = await sql`
      INSERT INTO tenants (
        name, 
        slug, 
        domain, 
        status, 
        subscription_tier, 
        settings, 
        branding
      ) 
      VALUES (
        ${body.name}, 
        ${body.subdomain}, 
        ${body.contact_email}, 
        ${"active"}, 
        ${"basic"}, 
        ${JSON.stringify({
          contact_phone: body.contact_phone || null,
          address: body.address || null,
          description: body.description || null,
          max_users: body.max_users || 10,
        })}, 
        ${JSON.stringify({})}
      )
      RETURNING id, name, slug, created_at
    `

    if (result.length === 0) {
      throw new Error("Failed to create tenant")
    }

    // Create default tenant settings
    await sql`
      INSERT INTO tenant_settings (
        tenant_id, 
        key, 
        value
      ) 
      VALUES (
        ${result[0].id}, 
        ${"theme"}, 
        ${"light"}
      )
    `

    return NextResponse.json(
      {
        message: "Tenant created successfully",
        tenant: result[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tenant:", error)
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const tenants = await sql`
      SELECT 
        id, 
        name, 
        slug, 
        domain, 
        status, 
        subscription_tier,
        created_at
      FROM tenants
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `

    return NextResponse.json({ tenants })
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json({ message: "Internal server error", error: (error as Error).message }, { status: 500 })
  }
}
