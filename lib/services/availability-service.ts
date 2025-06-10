import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import type {
  ProviderAvailability,
  AvailabilityFormData,
  TimeOffRequest,
  TimeOffFormData,
  TimeOffStatus,
} from "@/types/availability"

export async function getProviderAvailability(
  providerId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ProviderAvailability[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM provider_availability
      WHERE provider_id = ${providerId}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
      ORDER BY 
        CASE WHEN day_of_week IS NULL THEN 1 ELSE 0 END,
        day_of_week,
        specific_date,
        start_time
    `

    return result as ProviderAvailability[]
  } catch (error) {
    console.error(`Error fetching availability for provider ${providerId}:`, error)
    return []
  }
}

export async function createAvailability(
  data: AvailabilityFormData,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ProviderAvailability | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check for overlapping availability
    if (data.is_available) {
      const conflicts = await checkAvailabilityConflicts(
        data.provider_id,
        data.day_of_week,
        data.specific_date,
        data.start_time,
        data.end_time,
        tenantId,
      )

      if (conflicts.length > 0) {
        throw new Error("Availability conflicts with existing schedule")
      }
    }

    const result = await sql`
      INSERT INTO provider_availability (
        tenant_id,
        provider_id,
        day_of_week,
        start_time,
        end_time,
        is_available,
        recurrence_type,
        specific_date,
        notes,
        availability_type
      ) VALUES (
        ${tenantId},
        ${data.provider_id},
        ${data.day_of_week},
        ${data.start_time},
        ${data.end_time},
        ${data.is_available},
        ${data.recurrence_type},
        ${data.specific_date || null},
        ${data.notes || null},
        ${data.availability_type}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as ProviderAvailability
  } catch (error) {
    console.error("Error creating availability:", error)
    throw error
  }
}

export async function updateAvailability(
  id: string,
  data: Partial<AvailabilityFormData>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ProviderAvailability | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check for overlapping availability if changing time or availability status
    if ((data.start_time && data.end_time) || data.is_available === true) {
      const availability = await getAvailabilityById(id, tenantId)
      if (!availability) {
        throw new Error("Availability not found")
      }

      const conflicts = await checkAvailabilityConflicts(
        data.provider_id || availability.provider_id,
        data.day_of_week !== undefined ? data.day_of_week : availability.day_of_week,
        data.specific_date !== undefined ? data.specific_date : availability.specific_date,
        data.start_time || availability.start_time,
        data.end_time || availability.end_time,
        tenantId,
        id,
      )

      if (conflicts.length > 0) {
        throw new Error("Availability conflicts with existing schedule")
      }
    }

    // Build the update query dynamically
    const updateFields = []
    const params = [id, tenantId]
    let paramIndex = 3

    if (data.provider_id) {
      updateFields.push(`provider_id = $${paramIndex++}`)
      params.push(data.provider_id)
    }

    if (data.day_of_week !== undefined) {
      updateFields.push(`day_of_week = $${paramIndex++}`)
      params.push(data.day_of_week)
    }

    if (data.start_time) {
      updateFields.push(`start_time = $${paramIndex++}`)
      params.push(data.start_time)
    }

    if (data.end_time) {
      updateFields.push(`end_time = $${paramIndex++}`)
      params.push(data.end_time)
    }

    if (data.is_available !== undefined) {
      updateFields.push(`is_available = $${paramIndex++}`)
      params.push(data.is_available)
    }

    if (data.recurrence_type) {
      updateFields.push(`recurrence_type = $${paramIndex++}`)
      params.push(data.recurrence_type)
    }

    if (data.specific_date !== undefined) {
      updateFields.push(`specific_date = $${paramIndex++}`)
      params.push(data.specific_date)
    }

    if (data.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`)
      params.push(data.notes)
    }

    if (data.availability_type) {
      updateFields.push(`availability_type = $${paramIndex++}`)
      params.push(data.availability_type)
    }

    updateFields.push(`updated_at = NOW()`)

    if (updateFields.length === 0) {
      return null
    }

    const query = `
      UPDATE provider_availability
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

    return result.rows[0] as ProviderAvailability
  } catch (error) {
    console.error(`Error updating availability with ID ${id}:`, error)
    throw error
  }
}

export async function deleteAvailability(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  hardDelete = false,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    if (hardDelete) {
      await sql`
        DELETE FROM provider_availability
        WHERE id = ${id}
        AND tenant_id = ${tenantId}
      `
    } else {
      await sql`
        UPDATE provider_availability
        SET deleted_at = NOW()
        WHERE id = ${id}
        AND tenant_id = ${tenantId}
        AND deleted_at IS NULL
      `
    }

    return true
  } catch (error) {
    console.error(`Error deleting availability with ID ${id}:`, error)
    return false
  }
}

export async function getAvailabilityById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ProviderAvailability | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM provider_availability
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as ProviderAvailability
  } catch (error) {
    console.error(`Error fetching availability with ID ${id}:`, error)
    return null
  }
}

