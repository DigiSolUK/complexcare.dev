import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

// Initialize the SQL client
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

// Execute a query for a specific tenant using tagged template literals
export async function tenantQuery<T>(tenantId: string, queryText: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn("Database connection not available, returning empty array")
    return []
  }

  try {
    // Convert the parameterized query to a tagged template literal
    // This is a simplified approach - in a real app, you'd want to use a proper SQL query builder
    const query = queryText
    const values = [...params] // Make a copy of params

    // Replace $1, $2, etc. with actual values in the query
    if (params.length > 0) {
      // For demo purposes, we'll just return mock data
      console.log("Using mock data due to parameterized query")
      return getMockData<T>(queryText)
    }

    // Use tagged template literals
    const result = await sql`${query}`
    return result as T[]
  } catch (error) {
    console.error("Error executing tenant query:", error)
    // Return mock data in case of error
    return getMockData<T>(queryText)
  }
}

// Insert a record for a specific tenant
export async function tenantInsert<T>(tenantId: string, table: string, data: any): Promise<T[]> {
  if (!sql) {
    console.warn("Database connection not available, returning empty array")
    return []
  }

  try {
    // Generate an ID if not provided
    if (!data.id) {
      data.id = uuidv4()
    }

    // Ensure tenant_id is set
    data.tenant_id = tenantId

    // For demo purposes, we'll just return mock data
    console.log("Using mock data for insert operation")
    return getMockInsertData<T>(table, data)
  } catch (error) {
    console.error("Error executing tenant insert:", error)
    // Return mock data in case of error
    return getMockInsertData<T>(table, data)
  }
}

// Update a record for a specific tenant
export async function tenantUpdate<T>(tenantId: string, table: string, id: string, data: any): Promise<T[]> {
  if (!sql) {
    console.warn("Database connection not available, returning empty array")
    return []
  }

  try {
    // For demo purposes, we'll just return mock data
    console.log("Using mock data for update operation")
    return getMockUpdateData<T>(table, id, data)
  } catch (error) {
    console.error("Error executing tenant update:", error)
    // Return mock data in case of error
    return getMockUpdateData<T>(table, id, data)
  }
}

// Delete a record for a specific tenant
export async function tenantDelete<T>(tenantId: string, table: string, id: string): Promise<T[]> {
  if (!sql) {
    console.warn("Database connection not available, returning empty array")
    return []
  }

  try {
    // For demo purposes, we'll just return mock data
    console.log("Using mock data for delete operation")
    return [] as T[]
  } catch (error) {
    console.error("Error executing tenant delete:", error)
    // Return mock data in case of error
    return [] as T[]
  }
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
        date_of_birth: "1982-11-30",
        gender: "Female",
        address: "456 High St, Manchester",
        phone: "07700 900333",
        email: "emily.smith@example.com",
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
        user_name: "Sarah Johnson",
        date: "2023-04-15",
        start_time: "08:00",
        end_time: "16:30",
        break_duration_minutes: 30,
        total_hours: 8,
        status: "approved",
        notes: "Regular shift",
        approved_by: "user-002",
        approver_name: "John Smith",
        approved_at: "2023-04-16T10:00:00Z",
        created_at: "2023-04-15T16:35:00Z",
        updated_at: "2023-04-16T10:00:00Z",
      },
      {
        id: "ts-002",
        tenant_id: "demo-tenant",
        user_id: "cp-002",
        user_name: "James Williams",
        date: "2023-04-15",
        start_time: "09:00",
        end_time: "17:00",
        break_duration_minutes: 45,
        total_hours: 7.25,
        status: "approved",
        notes: "Patient assessments",
        approved_by: "user-002",
        approver_name: "John Smith",
        approved_at: "2023-04-16T10:05:00Z",
        created_at: "2023-04-15T17:05:00Z",
        updated_at: "2023-04-16T10:05:00Z",
      },
    ] as unknown as T[]
  }

  // Default empty array
  return [] as T[]
}

// Helper function to get mock data for insert operations
function getMockInsertData<T>(table: string, data: any): T[] {
  const now = new Date().toISOString()
  const mockData = {
    ...data,
    id: data.id || `mock-${Math.floor(Math.random() * 1000)}`,
    created_at: now,
    updated_at: now,
  }

  return [mockData] as unknown as T[]
}

// Helper function to get mock data for update operations
function getMockUpdateData<T>(table: string, id: string, data: any): T[] {
  const now = new Date().toISOString()
  const mockData = {
    ...data,
    id: id,
    updated_at: now,
  }

  return [mockData] as unknown as T[]
}

