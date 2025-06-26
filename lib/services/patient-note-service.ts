import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/auth"
import type { PatientNote } from "@/types"

const sql = neon(process.env.DATABASE_URL!)

export async function createPatientNote(
  tenantId: string,
  patientId: string,
  noteData: {
    care_professional_id: string
    note_type: string
    content: string
    is_private: boolean
  },
): Promise<PatientNote | null> {
  try {
    const session = await getSession()
    const createdBy = session?.user?.id

    if (!createdBy) {
      throw new Error("User not authenticated.")
    }

    const [newNote] = await sql<PatientNote[]>`
      INSERT INTO patient_notes (
        tenant_id, patient_id, care_professional_id, note_type, content, is_private, created_by
      ) VALUES (
        ${tenantId}, ${patientId}, ${noteData.care_professional_id}, ${noteData.note_type}, ${noteData.content}, ${noteData.is_private}, ${createdBy}
      )
      RETURNING id, tenant_id, patient_id, care_professional_id, note_date, note_type, content, is_private, created_at, updated_at, created_by, updated_by;
    `
    return newNote || null
  } catch (error) {
    console.error("Error creating patient note:", error)
    throw error
  }
}

export async function getPatientNotesByPatientId(tenantId: string, patientId: string): Promise<PatientNote[]> {
  try {
    const notes = await sql<PatientNote[]>`
      SELECT
        pn.id,
        pn.tenant_id,
        pn.patient_id,
        pn.care_professional_id,
        pn.note_date,
        pn.note_type,
        pn.content,
        pn.is_private,
        pn.created_at,
        pn.updated_at,
        pn.created_by,
        pn.updated_by,
        cp.first_name || ' ' || cp.last_name AS care_professional_name
      FROM patient_notes pn
      JOIN care_professionals cp ON pn.care_professional_id = cp.id
      WHERE pn.tenant_id = ${tenantId} AND pn.patient_id = ${patientId}
      ORDER BY pn.note_date DESC;
    `
    return notes
  } catch (error) {
    console.error(`Error getting patient notes for patient ${patientId}:`, error)
    throw error
  }
}

export async function getPatientNoteById(tenantId: string, noteId: string): Promise<PatientNote | null> {
  try {
    const [note] = await sql<PatientNote[]>`
      SELECT
        pn.id,
        pn.tenant_id,
        pn.patient_id,
        pn.care_professional_id,
        pn.note_date,
        pn.note_type,
        pn.content,
        pn.is_private,
        pn.created_at,
        pn.updated_at,
        pn.created_by,
        pn.updated_by,
        cp.first_name || ' ' || cp.last_name AS care_professional_name
      FROM patient_notes pn
      JOIN care_professionals cp ON pn.care_professional_id = cp.id
      WHERE pn.tenant_id = ${tenantId} AND pn.id = ${noteId};
    `
    return note || null
  } catch (error) {
    console.error(`Error getting patient note ${noteId}:`, error)
    throw error
  }
}

export async function updatePatientNote(
  tenantId: string,
  noteId: string,
  noteData: {
    note_type?: string
    content?: string
    is_private?: boolean
  },
): Promise<PatientNote | null> {
  try {
    const session = await getSession()
    const updatedBy = session?.user?.id

    if (!updatedBy) {
      throw new Error("User not authenticated.")
    }

    const fieldsToUpdate = []
    const values = []
    let paramIndex = 1

    if (noteData.note_type !== undefined) {
      fieldsToUpdate.push(`note_type = $${paramIndex++}`)
      values.push(noteData.note_type)
    }
    if (noteData.content !== undefined) {
      fieldsToUpdate.push(`content = $${paramIndex++}`)
      values.push(noteData.content)
    }
    if (noteData.is_private !== undefined) {
      fieldsToUpdate.push(`is_private = $${paramIndex++}`)
      values.push(noteData.is_private)
    }

    fieldsToUpdate.push(`updated_by = $${paramIndex++}`)
    values.push(updatedBy)
    fieldsToUpdate.push(`updated_at = NOW()`)

    if (fieldsToUpdate.length === 0) {
      return getPatientNoteById(tenantId, noteId) // No fields to update
    }

    values.push(noteId, tenantId) // Add id and tenant_id for WHERE clause

    const [updatedNote] = await sql.unsafe<PatientNote[]>(
      `
      UPDATE patient_notes
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex++}
      RETURNING id, tenant_id, patient_id, care_professional_id, note_date, note_type, content, is_private, created_at, updated_at, created_by, updated_by;
    `,
      values,
    )

    return updatedNote || null
  } catch (error) {
    console.error(`Error updating patient note ${noteId}:`, error)
    throw error
  }
}

export async function deletePatientNote(tenantId: string, noteId: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM patient_notes
      WHERE id = ${noteId} AND tenant_id = ${tenantId};
    `
    return result.count > 0
  } catch (error) {
    console.error(`Error deleting patient note ${noteId}:`, error)
    throw error
  }
}
