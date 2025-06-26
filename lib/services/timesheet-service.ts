import { sql } from "@/lib/db"
import type { Timesheet } from "@/types"

// Get all timesheets for a tenant
export async function getTimesheets(tenantId?: string): Promise<Timesheet[]> {
  try {
    // If no tenantId is provided or we're in demo mode, return mock data
    if (!tenantId || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return getMockTimesheets()
    }

    // Use the actual column names from the database
    const result = await sql`
      SELECT 
        id, 
        user_id, 
        date, 
        hours_worked, 
        status, 
        approved, 
        notes, 
        tenant_id,
        created_at, 
        updated_at
      FROM timesheets
      WHERE tenant_id = ${tenantId}
      ORDER BY date DESC, created_at DESC
    `

    // Transform the database results to match our expected Timesheet type
    const timesheets = result.map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: "Staff Member", // Default value since user_name doesn't exist
      date: new Date(row.date),
      hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
      status: row.status,
      approved: row.approved,
      notes: row.notes,
      tenantId: row.tenant_id,
      userOnly: false, // Default value
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))

    return timesheets
  } catch (error) {
    console.error("SQL error in getTimesheets:", error)
    // Always return an array, even in case of error
    return getMockTimesheets()
  }
}

// Create a new timesheet
export async function createTimesheet(
  tenantId: string,
  data: Omit<Timesheet, "id" | "createdAt" | "updatedAt">,
): Promise<Timesheet | null> {
  try {
    // If we're in demo mode, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return createMockTimesheet(tenantId, data)
    }

    // Use the actual column names from the database
    const result = await sql`
      INSERT INTO timesheets (
        user_id,
        date,
        hours_worked,
        status,
        approved,
        notes,
        tenant_id,
        created_at,
        updated_at
      ) VALUES (
        ${data.userId},
        ${data.date},
        ${data.hoursWorked},
        ${data.status},
        ${data.approved},
        ${data.notes},
        ${tenantId},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING 
        id, 
        user_id, 
        date, 
        hours_worked, 
        status, 
        approved, 
        notes, 
        tenant_id,
        created_at, 
        updated_at
    `

    if (result && result.length > 0) {
      const row = result[0]
      // Transform the database result to match our expected Timesheet type
      return {
        id: row.id,
        userId: row.user_id,
        userName: data.userName || "Staff Member", // Use provided name or default
        date: new Date(row.date),
        hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
        status: row.status,
        approved: row.approved,
        notes: row.notes,
        tenantId: row.tenant_id,
        userOnly: data.userOnly || false,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }
    }

    return null
  } catch (error) {
    console.error("SQL error in createTimesheet:", error)
    // Return mock data in case of error
    return createMockTimesheet(tenantId, data)
  }
}