export async function getProviderTimeOffRequests(
  providerId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  status?: TimeOffStatus,
): Promise<TimeOffRequest[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT t.*, u.first_name || ' ' || u.last_name as approved_by_name
      FROM time_off_requests t
      LEFT JOIN users u ON t.approved_by = u.id
      WHERE t.provider_id = $1
      AND t.tenant_id = $2
    `

    const params: any[] = [providerId, tenantId]

    if (status) {
      query += ` AND t.status = $3`
      params.push(status)
    }

    query += ` ORDER BY t.start_date DESC`

    const result = await sql.query(query, params)
    return result.rows as TimeOffRequest[]
  } catch (error) {
    console.error(`Error fetching time off requests for provider ${providerId}:`, error)
    return []
  }
}

export async function createTimeOffRequest(
  data: TimeOffFormData,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<TimeOffRequest | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO time_off_requests (
        tenant_id,
        provider_id,
        start_date,
        end_date,
        reason,
        status,
        notes
      ) VALUES (
        ${tenantId},
        ${data.provider_id},
        ${data.start_date},
        ${data.end_date},
        ${data.reason},
        'pending',
        ${data.notes || null}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as TimeOffRequest
  } catch (error) {
    console.error("Error creating time off request:", error)
    throw error
  }
}

export async function updateTimeOffRequestStatus(
  id: string,
  status: TimeOffStatus,
  approvedBy: string | null = null,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<TimeOffRequest | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      UPDATE time_off_requests
      SET status = $1, updated_at = NOW()
    `

    const params: any[] = [status, id, tenantId]

    if (status === "approved" && approvedBy) {
      query += `, approved_by = $4, approved_at = NOW()`
      params.push(approvedBy)
    }

    query += `
      WHERE id = $2
      AND tenant_id = $3
      RETURNING *
    `

    const result = await sql.query(query, params)

    if (result.rows.length === 0) {
      return null
    }

    // If approved, create unavailability entries
    if (status === "approved") {
      const timeOff = result.rows[0] as TimeOffRequest
      await createTimeOffAvailability(timeOff, tenantId)
    }

    return result.rows[0] as TimeOffRequest
  } catch (error) {
    console.error(`Error updating time off request status for ID ${id}:`, error)
    throw error
  }
}

export async function checkProviderAvailability(
  providerId: string,
  date: string,
  startTime: string,
  endTime: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get the day of week (1-7 for Monday-Sunday)
    const dayOfWeek = new Date(date).getDay()
    // Convert to 0-6 format where 0 is Monday
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    // First check if there are any working hours for this day
    const workingHours = await sql`
      SELECT * FROM provider_availability
      WHERE provider_id = ${providerId}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
      AND is_available = true
      AND availability_type = 'working_hours'
      AND (
        (day_of_week = ${adjustedDayOfWeek}) OR
        (specific_date = ${date})
      )
      AND start_time <= ${startTime}
      AND end_time >= ${endTime}
    `

    if (workingHours.length === 0) {
      return false // No working hours found for this time
    }

    // Then check if there are any unavailability periods that overlap
    const unavailability = await sql`
      SELECT * FROM provider_availability
      WHERE provider_id = ${providerId}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
      AND is_available = false
      AND (
        (day_of_week = ${adjustedDayOfWeek} AND recurrence_type IN ('weekly', 'biweekly', 'monthly')) OR
        (specific_date = ${date})
      )
      AND (
        (start_time <= ${startTime} AND end_time > ${startTime}) OR
        (start_time < ${endTime} AND end_time >= ${endTime}) OR
        (start_time >= ${startTime} AND end_time <= ${endTime})
      )
    `

    return unavailability.length === 0 // Available if no unavailability periods found
  } catch (error) {
    console.error(`Error checking availability for provider ${providerId}:`, error)
    return false
  }
}

// Helper functions

async function checkAvailabilityConflicts(
  providerId: string,
  dayOfWeek: number | null | undefined,
  specificDate: string | null | undefined,
  startTime: string,
  endTime: string,
  tenantId: string = DEFAULT_TENANT_ID,
  excludeAvailabilityId?: string,
): Promise<ProviderAvailability[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT * FROM provider_availability
      WHERE provider_id = $1
      AND tenant_id = $2
      AND deleted_at IS NULL
      AND is_available = true
    `

    const params: any[] = [providerId, tenantId]
    let paramIndex = 3

    if (dayOfWeek !== null && dayOfWeek !== undefined) {
      query += ` AND day_of_week = $${paramIndex++}`
      params.push(dayOfWeek)
    } else if (specificDate) {
      query += ` AND specific_date = $${paramIndex++}`
      params.push(specificDate)
    }

    query += ` AND (
      (start_time <= $${paramIndex} AND end_time > $${paramIndex}) OR
      (start_time < $${paramIndex + 1} AND end_time >= $${paramIndex + 1}) OR
      (start_time >= $${paramIndex} AND end_time <= $${paramIndex + 1})
    )`
    params.push(startTime, endTime)

    if (excludeAvailabilityId) {
      query += ` AND id != $${paramIndex + 2}`
      params.push(excludeAvailabilityId)
    }

    const result = await sql.query(query, params)
    return result.rows as ProviderAvailability[]
  } catch (error) {
    console.error("Error checking availability conflicts:", error)
    return []
  }
}

async function createTimeOffAvailability(timeOff: TimeOffRequest, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create an unavailability entry for each day in the time off period
    const startDate = new Date(timeOff.start_date)
    const endDate = new Date(timeOff.end_date)

    // Loop through each day
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split("T")[0]

      await sql`
        INSERT INTO provider_availability (
          tenant_id,
          provider_id,
          day_of_week,
          start_time,
          end_time,
          is_available,
          recurrence_type,
          specific_date,
          notes,
          availability_type
        ) VALUES (
          ${tenantId},
          ${timeOff.provider_id},
          NULL,
          '00:00:00',
          '23:59:59',
          false,
          'once',
          ${dateString},
          ${`Time off: ${timeOff.reason}`},
          'time_off'
        )
      `
    }
  } catch (error) {
    console.error("Error creating time off availability entries:", error)
    throw error
  }
}
