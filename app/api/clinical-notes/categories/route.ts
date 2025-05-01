import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// GET all clinical note categories for a tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || session.user.tenantId

    const categories = await db`
      SELECT * FROM clinical_notes_categories
      WHERE tenant_id = ${tenantId}
      ORDER BY name ASC
    `

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST a new clinical note category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, color } = body
    const tenantId = body.tenantId || session.user.tenantId

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const [category] = await db`
      INSERT INTO clinical_notes_categories (tenant_id, name, description, color)
      VALUES (${tenantId}, ${name}, ${description || null}, ${color || null})
      RETURNING *
    `

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