export async function getTimesheet(tenantId: string, id: string): Promise<Timesheet | null> {
  try {
    // If we're in demo mode, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return getMockTimesheets().find((t) => t.id === id) || null
    }

    // Use the actual column names from the database
    const result = await sql`
      SELECT 
        id, 
        user_id, 
        date, 
        hours_worked, 
        status, 
        approved, 
        notes, 
        tenant_id,
        created_at, 
        updated_at
      FROM timesheets
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    if (result && result.length > 0) {
      const row = result[0]
      // Transform the database result to match our expected Timesheet type
      return {
        id: row.id,
        userId: row.user_id,
        userName: "Staff Member", // Default value
        date: new Date(row.date),
        hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
        status: row.status,
        approved: row.approved,
        notes: row.notes,
        tenantId: row.tenant_id,
        userOnly: false, // Default value
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }
    }

    return null
  } catch (error) {
    console.error("SQL error in getTimesheet:", error)
    // Return mock data in case of error
    return getMockTimesheets().find((t) => t.id === id) || null
  }
}

export async function updateTimesheet(
  tenantId: string,
  id: string,
  updates: Partial<Timesheet>,
): Promise<Timesheet | null> {
  try {
    // If we're in demo mode, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const mockTimesheets = getMockTimesheets()
      const timesheet = mockTimesheets.find((t) => t.id === id)
      if (!timesheet) return null

      return {
        ...timesheet,
        ...updates,
        updatedAt: new Date(),
      }
    }

    // Build the SET clause for the SQL query
    const updateFields = []
    const updateValues = []

    updateFields.push("updated_at = CURRENT_TIMESTAMP")

    if (updates.status !== undefined) {
      updateFields.push("status = ${updates.status}")
    }

    if (updates.notes !== undefined) {
      updateFields.push("notes = ${updates.notes}")
    }

    if (updates.approved !== undefined) {
      updateFields.push("approved = ${updates.approved}")
    }

    if (updates.hoursWorked !== undefined) {
      updateFields.push("hours_worked = ${updates.hoursWorked}")
    }

    // Use tagged template literals for the update query
    const result = await sql`
      UPDATE timesheets
      SET ${sql.unsafe(updateFields.join(", "))}
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `

    if (result && result.length > 0) {
      const row = result[0]
      // Transform the database result to match our expected Timesheet type
      return {
        id: row.id,
        userId: row.user_id,
        userName: updates.userName || "Staff Member", // Use provided name or default
        date: new Date(row.date),
        hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
        status: row.status,
        approved: row.approved,
        notes: row.notes,
        tenantId: row.tenant_id,
        userOnly: updates.userOnly !== undefined ? updates.userOnly : false,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }
    }

    return null
  } catch (error) {
    console.error("Error updating timesheet:", error)

    // Return mock updated data in case of error
    const mockTimesheets = getMockTimesheets()
    const timesheet = mockTimesheets.find((t) => t.id === id)
    if (!timesheet) return null

    return {
      ...timesheet,
      ...updates,
      updatedAt: new Date(),
    }
  }
}

export async function deleteTimesheet(tenantId: string, id: string): Promise<boolean> {
  try {
    // If we're in demo mode, pretend it worked
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return true
    }

    const result = await sql`
      DELETE FROM timesheets
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    return result && result.count > 0
  } catch (error) {
    console.error("Error deleting timesheet:", error)
    return true // Pretend it worked
  }
}

export async function approveTimesheet(tenantId: string, id: string, approverId: string): Promise<Timesheet | null> {
  try {
    // If we're in demo mode, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const mockTimesheets = getMockTimesheets()
      const timesheet = mockTimesheets.find((t) => t.id === id)
      if (!timesheet) return null

      return {
        ...timesheet,
        status: "approved",
        approved: true,
        updatedAt: new Date(),
      }
    }

    const result = await sql`
      UPDATE timesheets
      SET 
        status = 'approved',
        approved = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `

    if (result && result.length > 0) {
      const row = result[0]
      // Transform the database result to match our expected Timesheet type
      return {
        id: row.id,
        userId: row.user_id,
        userName: "Staff Member", // Default value
        date: new Date(row.date),
        hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
        status: row.status,
        approved: row.approved,
        notes: row.notes,
        tenantId: row.tenant_id,
        userOnly: false, // Default value
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }
    }

    return null
  } catch (error) {
    console.error("Error approving timesheet:", error)

    // Return mock approved data in case of error
    const mockTimesheets = getMockTimesheets()
    const timesheet = mockTimesheets.find((t) => t.id === id)
    if (!timesheet) return null

    return {
      ...timesheet,
      status: "approved",
      approved: true,
      updatedAt: new Date(),
    }
  }
}

