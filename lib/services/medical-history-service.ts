import { db } from "@/lib/db"
import type { MedicalHistoryEntry, MedicalHistoryFilter } from "@/types/medical-history"
import { logActivity } from "./activity-log-service"

export class MedicalHistoryService {
  /**
   * Get all medical history entries for a patient with optional filtering
   */
  static async getMedicalHistory(
    patientId: string,
    tenantId: string,
    filter?: MedicalHistoryFilter,
  ): Promise<MedicalHistoryEntry[]> {
    try {
      // Build the query
      let query = `
        SELECT * FROM patient_medical_history 
        WHERE patient_id = $1 AND tenant_id = $2
      `

      const queryParams: any[] = [patientId, tenantId]
      let paramIndex = 3

      if (filter) {
        if (filter.category) {
          query += ` AND category = $${paramIndex}`
          queryParams.push(filter.category)
          paramIndex++
        }

        if (filter.status) {
          query += ` AND status = $${paramIndex}`
          queryParams.push(filter.status)
          paramIndex++
        }

        if (filter.severity) {
          query += ` AND severity = $${paramIndex}`
          queryParams.push(filter.severity)
          paramIndex++
        }

        if (filter.startDate) {
          query += ` AND onset_date >= $${paramIndex}`
          queryParams.push(filter.startDate)
          paramIndex++
        }

        if (filter.endDate) {
          query += ` AND (end_date <= $${paramIndex} OR end_date IS NULL)`
          queryParams.push(filter.endDate)
          paramIndex++
        }

        if (filter.searchTerm) {
          query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR notes ILIKE $${paramIndex})`
          queryParams.push(`%${filter.searchTerm}%`)
          paramIndex++
        }
      }

      query += ` ORDER BY onset_date DESC`

      const result = await db.query(query, queryParams)

      // Map the database results to our type
      return result.rows.map((row) => ({
        id: row.id,
        patientId: row.patient_id,
        category: row.category,
        title: row.title,
        description: row.description,
        onsetDate: new Date(row.onset_date),
        endDate: row.end_date ? new Date(row.end_date) : undefined,
        status: row.status,
        severity: row.severity,
        provider: row.provider,
        location: row.location,
        notes: row.notes,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        createdBy: row.created_by,
        updatedBy: row.updated_by,
      }))
    } catch (error) {
      console.error("Error in getMedicalHistory:", error)
      throw new Error("Failed to fetch medical history")
    }
  }

  /**
   * Get a specific medical history entry
   */
  static async getMedicalHistoryEntry(
    entryId: string,
    patientId: string,
    tenantId: string,
  ): Promise<MedicalHistoryEntry | null> {
    try {
      const result = await db.query(
        `SELECT * FROM patient_medical_history 
         WHERE id = $1 AND patient_id = $2 AND tenant_id = $3`,
        [entryId, patientId, tenantId],
      )

      if (result.rows.length === 0) {
        return null
      }

      const row = result.rows[0]

      return {
        id: row.id,
        patientId: row.patient_id,
        category: row.category,
        title: row.title,
        description: row.description,
        onsetDate: new Date(row.onset_date),
        endDate: row.end_date ? new Date(row.end_date) : undefined,
        status: row.status,
        severity: row.severity,
        provider: row.provider,
        location: row.location,
        notes: row.notes,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        createdBy: row.created_by,
        updatedBy: row.updated_by,
      }
    } catch (error) {
      console.error("Error in getMedicalHistoryEntry:", error)
      throw new Error("Failed to fetch medical history entry")
    }
  }

  /**
   * Create a new medical history entry
   */
  static async createMedicalHistoryEntry(
    data: Partial<MedicalHistoryEntry>,
    patientId: string,
    tenantId: string,
    userId: string,
  ): Promise<MedicalHistoryEntry> {
    try {
      // Validate required fields
      if (!data.title || !data.category || !data.status || !data.onsetDate) {
        throw new Error("Missing required fields")
      }

      const result = await db.query(
        `INSERT INTO patient_medical_history (
          patient_id,
          tenant_id,
          category,
          title,
          description,
          onset_date,
          end_date,
          status,
          severity,
          provider,
          location,
          notes,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          patientId,
          tenantId,
          data.category,
          data.title,
          data.description || null,
          data.onsetDate,
          data.endDate || null,
          data.status,
          data.severity || null,
          data.provider || null,
          data.location || null,
          data.notes || null,
          userId,
        ],
      )

      const newEntry = result.rows[0]

      // Log activity
      await logActivity({
        tenantId,
        activityType: "medical_history_added",
        description: `Medical history entry added: ${data.title}`,
        patientId,
        userId,
        metadata: {
          entryId: newEntry.id,
          category: data.category,
          title: data.title,
        },
      })

      return {
        id: newEntry.id,
        patientId: newEntry.patient_id,
        category: newEntry.category,
        title: newEntry.title,
        description: newEntry.description,
        onsetDate: new Date(newEntry.onset_date),
        endDate: newEntry.end_date ? new Date(newEntry.end_date) : undefined,
        status: newEntry.status,
        severity: newEntry.severity,
        provider: newEntry.provider,
        location: newEntry.location,
        notes: newEntry.notes,
        createdAt: new Date(newEntry.created_at),
        updatedAt: new Date(newEntry.updated_at),
        createdBy: newEntry.created_by,
        updatedBy: newEntry.updated_by,
      }
    } catch (error) {
      console.error("Error in createMedicalHistoryEntry:", error)
      throw new Error("Failed to create medical history entry")
    }
  }

