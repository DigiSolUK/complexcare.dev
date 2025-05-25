import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// PUT to update a clinical note category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId
    const body = await request.json()
    const { name, description, color } = body

    // Check if category exists and belongs to the tenant
    const [existingCategory] = await db`
      SELECT * FROM clinical_notes_categories 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Update the category
    const [updatedCategory] = await db`
      UPDATE clinical_notes_categories
      SET 
        name = ${name || existingCategory.name},
        description = ${description !== undefined ? description : existingCategory.description},
        color = ${color || existingCategory.color},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating clinical note category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE a clinical note category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    // Check if category exists and belongs to the tenant
    const [existingCategory] = await db`
      SELECT * FROM clinical_notes_categories 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Delete the category
    await db`
      DELETE FROM clinical_notes_categories
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting clinical note category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
