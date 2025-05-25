import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import type { Appointment, AppointmentFormData, AppointmentStatus } from "@/types/appointment"

export async function getUpcomingAppointments(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 10,
): Promise<Appointment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT a.*, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      WHERE a.tenant_id = ${tenantId}
      AND a.deleted_at IS NULL
      AND a.start_time >= NOW()
      ORDER BY a.start_time ASC
      LIMIT ${limit}
    `

    return result as Appointment[]
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function getAllAppointments(
  tenantId: string = DEFAULT_TENANT_ID,
  startDate?: string,
  endDate?: string,
): Promise<Appointment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT a.*, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      WHERE a.tenant_id = $1
      AND a.deleted_at IS NULL
    `

    const params: any[] = [tenantId]

    if (startDate && endDate) {
      query += ` AND a.start_time >= $2 AND a.end_time <= $3`
      params.push(startDate, endDate)
    }

    query += ` ORDER BY a.start_time ASC`

    const result = await sql.query(query, params)
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error fetching all appointments:", error)
    return []
  }
}

export async function getAppointmentById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT a.*, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      WHERE a.id = ${id}
      AND a.tenant_id = ${tenantId}
      AND a.deleted_at IS NULL
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as Appointment
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error)
    return null
  }
}

export async function createAppointment(
  data: AppointmentFormData,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check for conflicts
    const conflicts = await checkAppointmentConflicts(data.provider_id, data.start_time, data.end_time, tenantId)

    if (conflicts.length > 0) {
      throw new Error("Appointment conflicts with existing appointments")
    }

    const result = await sql`
      INSERT INTO appointments (
        tenant_id,
        patient_id,
        provider_id,
        title,
        start_time,
        end_time,
        status,
        type,
        notes,
        location,
        is_recurring,
        recurrence_pattern,
        recurrence_end_date
      ) VALUES (
        ${tenantId},
        ${data.patient_id},
        ${data.provider_id},
        ${data.title},
        ${data.start_time},
        ${data.end_time},
        ${data.status},
        ${data.type},
        ${data.notes || null},
        ${data.location || null},
        ${data.is_recurring || false},
        ${data.recurrence_pattern || null},
        ${data.recurrence_end_date || null}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    // If this is a recurring appointment, create the recurring instances
    if (data.is_recurring && data.recurrence_pattern && data.recurrence_end_date) {
      await createRecurringAppointments(result[0].id, data, tenantId)
    }

    return result[0] as Appointment
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

export async function updateAppointment(
  id: string,
  data: Partial<AppointmentFormData>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check for conflicts if changing time
    if (data.start_time && data.end_time) {
      const conflicts = await checkAppointmentConflicts(data.provider_id!, data.start_time, data.end_time, tenantId, id)

      if (conflicts.length > 0) {
        throw new Error("Appointment conflicts with existing appointments")
      }
    }

    // Build the update query dynamically
    const updateFields = []
    const params = [id, tenantId]
    let paramIndex = 3

    if (data.patient_id) {
      updateFields.push(`patient_id = $${paramIndex++}`)
      params.push(data.patient_id)
    }

    if (data.provider_id) {
      updateFields.push(`provider_id = $${paramIndex++}`)
      params.push(data.provider_id)
    }

    if (data.title) {
      updateFields.push(`title = $${paramIndex++}`)
      params.push(data.title)
    }

    if (data.start_time) {
      updateFields.push(`start_time = $${paramIndex++}`)
      params.push(data.start_time)
    }

    if (data.end_time) {
      updateFields.push(`end_time = $${paramIndex++}`)
      params.push(data.end_time)
    }

    if (data.status) {
      updateFields.push(`status = $${paramIndex++}`)
      params.push(data.status)
    }

    if (data.type) {
      updateFields.push(`type = $${paramIndex++}`)
      params.push(data.type)
    }

    if ("notes" in data) {
      updateFields.push(`notes = $${paramIndex++}`)
      params.push(data.notes || null)
    }

    if ("location" in data) {
      updateFields.push(`location = $${paramIndex++}`)
      params.push(data.location || null)
    }

    if ("is_recurring" in data) {
      updateFields.push(`is_recurring = $${paramIndex++}`)
      params.push(data.is_recurring || false)
    }

    if ("recurrence_pattern" in data) {
      updateFields.push(`recurrence_pattern = $${paramIndex++}`)
      params.push(data.recurrence_pattern || null)
    }

    if ("recurrence_end_date" in data) {
      updateFields.push(`recurrence_end_date = $${paramIndex++}`)
      params.push(data.recurrence_end_date || null)
    }

    updateFields.push(`updated_at = NOW()`)

    if (updateFields.length === 0) {
      return null
    }

    const query = `
      UPDATE appointments
      SET ${updateFields.join(", ")}
      WHERE id = $1
      AND tenant_id = $2
      AND deleted_at IS NULL
      RETURNING *
    `

    const result = await sql.query(query, params)

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Appointment
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}:`, error)
    throw error
  }
}

