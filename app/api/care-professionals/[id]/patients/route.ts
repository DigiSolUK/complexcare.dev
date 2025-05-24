import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { tenantQuery } from "@/lib/db-utils"

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

// Demo data for patients
const demoPatients = [
  {
    id: "pat-001",
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1965-03-15",
    gender: "Male",
    contact_number: "07700 900123",
    email: "john.doe@example.com",
    address: "123 Patient Street, London",
    avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
  {
    id: "pat-002",
    first_name: "Jane",
    last_name: "Smith",
    date_of_birth: "1972-08-22",
    gender: "Female",
    contact_number: "07700 900456",
    email: "jane.smith@example.com",
    address: "456 Patient Avenue, Manchester",
    avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
  {
    id: "pat-003",
    first_name: "Robert",
    last_name: "Johnson",
    date_of_birth: "1958-11-10",
    gender: "Male",
    contact_number: "07700 900789",
    email: "robert.johnson@example.com",
    address: "789 Patient Road, Birmingham",
    avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // If in demo mode, return demo data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        data: demoPatients,
        meta: {
          total: demoPatients.length,
          limit,
          offset,
          hasMore: offset + limit < demoPatients.length,
        },
      })
    }

    // Try to get patients from the database
    try {
      // First check if the necessary tables exist
      const tableInfo = await sql.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'patients'
        ) as patients_exists,
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'care_professional_patients'
        ) as mapping_exists
      `)

      const patientsTableExists = tableInfo[0]?.patients_exists || false
      const mappingTableExists = tableInfo[0]?.mapping_exists || false

      if (!patientsTableExists) {
        console.log("Patients table does not exist, returning empty data")
        return NextResponse.json({
          data: [],
          meta: {
            total: 0,
            limit,
            offset,
            hasMore: false,
          },
        })
      }

      // Get column information for patients table
      const patientColumnInfo = await sql.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'patients'
      `)

      const patientColumns = patientColumnInfo.map((col) => col.column_name)
      console.log("Patients table columns:", patientColumns)

      let query = ""
      let countQuery = ""

      if (mappingTableExists) {
        // If we have a mapping table, use it to get patients assigned to this care professional
        query = `
          SELECT p.id, p.first_name, p.last_name, 
        `

        // Add optional fields if they exist
        if (patientColumns.includes("date_of_birth")) {
          query += `p.date_of_birth, `
        } else {
          query += `NULL as date_of_birth, `
        }

        if (patientColumns.includes("gender")) {
          query += `p.gender, `
        } else {
          query += `NULL as gender, `
        }

        if (patientColumns.includes("contact_number")) {
          query += `p.contact_number, `
        } else if (patientColumns.includes("phone_number")) {
          query += `p.phone_number as contact_number, `
        } else {
          query += `NULL as contact_number, `
        }

        if (patientColumns.includes("email")) {
          query += `p.email, `
        } else {
          query += `NULL as email, `
        }

        if (patientColumns.includes("address")) {
          query += `p.address `
        } else {
          query += `NULL as address `
        }

        query += `
          FROM patients p
          JOIN care_professional_patients cpp ON p.id = cpp.patient_id
          WHERE cpp.care_professional_id = $1
          ORDER BY p.last_name, p.first_name
          LIMIT $2 OFFSET $3
        `

        countQuery = `
          SELECT COUNT(*) as total 
          FROM patients p
          JOIN care_professional_patients cpp ON p.id = cpp.patient_id
          WHERE cpp.care_professional_id = $1
        `
      } else {
        // If no mapping table, try to find a direct relationship in the patients table
        query = `
          SELECT p.id, p.first_name, p.last_name, 
        `

        // Add optional fields if they exist
        if (patientColumns.includes("date_of_birth")) {
          query += `p.date_of_birth, `
        } else {
          query += `NULL as date_of_birth, `
        }

        if (patientColumns.includes("gender")) {
          query += `p.gender, `
        } else {
          query += `NULL as gender, `
        }

        if (patientColumns.includes("contact_number")) {
          query += `p.contact_number, `
        } else if (patientColumns.includes("phone_number")) {
          query += `p.phone_number as contact_number, `
        } else {
          query += `NULL as contact_number, `
        }

        if (patientColumns.includes("email")) {
          query += `p.email, `
        } else {
          query += `NULL as email, `
        }

        if (patientColumns.includes("address")) {
          query += `p.address `
        } else {
          query += `NULL as address `
        }

        query += `
          FROM patients p
          WHERE 
        `

        // Try to find a column that might link to care professionals
        if (patientColumns.includes("care_professional_id")) {
          query += `p.care_professional_id = $1 `
          countQuery = `SELECT COUNT(*) as total FROM patients p WHERE p.care_professional_id = $1`
        } else if (patientColumns.includes("primary_care_professional_id")) {
          query += `p.primary_care_professional_id = $1 `
          countQuery = `SELECT COUNT(*) as total FROM patients p WHERE p.primary_care_professional_id = $1`
        } else {
          // If no direct relationship, return demo data
          console.log("No relationship found between patients and care professionals, returning demo data")
          return NextResponse.json({
            data: demoPatients,
            meta: {
              total: demoPatients.length,
              limit,
              offset,
              hasMore: offset + limit < demoPatients.length,
            },
          })
        }

        query += `
          ORDER BY p.last_name, p.first_name
          LIMIT $2 OFFSET $3
        `
      }

      const patients = await tenantQuery(DEFAULT_TENANT_ID, query, [careProfessionalId, limit, offset])

      const countResult = await tenantQuery(DEFAULT_TENANT_ID, countQuery, [careProfessionalId])

      const total = Number.parseInt(countResult[0]?.total || "0", 10)

      // Add placeholder avatar URLs
      const patientsWithAvatars = patients.map((patient) => ({
        ...patient,
        avatar_url: `/placeholder.svg?height=40&width=40&query=patient`,
      }))

      return NextResponse.json({
        data: patientsWithAvatars,
        meta: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (dbError) {
      console.error("Database error fetching patients:", dbError)

      // Fallback to demo data
      console.log("Falling back to demo data for patients due to database error")
      return NextResponse.json({
        data: demoPatients,
        meta: {
          total: demoPatients.length,
          limit,
          offset,
          hasMore: offset + limit < demoPatients.length,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching care professional patients:", error)
    return NextResponse.json({ error: "Failed to fetch care professional patients" }, { status: 500 })
  }
}
