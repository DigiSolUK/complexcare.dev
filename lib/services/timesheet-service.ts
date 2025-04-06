"use server"

import { sql } from "@vercel/postgres"
import type { Timesheet } from "@/types/timesheet"
import { DEFAULT_UUID, isValidUUID, getTenantId } from "../tenant-utils"

// Mock data for development and testing
const mockTimesheets: Timesheet[] = [
  {
    id: "1",
    careProfessionalId: "1",
    careProfessionalName: "Sarah Johnson",
    date: "2023-05-15",
    hoursWorked: 8,
    status: "approved",
    approvedBy: "John Manager",
    approvedAt: "2023-05-16T10:30:00Z",
    notes: "Regular shift",
    tenantId: "demo-tenant-1",
  },
  {
    id: "2",
    careProfessionalId: "2",
    careProfessionalName: "James Williams",
    date: "2023-05-15",
    hoursWorked: 6.5,
    status: "pending",
    notes: "Covered for absent colleague",
    tenantId: "demo-tenant-1",
  },
  {
    id: "3",
    careProfessionalId: "3",
    careProfessionalName: "Emily Brown",
    date: "2023-05-14",
    hoursWorked: 7,
    status: "rejected",
    approvedBy: "John Manager",
    approvedAt: "2023-05-15T09:15:00Z",
    notes: "Hours mismatch with schedule",
    tenantId: "demo-tenant-1",
  },
  {
    id: "4",
    careProfessionalId: "1",
    careProfessionalName: "Sarah Johnson",
    date: "2023-05-14",
    hoursWorked: 8,
    status: "approved",
    approvedBy: "John Manager",
    approvedAt: "2023-05-15T11:45:00Z",
    notes: "Regular shift",
    tenantId: "demo-tenant-1",
  },
  {
    id: "5",
    careProfessionalId: "4",
    careProfessionalName: "Robert Smith",
    date: "2023-05-13",
    hoursWorked: 4,
    status: "pending",
    notes: "Half day",
    tenantId: "demo-tenant-1",
  },
]

// Function to get all timesheets
export async function getTimesheets(): Promise<Timesheet[]> {
  try {
    // For development or demo mode, return mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return mockTimesheets
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Query database
    const result = await sql`
      SELECT * FROM timesheets 
      WHERE tenant_id = ${validTenantId}
      ORDER BY date DESC
    `

    return result.rows.map((row) => ({
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }))
  } catch (error) {
    console.error("Error fetching timesheets:", error)
    // Return mock data as fallback
    return mockTimesheets
  }
}

// Function to get a single timesheet by ID
export async function getTimesheet(id: string): Promise<Timesheet | null> {
  try {
    // For development or demo mode, return mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const timesheet = mockTimesheets.find((t) => t.id === id)
      return timesheet || null
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Query database
    const result = await sql`
      SELECT * FROM timesheets 
      WHERE id = ${id} AND tenant_id = ${validTenantId}
    `

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }
  } catch (error) {
    console.error(`Error fetching timesheet with ID ${id}:`, error)
    // Return null on error
    return null
  }
}

// Function to create a new timesheet
export async function createTimesheet(timesheet: Omit<Timesheet, "id" | "tenantId">): Promise<Timesheet | null> {
  try {
    // For development or demo mode, return mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const newTimesheet: Timesheet = {
        ...timesheet,
        id: (mockTimesheets.length + 1).toString(),
        tenantId: "demo-tenant-1",
      }
      mockTimesheets.push(newTimesheet)
      return newTimesheet
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Insert into database
    const result = await sql`
      INSERT INTO timesheets (
        care_professional_id, 
        care_professional_name, 
        date, 
        hours_worked, 
        status, 
        notes, 
        tenant_id
      ) VALUES (
        ${timesheet.careProfessionalId}, 
        ${timesheet.careProfessionalName}, 
        ${timesheet.date}, 
        ${timesheet.hoursWorked}, 
        ${timesheet.status || "pending"}, 
        ${timesheet.notes || ""}, 
        ${validTenantId}
      ) RETURNING *
    `

    const row = result.rows[0]
    return {
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }
  } catch (error) {
    console.error("Error creating timesheet:", error)
    // Return null on error
    return null
  }
}

