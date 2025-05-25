import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id

    // Get allergies for the patient
    const allergies = await sql`
      SELECT 
        id, 
        allergen, 
        reaction_type, 
        severity, 
        date_identified, 
        notes, 
        is_active,
        created_at,
        updated_at
      FROM patient_allergies
      WHERE patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
      ORDER BY is_active DESC, severity DESC, allergen ASC
    `

    return NextResponse.json(allergies)
  } catch (error) {
    console.error("Error fetching patient allergies:", error)
    return NextResponse.json({ error: "Failed to fetch patient allergies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const data = await request.json()
    const userId = session.user.id

    // Validate required fields
    if (!data.allergen || !data.reaction_type || !data.severity) {
      return NextResponse.json({ error: "Allergen, reaction type, and severity are required" }, { status: 400 })
    }

    // Insert new allergy record
    const result = await sql`
      INSERT INTO patient_allergies (
        patient_id, 
        allergen, 
        reaction_type, 
        severity, 
        date_identified, 
        notes, 
        is_active,
        tenant_id,
        created_by,
        updated_by
      ) VALUES (
        ${Number.parseInt(patientId)}, 
        ${data.allergen}, 
        ${data.reaction_type}, 
        ${data.severity}, 
        ${data.date_identified || null}, 
        ${data.notes || null}, 
        ${data.is_active !== undefined ? data.is_active : true},
        ${tenantId},
        ${userId},
        ${userId}
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        id: result[0].id,
        message: "Allergy record created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating patient allergy:", error)
    return NextResponse.json({ error: "Failed to create patient allergy" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const data = await request.json()
    const userId = session.user.id

    if (!data.id) {
      return NextResponse.json({ error: "Allergy record ID is required" }, { status: 400 })
    }

    // Update allergy record
    await sql`
      UPDATE patient_allergies
      SET 
        allergen = ${data.allergen},
        reaction_type = ${data.reaction_type},
        severity = ${data.severity},
        date_identified = ${data.date_identified || null},
        notes = ${data.notes || null},
        is_active = ${data.is_active !== undefined ? data.is_active : true},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${userId}
      WHERE id = ${data.id}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Allergy record updated successfully",
    })
  } catch (error) {
    console.error("Error updating patient allergy:", error)
    return NextResponse.json({ error: "Failed to update patient allergy" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const url = new URL(request.url)
    const recordId = url.searchParams.get("recordId")

    if (!recordId) {
      return NextResponse.json({ error: "Allergy record ID is required" }, { status: 400 })
    }

    // Delete allergy record
    await sql`
      DELETE FROM patient_allergies
      WHERE id = ${Number.parseInt(recordId)}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Allergy record deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting patient allergy:", error)
    return NextResponse.json({ error: "Failed to delete patient allergy" }, { status: 500 })
  }
}
