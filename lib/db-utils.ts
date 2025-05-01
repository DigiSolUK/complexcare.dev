import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)
}

// Execute a query for a specific tenant
export async function tenantQuery<T>(tenantId: string, queryText: string, params: any[] = []): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping query execution.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      console.warn("DATABASE_URL environment variable is not set, using fallback data")
      return getMockData<T>(queryText)
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    // Log the query for debugging
    console.log(`Executing query for tenant ${tenantId}:`, queryText)

    // Execute the query
    const result = await sql.query(queryText, params)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant query:", error)
    return []
  }
}

// Insert a record for a specific tenant (simplified for now)
export async function tenantInsert<T>(tenantId: string, table: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping insert operation.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      console.warn("DATABASE_URL environment variable is not set, using fallback data")
      return [data] as unknown as T[]
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    if (!data.id) {
      data.id = uuidv4()
    }
    data.tenant_id = tenantId

    const query = `
      INSERT INTO ${table} (${Object.keys(data).join(", ")})
      VALUES (${Object.values(data)
        .map((v, i) => `$${i + 1}`)
        .join(", ")})
      RETURNING *
    `

    const values = Object.values(data)

    // Log the query for debugging
    console.log(`Executing insert for tenant ${tenantId}:`, query)

    // Execute the query
    const result = await sql.query(query, values)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant insert:", error)
    return []
  }
}

// Update a record for a specific tenant (simplified for now)
export async function tenantUpdate<T>(tenantId: string, table: string, id: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping update operation.")
    return []
  }
  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      console.warn("DATABASE_URL environment variable is not set, using fallback data")
      return [data] as unknown as T[]
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    const updateFields = Object.entries(data)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(", ")

    const query = `
      UPDATE ${table}
      SET ${updateFields}
      WHERE tenant_id = '${tenantId}' AND id = '${id}'
      RETURNING *
    `

    // Log the query for debugging
    console.log(`Executing update for tenant ${tenantId}:`, query)

    // Execute the query
    const result = await sql.query(query)
    console.log(`Query result rows: ${result.rows?.length || 0}`)

    return result.rows as T[]
  } catch (error) {
    console.error("Error executing tenant update:", error)
    return []
  }
}

// Delete a record for a specific tenant (simplified for now)
export async function tenantDelete<T>(tenantId: string, table: string, id: string): Promise<T[]> {
  return [] as T[]
}

// Helper function to get mock data based on the query
function getMockData<T>(query: string): T[] {
  // Check what kind of data is being requested
  if (query.toLowerCase().includes("care_professionals")) {
    return [
      {
        id: "cp-001",
        tenant_id: "demo-tenant",
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "07700 900123",
        role: "Registered Nurse",
        specialization: "Palliative Care",
        qualification: "RN, BSc Nursing",
        license_number: "RN123456",
        employment_status: "Full-time",
        start_date: "2021-03-15",
        is_active: true,
        created_at: "2021-03-10T00:00:00Z",
        updated_at: "2023-01-15T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "123 Care Street, London",
        notes: "Specialized in complex care management",
        emergency_contact_name: "Michael Johnson",
        emergency_contact_phone: "07700 900456",
        avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "cp-002",
        tenant_id: "demo-tenant",
        first_name: "James",
        last_name: "Williams",
        email: "james.williams@example.com",
        phone: "07700 900234",
        role: "Physiotherapist",
        specialization: "Neurological Rehabilitation",
        qualification: "BSc Physiotherapy, MSc Neuro Rehab",
        license_number: "PT789012",
        employment_status: "Part-time",
        start_date: "2022-01-10",
        is_active: true,
        created_at: "2021-12-20T00:00:00Z",
        updated_at: "2023-02-05T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "456 Therapy Lane, Manchester",
        notes: "Specializes in stroke rehabilitation",
        emergency_contact_name: "Emma Williams",
        emergency_contact_phone: "07700 900567",
        avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    ] as unknown as T[]
  } else if (query.toLowerCase().includes("patients")) {
    return [
      {
        id: "pat-001",
        tenant_id: "demo-tenant",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1975-05-15",
        gender: "Male",
        address: "123 Main St, London",
        phone: "07700 900111",
        email: "john.doe@example.com",
        emergency_contact: "Jane Doe",
        emergency_phone: "07700 900222",
        medical_conditions: "Hypertension, Diabetes",
        allergies: "Penicillin",
        notes: "Prefers morning appointments",
        created_at: "2022-01-10T00:00:00Z",
        updated_at: "2023-03-15T00:00:00Z",
        is_active: true,
        avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      {
        id: "pat-002",
        tenant_id: "demo-tenant",
        first_name: "Emily",
        last_name: "Smith",
        email: "emily.smith@example.com",
        status: "active",
        date_of_birth: "1982-11-30",
        gender: "Female",
        address: "456 High St, Manchester",
        phone: "07700 900333",
        emergency_contact: "Michael Smith",
        emergency_phone: "07700 900444",
        medical_conditions: "Asthma",
        allergies: "Latex",
        notes: "Requires wheelchair access",
        created_at: "2022-02-15T00:00:00Z",
        updated_at: "2023-04-10T00:00:00Z",
        is_active: true,
        avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
      },
    ] as unknown as T[]
  } else if (query.toLowerCase().includes("timesheets")) {
    return [
      {
        id: "ts-001",
        tenant_id: "demo-tenant",
        user_id: "cp-001",
        userName: "Sarah Johnson",
        date: "2023-04-15",
        hoursWorked: 8,
        status: "approved",
        approved: true,
        notes: "Regular shift",
        createdAt: "2023-04-15T16:35:00Z",
        updatedAt: "2023-04-16T10:00:00Z",
      },
      {
        id: "ts-002",
        tenant_id: "demo-tenant",
        user_id: "cp-002",
        userName: "James Williams",
        date: "2023-04-15",
        hoursWorked: 7.25,
        status: "approved",
        approved: true,
        notes: "Patient assessments",
        createdAt: "2023-04-15T17:05:00Z",
        updatedAt: "2023-04-16T10:05:00Z",
      },
    ] as unknown as T[]
  }

  // Default empty array
  return [] as T[]
}