// Function to update a timesheet
export async function updateTimesheet(id: string, timesheet: Partial<Timesheet>): Promise<Timesheet | null> {
  try {
    // For development or demo mode, update mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const index = mockTimesheets.findIndex((t) => t.id === id)
      if (index === -1) return null

      mockTimesheets[index] = {
        ...mockTimesheets[index],
        ...timesheet,
      }

      return mockTimesheets[index]
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Build update query dynamically based on provided fields
    let updateFields = ""
    const updateValues: any[] = []

    if (timesheet.careProfessionalId) {
      updateFields += "care_professional_id = $1, "
      updateValues.push(timesheet.careProfessionalId)
    }

    if (timesheet.careProfessionalName) {
      updateFields += "care_professional_name = $2, "
      updateValues.push(timesheet.careProfessionalName)
    }

    if (timesheet.date) {
      updateFields += "date = $3, "
      updateValues.push(timesheet.date)
    }

    if (timesheet.hoursWorked !== undefined) {
      updateFields += "hours_worked = $4, "
      updateValues.push(timesheet.hoursWorked)
    }

    if (timesheet.status) {
      updateFields += "status = $5, "
      updateValues.push(timesheet.status)
    }

    if (timesheet.approvedBy) {
      updateFields += "approved_by = $6, "
      updateValues.push(timesheet.approvedBy)
    }

    if (timesheet.approvedAt) {
      updateFields += "approved_at = $7, "
      updateValues.push(timesheet.approvedAt)
    }

    if (timesheet.notes !== undefined) {
      updateFields += "notes = $8, "
      updateValues.push(timesheet.notes)
    }

    // Remove trailing comma and space
    updateFields = updateFields.slice(0, -2)

    if (!updateFields) {
      return null // Nothing to update
    }

    // Update database
    const query = `
      UPDATE timesheets 
      SET ${updateFields}
      WHERE id = $9 AND tenant_id = $10
      RETURNING *
    `

    updateValues.push(id)
    updateValues.push(validTenantId)

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }
  } catch (error) {
    console.error(`Error updating timesheet with ID ${id}:`, error)
    // Return null on error
    return null
  }
}

// Function to delete a timesheet
export async function deleteTimesheet(id: string): Promise<boolean> {
  try {
    // For development or demo mode, delete from mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const index = mockTimesheets.findIndex((t) => t.id === id)
      if (index === -1) return false

      mockTimesheets.splice(index, 1)
      return true
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Delete from database
    const result = await sql`
      DELETE FROM timesheets 
      WHERE id = ${id} AND tenant_id = ${validTenantId}
      RETURNING id
    `

    return result.rows.length > 0
  } catch (error) {
    console.error(`Error deleting timesheet with ID ${id}:`, error)
    // Return false on error
    return false
  }
}

// Function to approve a timesheet
export async function approveTimesheet(id: string, approverName: string): Promise<Timesheet | null> {
  try {
    // For development or demo mode, update mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const index = mockTimesheets.findIndex((t) => t.id === id)
      if (index === -1) return null

      const approvedAt = new Date().toISOString()

      mockTimesheets[index] = {
        ...mockTimesheets[index],
        status: "approved",
        approvedBy: approverName,
        approvedAt,
      }

      return mockTimesheets[index]
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Update database
    const approvedAt = new Date().toISOString()

    const result = await sql`
      UPDATE timesheets 
      SET status = 'approved', approved_by = ${approverName}, approved_at = ${approvedAt}
      WHERE id = ${id} AND tenant_id = ${validTenantId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }
  } catch (error) {
    console.error(`Error approving timesheet with ID ${id}:`, error)
    // Return null on error
    return null
  }
}

// Function to reject a timesheet
export async function rejectTimesheet(id: string, approverName: string, reason: string): Promise<Timesheet | null> {
  try {
    // For development or demo mode, update mock data
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const index = mockTimesheets.findIndex((t) => t.id === id)
      if (index === -1) return null

      const approvedAt = new Date().toISOString()

      mockTimesheets[index] = {
        ...mockTimesheets[index],
        status: "rejected",
        approvedBy: approverName,
        approvedAt,
        notes: reason,
      }

      return mockTimesheets[index]
    }

    // Get tenant ID
    const tenantId = getTenantId()

    // Validate UUID format
    const validTenantId = isValidUUID(tenantId) ? tenantId : DEFAULT_UUID

    // Update database
    const approvedAt = new Date().toISOString()

    const result = await sql`
      UPDATE timesheets 
      SET status = 'rejected', approved_by = ${approverName}, approved_at = ${approvedAt}, notes = ${reason}
      WHERE id = ${id} AND tenant_id = ${validTenantId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id,
      careProfessionalId: row.care_professional_id,
      careProfessionalName: row.care_professional_name,
      date: row.date,
      hoursWorked: row.hours_worked,
      status: row.status,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      notes: row.notes,
      tenantId: row.tenant_id,
    }
  } catch (error) {
    console.error(`Error rejecting timesheet with ID ${id}:`, error)
    // Return null on error
    return null
  }
}