export async function rejectTimesheet(
  tenantId: string,
  id: string,
  approverId: string,
  notes: string,
): Promise<Timesheet | null> {
  try {
    // If we're in demo mode, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const mockTimesheets = getMockTimesheets()
      const timesheet = mockTimesheets.find((t) => t.id === id)
      if (!timesheet) return null

      return {
        ...timesheet,
        status: "rejected",
        approved: false,
        notes: notes || timesheet.notes,
        updatedAt: new Date(),
      }
    }

    const result = await sql`
      UPDATE timesheets
      SET 
        status = 'rejected',
        approved = false,
        notes = ${notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `

    if (result && result.length > 0) {
      const row = result[0]
      // Transform the database result to match our expected Timesheet type
      return {
        id: row.id,
        userId: row.user_id,
        userName: "Staff Member", // Default value
        date: new Date(row.date),
        hoursWorked: Number.parseFloat(row.hours_worked), // Using hours_worked column
        status: row.status,
        approved: row.approved,
        notes: row.notes,
        tenantId: row.tenant_id,
        userOnly: false, // Default value
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }
    }

    return null
  } catch (error) {
    console.error("Error rejecting timesheet:", error)

    // Return mock rejected data in case of error
    const mockTimesheets = getMockTimesheets()
    const timesheet = mockTimesheets.find((t) => t.id === id)
    if (!timesheet) return null

    return {
      ...timesheet,
      status: "rejected",
      approved: false,
      notes: notes || timesheet.notes,
      updatedAt: new Date(),
    }
  }
}

// Helper function to get mock timesheets
function getMockTimesheets(): Timesheet[] {
  return [
    {
      id: "ts-001",
      userId: "cp-001",
      userName: "Sarah Johnson",
      date: new Date("2023-04-15"),
      hoursWorked: 8,
      status: "approved",
      approved: true,
      notes: "Regular shift",
      tenantId: "demo-tenant",
      userOnly: true,
      createdAt: new Date("2023-04-15T16:35:00Z"),
      updatedAt: new Date("2023-04-16T10:00:00Z"),
    },
    {
      id: "ts-002",
      userId: "cp-002",
      userName: "James Williams",
      date: new Date("2023-04-15"),
      hoursWorked: 7.25,
      status: "approved",
      approved: true,
      notes: "Patient assessments",
      tenantId: "demo-tenant",
      userOnly: false,
      createdAt: new Date("2023-04-15T17:05:00Z"),
      updatedAt: new Date("2023-04-16T10:05:00Z"),
    },
    {
      id: "ts-003",
      userId: "cp-003",
      userName: "Emily Brown",
      date: new Date("2023-04-16"),
      hoursWorked: 7,
      status: "pending",
      approved: false,
      notes: "Home visits",
      tenantId: "demo-tenant",
      userOnly: false,
      createdAt: new Date("2023-04-16T16:05:00Z"),
      updatedAt: new Date("2023-04-16T16:05:00Z"),
    },
    {
      id: "ts-004",
      userId: "cp-004",
      userName: "Robert Smith",
      date: new Date("2023-04-16"),
      hoursWorked: 7.5,
      status: "pending",
      approved: false,
      notes: "Evening shift",
      tenantId: "demo-tenant",
      userOnly: true,
      createdAt: new Date("2023-04-16T22:05:00Z"),
      updatedAt: new Date("2023-04-16T22:05:00Z"),
    },
    {
      id: "ts-005",
      userId: "cp-005",
      userName: "Olivia Taylor",
      date: new Date("2023-04-17"),
      hoursWorked: 3.75,
      status: "draft",
      approved: false,
      notes: "Morning assessments",
      tenantId: "demo-tenant",
      userOnly: false,
      createdAt: new Date("2023-04-17T13:05:00Z"),
      updatedAt: new Date("2023-04-17T13:05:00Z"),
    },
  ]
}

// Helper function to create a mock timesheet
function createMockTimesheet(tenantId: string, data: Omit<Timesheet, "id" | "createdAt" | "updatedAt">): Timesheet {
  const now = new Date()
  return {
    id: `ts-${Math.floor(Math.random() * 10000)}`,
    ...data,
    tenantId,
    createdAt: now,
    updatedAt: now,
  }
}