  /**
   * Update a medical history entry
   */
  static async updateMedicalHistoryEntry(
    entryId: string,
    data: Partial<MedicalHistoryEntry>,
    patientId: string,
    tenantId: string,
    userId: string,
  ): Promise<MedicalHistoryEntry | null> {
    try {
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
        queryParams.push(data.onsetDate)
      }

      if (data.endDate !== undefined) {
        updateFields.push(`end_date = $${paramIndex++}`)
        queryParams.push(data.endDate)
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
      queryParams.push(userId)

      // If no fields to update, return error
      if (updateFields.length === 0) {
        throw new Error("No fields to update")
      }

      // Add the WHERE clause parameters
      queryParams.push(entryId)
      queryParams.push(patientId)
      queryParams.push(tenantId)

      const query = `
        UPDATE patient_medical_history 
        SET ${updateFields.join(", ")} 
        WHERE id = $${paramIndex++} AND patient_id = $${paramIndex++} AND tenant_id = $${paramIndex++}
        RETURNING *
      `

      const result = await db.query(query, queryParams)

      if (result.rows.length === 0) {
        return null
      }

      const updatedEntry = result.rows[0]

      // Log activity
      await logActivity({
        tenantId,
        activityType: "medical_history_updated",
        description: `Medical history entry updated: ${updatedEntry.title}`,
        patientId,
        userId,
        metadata: {
          entryId,
          updatedFields: Object.keys(data),
        },
      })

      return {
        id: updatedEntry.id,
        patientId: updatedEntry.patient_id,
        category: updatedEntry.category,
        title: updatedEntry.title,
        description: updatedEntry.description,
        onsetDate: new Date(updatedEntry.onset_date),
        endDate: updatedEntry.end_date ? new Date(updatedEntry.end_date) : undefined,
        status: updatedEntry.status,
        severity: updatedEntry.severity,
        provider: updatedEntry.provider,
        location: updatedEntry.location,
        notes: updatedEntry.notes,
        createdAt: new Date(updatedEntry.created_at),
        updatedAt: new Date(updatedEntry.updated_at),
        createdBy: updatedEntry.created_by,
        updatedBy: updatedEntry.updated_by,
      }
    } catch (error) {
      console.error("Error in updateMedicalHistoryEntry:", error)
      throw new Error("Failed to update medical history entry")
    }
  }

  /**
   * Delete a medical history entry
   */
  static async deleteMedicalHistoryEntry(
    entryId: string,
    patientId: string,
    tenantId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      // Get the entry before deleting for logging
      const getResult = await db.query(
        `SELECT * FROM patient_medical_history 
         WHERE id = $1 AND patient_id = $2 AND tenant_id = $3`,
        [entryId, patientId, tenantId],
      )

      if (getResult.rows.length === 0) {
        return false
      }

      const entryToDelete = getResult.rows[0]

      // Delete the entry
      await db.query(
        `DELETE FROM patient_medical_history 
         WHERE id = $1 AND patient_id = $2 AND tenant_id = $3`,
        [entryId, patientId, tenantId],
      )

      // Log activity
      await logActivity({
        tenantId,
        activityType: "medical_history_deleted",
        description: `Medical history entry deleted: ${entryToDelete.title}`,
        patientId,
        userId,
        metadata: {
          entryId,
          title: entryToDelete.title,
          category: entryToDelete.category,
        },
      })

      return true
    } catch (error) {
      console.error("Error in deleteMedicalHistoryEntry:", error)
      throw new Error("Failed to delete medical history entry")
    }
  }

  /**
   * Get medical history statistics for a patient
   */
  static async getMedicalHistoryStats(patientId: string, tenantId: string): Promise<any> {
    try {
      // Get count by category
      const categoryStats = await db.query(
        `SELECT category, COUNT(*) as count 
         FROM patient_medical_history 
         WHERE patient_id = $1 AND tenant_id = $2 
         GROUP BY category`,
        [patientId, tenantId],
      )

      // Get count by status
      const statusStats = await db.query(
        `SELECT status, COUNT(*) as count 
         FROM patient_medical_history 
         WHERE patient_id = $1 AND tenant_id = $2 
         GROUP BY status`,
        [patientId, tenantId],
      )

      // Get count by severity
      const severityStats = await db.query(
        `SELECT severity, COUNT(*) as count 
         FROM patient_medical_history 
         WHERE patient_id = $1 AND tenant_id = $2 AND severity IS NOT NULL
         GROUP BY severity`,
        [patientId, tenantId],
      )

      // Get total count
      const totalResult = await db.query(
        `SELECT COUNT(*) as total 
         FROM patient_medical_history 
         WHERE patient_id = $1 AND tenant_id = $2`,
        [patientId, tenantId],
      )

      return {
        total: Number.parseInt(totalResult.rows[0].total),
        byCategory: categoryStats.rows.reduce((acc, row) => {
          acc[row.category] = Number.parseInt(row.count)
          return acc
        }, {}),
        byStatus: statusStats.rows.reduce((acc, row) => {
          acc[row.status] = Number.parseInt(row.count)
          return acc
        }, {}),
        bySeverity: severityStats.rows.reduce((acc, row) => {
          acc[row.severity] = Number.parseInt(row.count)
          return acc
        }, {}),
      }
    } catch (error) {
      console.error("Error in getMedicalHistoryStats:", error)
      throw new Error("Failed to fetch medical history statistics")
    }
  }
}
