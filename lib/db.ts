import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Create a SQL client with the database URL from environment variables
const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL ||
    process.env.production_DATABASE_URL ||
    process.env.production_POSTGRES_URL ||
    process.env.AUTH_DATABASE_URL
  )
}

// Use the production database URL
// const DATABASE_URL =
//   process.env.DATABASE_URL || process.env.production_DATABASE_URL || process.env.production_POSTGRES_URL

// Create a SQL client using the Neon serverless driver
export const sql = neon(getDatabaseUrl()!)

// Legacy alias for compatibility
export const db = sql

// Execute a query with tenant isolation
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
  tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c",
): Promise<T[]> {
  try {
    // Add tenant_id to WHERE clause if not already present
    let modifiedQuery = query
    if (!query.includes("tenant_id =") && !query.toLowerCase().includes("select version()")) {
      // This is a simplified approach - in a real app, you'd need more sophisticated parsing
      const whereIndex = query.toUpperCase().indexOf("WHERE")
      if (whereIndex !== -1) {
        modifiedQuery = `${query.substring(0, whereIndex + 5)} tenant_id = '${tenantId}' AND ${query.substring(whereIndex + 5)}`
      } else {
        // If there's no WHERE clause, add one before ORDER BY, GROUP BY, LIMIT, etc.
        const orderByIndex = query.toUpperCase().indexOf("ORDER BY")
        const groupByIndex = query.toUpperCase().indexOf("GROUP BY")
        const limitIndex = query.toUpperCase().indexOf("LIMIT")

        let insertIndex = query.length
        if (orderByIndex !== -1) insertIndex = Math.min(insertIndex, orderByIndex)
        if (groupByIndex !== -1) insertIndex = Math.min(insertIndex, groupByIndex)
        if (limitIndex !== -1) insertIndex = Math.min(insertIndex, limitIndex)

        modifiedQuery = `${query.substring(0, insertIndex)} WHERE tenant_id = '${tenantId}' ${query.substring(insertIndex)}`
      }
    }

    console.log("Executing query:", modifiedQuery)
    const result = await sql.query(modifiedQuery, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)
    // In public mode, return empty array instead of throwing
    return []
  }
}

// Helper function to get a connection with tenant context
export async function withTenant(tenantId = DEFAULT_TENANT_ID) {
  return {
    query: async (text: string, params: any[] = []) => {
      try {
        const result = await sql.query(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        throw error
      }
    },
  }
}

// Helper function to execute a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  try {
    await sql.query("BEGIN")
    const result = await callback(sql)
    await sql.query("COMMIT")
    return result
  } catch (error) {
    await sql.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  }
}

// Generic CRUD operations
export async function getById(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<any | null> {
  try {
    const result = await sql`
      SELECT * FROM ${sql(table)}
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
    `
    return result[0] || null
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error)
    return null
  }
}

