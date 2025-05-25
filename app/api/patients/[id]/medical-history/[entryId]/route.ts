import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logActivity } from "@/lib/services/activity-log-service"

// GET /api/patients/[id]/medical-history/[entryId]
export async function GET(request: NextRequest, { params }: { params: { id: string; entryId: string } }) {
  try {
    const { id: patientId, entryId } = params

    const result = await db.query(
      `SELECT * FROM patient_medical_history 
       WHERE id = $1 AND patient_id = $2`,
      [entryId, patientId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Medical history entry not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching medical history entry:", error)
    return NextResponse.json({ error: "Failed to fetch medical history entry" }, { status: 500 })
  }
}

// PATCH /api/patients/[id]/medical-history/[entryId]
export async function PATCH(request: NextRequest, { params }: { params: { id: string; entryId: string } }) {
  try {
    const { id: patientId, entryId } = params
    const data = await request.json()

    // Build the update query dynamically based on provided fields
    const updateFields: string[] = []
    const queryParams: any[] = []
    let paramIndex = 1

    // Add each field that needs to be updated
    if (data.category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`)
      queryParams.push(data.category)
    }

    if (data.title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`)
      queryParams.push(data.title)
    }

    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`)
      queryParams.push(data.description)
    }

    if (data.onsetDate !== undefined) {
      updateFields.push(`onset_date = $${paramIndex++}`)
      queryParams.push(new Date(data.onsetDate))
    }

    if (data.endDate !== undefined) {
      updateFields.push(`end_date = $${paramIndex++}`)
      queryParams.push(data.endDate ? new Date(data.endDate) : null)
    }

    if (data.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`)
      queryParams.push(data.status)
    }

    if (data.severity !== undefined) {
      updateFields.push(`severity = $${paramIndex++}`)
      queryParams.push(data.severity)
    }

    if (data.provider !== undefined) {
      updateFields.push(`provider = $${paramIndex++}`)
      queryParams.push(data.provider)
    }

    if (data.location !== undefined) {
      updateFields.push(`location = $${paramIndex++}`)
      queryParams.push(data.location)
    }

    if (data.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`)
      queryParams.push(data.notes)
    }

    // Always update the updated_at and updated_by fields
    updateFields.push(`updated_at = $${paramIndex++}`)
    queryParams.push(new Date())

    updateFields.push(`updated_by = $${paramIndex++}`)
    queryParams.push(data.updatedBy || "system")

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Add the WHERE clause parameters
    queryParams.push(entryId)
    queryParams.push(patientId)

    const query = `
      UPDATE patient_medical_history 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex++} AND patient_id = $${paramIndex++} 
      RETURNING *
    `

    const result = await db.query(query, queryParams)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Medical history entry not found" }, { status: 404 })
    }

    const updatedEntry = result.rows[0]

    // Log activity
    await logActivity({
      tenantId: "system", // This should be replaced with actual tenant ID
      activityType: "medical_history_updated",
      description: `Medical history entry updated: ${updatedEntry.title}`,
      patientId,
      userId: data.updatedBy || "system",
      metadata: {
        entryId,
        updatedFields: Object.keys(data).filter((key) => key !== "updatedBy"),
      },
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("Error updating medical history entry:", error)
    return NextResponse.json({ error: "Failed to update medical history entry" }, { status: 500 })
  }
}

// DELETE /api/patients/[id]/medical-history/[entryId]
export async function DELETE(request: NextRequest, { params }: { params: { id: string; entryId: string } }) {
  try {
    const { id: patientId, entryId } = params

    // Get the entry before deleting for logging
    const getResult = await db.query(
      `SELECT * FROM patient_medical_history 
       WHERE id = $1 AND patient_id = $2`,
      [entryId, patientId],
    )

    if (getResult.rows.length === 0) {
      return NextResponse.json({ error: "Medical history entry not found" }, { status: 404 })
    }

    const entryToDelete = getResult.rows[0]

    // Delete the entry
    await db.query(
      `DELETE FROM patient_medical_history 
       WHERE id = $1 AND patient_id = $2`,
      [entryId, patientId],
    )

    // Log activity
    await logActivity({
      tenantId: "system", // This should be replaced with actual tenant ID
      activityType: "medical_history_deleted",
      description: `Medical history entry deleted: ${entryToDelete.title}`,
      patientId,
      metadata: {
        entryId,
        title: entryToDelete.title,
        category: entryToDelete.category,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting medical history entry:", error)
    return NextResponse.json({ error: "Failed to delete medical history entry" }, { status: 500 })
  }
}