export async function deleteAppointment(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  hardDelete = false,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    if (hardDelete) {
      await sql`
        DELETE FROM appointments
        WHERE id = ${id}
        AND tenant_id = ${tenantId}
      `
    } else {
      await sql`
        UPDATE appointments
        SET deleted_at = NOW()
        WHERE id = ${id}
        AND tenant_id = ${tenantId}
        AND deleted_at IS NULL
      `
    }

    return true
  } catch (error) {
    console.error(`Error deleting appointment with ID ${id}:`, error)
    return false
  }
}

export async function getPatientAppointments(
  patientId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT a.*, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      WHERE a.patient_id = ${patientId}
      AND a.tenant_id = ${tenantId}
      AND a.deleted_at IS NULL
      ORDER BY a.start_time ASC
    `

    return result as Appointment[]
  } catch (error) {
    console.error(`Error fetching appointments for patient ${patientId}:`, error)
    return []
  }
}

export async function getProviderAppointments(
  providerId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  startDate?: string,
  endDate?: string,
): Promise<Appointment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT a.*, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      WHERE a.provider_id = $1
      AND a.tenant_id = $2
      AND a.deleted_at IS NULL
    `

    const params: any[] = [providerId, tenantId]

    if (startDate && endDate) {
      query += ` AND a.start_time >= $3 AND a.end_time <= $4`
      params.push(startDate, endDate)
    }

    query += ` ORDER BY a.start_time ASC`

    const result = await sql.query(query, params)
    return result.rows as Appointment[]
  } catch (error) {
    console.error(`Error fetching appointments for provider ${providerId}:`, error)
    return []
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      UPDATE appointments
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as Appointment
  } catch (error) {
    console.error(`Error updating status for appointment ${id}:`, error)
    return null
  }
}

// Helper functions

async function checkAppointmentConflicts(
  providerId: string,
  startTime: string,
  endTime: string,
  tenantId: string = DEFAULT_TENANT_ID,
  excludeAppointmentId?: string,
): Promise<Appointment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT * FROM appointments
      WHERE provider_id = $1
      AND tenant_id = $2
      AND deleted_at IS NULL
      AND status NOT IN ('cancelled', 'no-show')
      AND (
        (start_time <= $3 AND end_time > $3) OR
        (start_time < $4 AND end_time >= $4) OR
        (start_time >= $3 AND end_time <= $4)
      )
    `

    const params: any[] = [providerId, tenantId, startTime, endTime]

    if (excludeAppointmentId) {
      query += ` AND id != $5`
      params.push(excludeAppointmentId)
    }

    const result = await sql.query(query, params)
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error checking appointment conflicts:", error)
    return []
  }
}

async function createRecurringAppointments(
  parentId: string,
  data: AppointmentFormData,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<void> {
  // Implementation for creating recurring appointments
  // This would calculate dates based on recurrence pattern and create future appointments
  // For simplicity, this is a placeholder
  console.log(`Creating recurring appointments for parent ${parentId}`)
}
