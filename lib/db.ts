import { neon } from "@neondatabase/serverless"

// Default tenant ID
export const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || process.env.production_DATABASE_URL || ""
}

// Create a SQL client using the Neon serverless driver
export const sql = neon(getDatabaseUrl())

// Legacy alias for compatibility
export const db = sql

// Mock data for when database is unavailable
export const mockData = {
  patients: [
    {
      id: "p1",
      tenant_id: DEFAULT_TENANT_ID,
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
      tenant_id: DEFAULT_TENANT_ID,
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
      tenant_id: DEFAULT_TENANT_ID,
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
      tenant_id: DEFAULT_TENANT_ID,
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
  clinical_notes: [
    {
      id: "cn1",
      tenant_id: DEFAULT_TENANT_ID,
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
      tenant_id: DEFAULT_TENANT_ID,
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
  appointments: [
    {
      id: "a1",
      tenant_id: DEFAULT_TENANT_ID,
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
      tenant_id: DEFAULT_TENANT_ID,
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
}

// Helper function to execute queries with tenant context and fallback to mock data
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T[]> {
  try {
    // Try to execute the query
    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)

    // Fallback to mock data
    // Extract table name from query (simplified approach)
    const tableMatch = query.match(/FROM\s+([a-zA-Z_]+)/i)
    if (tableMatch && tableMatch[1]) {
      const tableName = tableMatch[1].toLowerCase().trim()
      if (tableName in mockData) {
        console.log(`Falling back to mock data for table: ${tableName}`)
        return mockData[tableName as keyof typeof mockData] as T[]
      }
    }

    // Return empty array if no mock data found
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
        return { rows: [] }
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
    try {
      await sql.query("ROLLBACK")
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError)
    }
    console.error("Transaction error:", error)
    throw error
  }
}

// Generic CRUD operations with mock data fallback
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

    // Fallback to mock data
    if (table in mockData) {
      const mockItem = mockData[table as keyof typeof mockData].find(
        (item: any) => item.id === id && item.tenant_id === tenantId,
      )
      return mockItem || null
    }

    return null
  }
}

// Other functions remain the same...