export async function insert(
  table: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any | null> {
  try {
    const dataWithTenant = { ...data, tenant_id: tenantId }
    const columns = Object.keys(dataWithTenant)
    const values = Object.values(dataWithTenant)

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${columns.map((_, i) => `$${i + 1}`).join(", ")})
      RETURNING *
    `

    const result = await sql.query(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any | null> {
  try {
    const updateFields = Object.keys(data)
      .map((key, i) => `${key} = $${i + 3}`)
      .join(", ")

    const query = `
      UPDATE ${table}
      SET ${updateFields}, updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *
    `

    const values = [id, tenantId, ...Object.values(data)]
    const result = await sql.query(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    throw error
  }
}

export async function remove(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  softDelete = true,
): Promise<boolean> {
  try {
    if (softDelete) {
      await sql`
        UPDATE ${sql(table)}
        SET deleted_at = NOW(), updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `
    } else {
      await sql`
        DELETE FROM ${sql(table)}
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `
    }
    return true
  } catch (error) {
    console.error(`Error removing from ${table}:`, error)
    return false
  }
}

// Helper function to sanitize SQL inputs
export function sanitize(input: string): string {
  if (!input) return ""
  return input.replace(/'/g, "''")
}

// Helper function to build a WHERE clause with filters
export function buildWhereClause(
  filters: Record<string, any>,
  tenantId = DEFAULT_TENANT_ID,
): {
  whereClause: string
  params: any[]
} {
  const conditions: string[] = ["tenant_id = $1", "deleted_at IS NULL"]
  const params: any[] = [tenantId]

  let paramIndex = 2

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string" && value.includes("%")) {
        // Handle LIKE queries
        conditions.push(`${key} ILIKE $${paramIndex}`)
      } else {
        conditions.push(`${key} = $${paramIndex}`)
      }
      params.push(value)
      paramIndex++
    }
  }

  return {
    whereClause: conditions.join(" AND "),
    params,
  }
}

// Mock data for public mode
export const mockData = {
  patients: [
    {
      id: "p1",
      tenant_id: "tenant-1",
      first_name: "John",
      last_name: "Doe",
      date_of_birth: "1980-01-15",
      gender: "Male",
      nhs_number: "NHS12345",
      contact_number: "+44 7700 900123",
      email: "john.doe@example.com",
      address: "123 Main St, London",
      postcode: "SW1A 1AA",
      primary_condition: "Diabetes Type 2",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
    {
      id: "p2",
      tenant_id: "tenant-1",
      first_name: "Jane",
      last_name: "Smith",
      date_of_birth: "1975-06-22",
      gender: "Female",
      nhs_number: "NHS67890",
      contact_number: "+44 7700 900456",
      email: "jane.smith@example.com",
      address: "456 High St, Manchester",
      postcode: "M1 1AA",
      primary_condition: "Hypertension",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    },
  ],
  care_professionals: [
    {
      id: "cp1",
      tenant_id: "tenant-1",
      first_name: "David",
      last_name: "Wilson",
      title: "Dr.",
      email: "david.wilson@example.com",
      phone_number: "+44 7700 900789",
      role: "General Practitioner",
      specialization: "Family Medicine",
      qualifications: "MBBS, MRCGP",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "cp2",
      tenant_id: "tenant-1",
      first_name: "Sarah",
      last_name: "Johnson",
      title: "Nurse",
      email: "sarah.johnson@example.com",
      phone_number: "+44 7700 900321",
      role: "Registered Nurse",
      specialization: "Diabetes Care",
      qualifications: "RN, BSc Nursing",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  appointments: [
    {
      id: "a1",
      tenant_id: "tenant-1",
      patient_id: "p1",
      care_professional_id: "cp1",
      appointment_date: "2023-06-15",
      appointment_time: "09:00:00",
      end_time: "09:30:00",
      duration_minutes: 30,
      status: "completed",
      appointment_type: "Check-up",
      location: "Main Hospital, Room 101",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "a2",
      tenant_id: "tenant-1",
      patient_id: "p2",
      care_professional_id: "cp2",
      appointment_date: "2023-06-16",
      appointment_time: "14:00:00",
      end_time: "14:45:00",
      duration_minutes: 45,
      status: "scheduled",
      appointment_type: "Treatment",
      location: "North Clinic, Room 203",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  clinical_notes: [
    {
      id: "cn1",
      tenant_id: "tenant-1",
      patient_id: "p1",
      author_id: "cp1",
      category_id: "cat1",
      title: "Initial Assessment",
      content:
        "Patient presents with elevated blood glucose levels. Recommended dietary changes and increased physical activity.",
      is_private: false,
      is_important: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    },
    {
      id: "cn2",
      tenant_id: "tenant-1",
      patient_id: "p2",
      author_id: "cp2",
      category_id: "cat2",
      title: "Blood Pressure Check",
      content:
        "Blood pressure reading: 140/90 mmHg. Slightly elevated. Recommended stress reduction techniques and follow-up in 2 weeks.",
      is_private: false,
      is_important: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    },
  ],
  tasks: [
    {
      id: "t1",
      tenant_id: "tenant-1",
      title: "Follow up with John Doe",
      description: "Call to check on blood glucose levels",
      status: "pending",
      priority: "high",
      due_date: "2023-06-20",
      assigned_to: "cp2",
      created_by: "cp1",
      related_to_id: "p1",
      related_to_type: "patient",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "t2",
      tenant_id: "tenant-1",
      title: "Review Jane Smith's medication",
      description: "Check effectiveness of current hypertension medication",
      status: "in_progress",
      priority: "medium",
      due_date: "2023-06-18",
      assigned_to: "cp1",
      created_by: "cp1",
      related_to_id: "p2",
      related_to_type: "patient",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
}

// Override executeQuery for public mode to return mock data
export async function getMockData<T = any>(tableName: string, tenantId = "tenant-1"): Promise<T[]> {
  // Return mock data based on table name
  if (tableName in mockData) {
    return mockData[tableName as keyof typeof mockData].filter((item: any) => item.tenant_id === tenantId) as T[]
  }
  return []
}
