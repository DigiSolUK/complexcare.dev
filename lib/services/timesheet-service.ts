import type { z } from "zod"
import { neon } from "@neondatabase/serverless"
import { createTimesheetSchema, type timesheetSchema, updateTimesheetSchema } from "../validations/schemas"
import { ensureTenantId, getCurrentTenantId } from "../tenant"

// Connect to the database
const sql = neon(process.env.DATABASE_URL || "")

export type Timesheet = z.infer<typeof timesheetSchema>
export type CreateTimesheetInput = z.infer<typeof createTimesheetSchema>
export type UpdateTimesheetInput = z.infer<typeof updateTimesheetSchema>

export async function getTimesheets(tenantId?: string, userId?: string, status?: string): Promise<Timesheet[]> {
  const validTenantId = getCurrentTenantId(tenantId)

  let query = `
    SELECT * FROM timesheets 
    WHERE tenant_id = $1
  `

  const params: any[] = [validTenantId]

  if (userId) {
    query += ` AND user_id = $${params.length + 1}`
    params.push(userId)
  }

  if (status) {
    query += ` AND status = $${params.length + 1}`
    params.push(status)
  }

  query += ` ORDER BY date DESC, created_at DESC`

  const result = await sql(query, params)

  return result.map((row) => ({
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakDuration: row.break_duration,
    status: row.status,
    notes: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function getTimesheetById(id: string, tenantId?: string): Promise<Timesheet | null> {
  const validTenantId = getCurrentTenantId(tenantId)

  const result = await sql(
    `
    SELECT * FROM timesheets 
    WHERE id = $1 AND tenant_id = $2
  `,
    [id, validTenantId],
  )

  if (result.length === 0) {
    return null
  }

  const row = result[0]

  return {
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakDuration: row.break_duration,
    status: row.status,
    notes: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function createTimesheet(data: CreateTimesheetInput): Promise<Timesheet> {
  // Validate input
  const validatedData = createTimesheetSchema.parse(data)

  // Ensure tenant ID
  const timesheet = ensureTenantId(validatedData) as CreateTimesheetInput

  const result = await sql(
    `
    INSERT INTO timesheets (
      tenant_id, user_id, date, start_time, end_time, 
      break_duration, status, notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING *
  `,
    [
      timesheet.tenantId,
      timesheet.userId,
      timesheet.date,
      timesheet.startTime,
      timesheet.endTime,
      timesheet.breakDuration,
      timesheet.status,
      timesheet.notes || null,
    ],
  )

  const row = result[0]

  return {
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakDuration: row.break_duration,
    status: row.status,
    notes: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function updateTimesheet(id: string, data: UpdateTimesheetInput, tenantId?: string): Promise<Timesheet> {
  // Validate input
  const validatedData = updateTimesheetSchema.parse(data)

  // Ensure tenant ID
  const validTenantId = getCurrentTenantId(tenantId)
  const timesheet = ensureTenantId(validatedData, validTenantId) as UpdateTimesheetInput

  // Build dynamic update query
  const updates: string[] = []
  const values: any[] = []

  // Add tenant_id as first parameter
  values.push(validTenantId)

  // Add id as second parameter
  values.push(id)

  // Start parameter index at 3
  let paramIndex = 3

  // Add each field that exists in the update data
  if (timesheet.userId !== undefined) {
    updates.push(`user_id = $${paramIndex++}`)
    values.push(timesheet.userId)
  }

  if (timesheet.date !== undefined) {
    updates.push(`date = $${paramIndex++}`)
    values.push(timesheet.date)
  }

  if (timesheet.startTime !== undefined) {
    updates.push(`start_time = $${paramIndex++}`)
    values.push(timesheet.startTime)
  }

  if (timesheet.endTime !== undefined) {
    updates.push(`end_time = $${paramIndex++}`)
    values.push(timesheet.endTime)
  }

  if (timesheet.breakDuration !== undefined) {
    updates.push(`break_duration = $${paramIndex++}`)
    values.push(timesheet.breakDuration)
  }

  if (timesheet.status !== undefined) {
    updates.push(`status = $${paramIndex++}`)
    values.push(timesheet.status)
  }

  if (timesheet.notes !== undefined) {
    updates.push(`notes = $${paramIndex++}`)
    values.push(timesheet.notes)
  }

  // Add updated_at timestamp
  updates.push(`updated_at = NOW()`)

  if (updates.length === 0) {
    throw new Error("No fields to update")
  }

  const query = `
    UPDATE timesheets 
    SET ${updates.join(", ")} 
    WHERE tenant_id = $1 AND id = $2
    RETURNING *
  `

  const result = await sql(query, values)

  if (result.length === 0) {
    throw new Error("Timesheet not found")
  }

  const row = result[0]

  return {
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakDuration: row.break_duration,
    status: row.status,
    notes: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function deleteTimesheet(id: string, tenantId?: string): Promise<boolean> {
  const validTenantId = getCurrentTenantId(tenantId)

  const result = await sql(
    `
    DELETE FROM timesheets 
    WHERE id = $1 AND tenant_id = $2
    RETURNING id
  `,
    [id, validTenantId],
  )

  return result.length > 0
}

export async function approveTimesheet(id: string, approvedBy: string, tenantId?: string): Promise<Timesheet> {
  const validTenantId = getCurrentTenantId(tenantId)

  const result = await sql(
    `
    UPDATE timesheets 
    SET 
      status = 'approved',
      approved_by = $3,
      approved_at = NOW(),
      updated_at = NOW()
    WHERE id = $1 AND tenant_id = $2
    RETURNING *
  `,
    [id, validTenantId, approvedBy],
  )

  if (result.length === 0) {
    throw new Error("Timesheet not found")
  }

  const row = result[0]

  return {
    id: row.id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakDuration: row.break_duration,
    status: row.status,
    notes: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
