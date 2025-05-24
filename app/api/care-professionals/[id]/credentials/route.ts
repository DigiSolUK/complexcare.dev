import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || "")

// Demo credentials data
const demoCredentials = [
  {
    id: "cred-001",
    care_professional_id: "cp-001",
    credential_type: "License",
    credential_name: "Registered Nurse License",
    issuing_authority: "Nursing and Midwifery Council",
    credential_number: "RN123456",
    issue_date: "2020-01-15",
    expiry_date: "2025-01-14",
    verification_status: "verified",
    verification_date: "2020-01-20",
    verified_by: "admin",
    notes: "License verified via NMC online portal",
    created_at: "2020-01-20T10:30:00Z",
    updated_at: "2020-01-20T10:30:00Z",
  },
  {
    id: "cred-002",
    care_professional_id: "cp-001",
    credential_type: "Certification",
    credential_name: "Basic Life Support",
    issuing_authority: "Resuscitation Council UK",
    credential_number: "BLS789012",
    issue_date: "2022-03-10",
    expiry_date: "2024-03-09",
    verification_status: "verified",
    verification_date: "2022-03-15",
    verified_by: "admin",
    notes: "Certificate verified with issuing authority",
    created_at: "2022-03-15T14:20:00Z",
    updated_at: "2022-03-15T14:20:00Z",
  },
  {
    id: "cred-003",
    care_professional_id: "cp-001",
    credential_type: "DBS Check",
    credential_name: "Enhanced DBS Check",
    issuing_authority: "Disclosure and Barring Service",
    credential_number: "DBS345678",
    issue_date: "2021-05-20",
    expiry_date: null,
    verification_status: "verified",
    verification_date: "2021-05-25",
    verified_by: "admin",
    notes: "Enhanced check with barred lists",
    created_at: "2021-05-25T09:15:00Z",
    updated_at: "2021-05-25T09:15:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id

    // Check if credentials table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'credentials'
      ) as exists
    `

    if (!tableExists[0]?.exists) {
      console.log("Credentials table does not exist, returning demo data")
      return NextResponse.json({
        data: demoCredentials.filter((cred) => cred.care_professional_id === careProfessionalId),
        meta: {
          total: demoCredentials.filter((cred) => cred.care_professional_id === careProfessionalId).length,
        },
      })
    }

    // Get column information
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'credentials'
    `

    console.log("Credentials table columns:", columns)

    // Check if care_professional_id column exists and its data type
    const cpIdColumn = columns.find(
      (col) => col.column_name === "care_professional_id" || col.column_name === "care_professional_id",
    )

    if (!cpIdColumn) {
      console.log("care_professional_id column not found, returning demo data")
      return NextResponse.json({
        data: demoCredentials.filter((cred) => cred.care_professional_id === careProfessionalId),
        meta: {
          total: demoCredentials.filter((cred) => cred.care_professional_id === careProfessionalId).length,
        },
      })
    }

    // Build query based on column data types
    const query = `
      SELECT * FROM credentials 
      WHERE care_professional_id = $1
    `

    // Execute query with proper parameter type handling
    const credentials = await sql.query(query, [careProfessionalId])

    return NextResponse.json({
      data: credentials,
      meta: {
        total: credentials.length,
      },
    })
  } catch (error) {
    console.error("Error fetching care professional credentials:", error)

    // Return demo data as fallback
    return NextResponse.json({
      data: demoCredentials.filter((cred) => cred.care_professional_id === params.id),
      meta: {
        total: demoCredentials.filter((cred) => cred.care_professional_id === params.id).length,
      },
    })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id
    const body = await request.json()

    // Validate required fields
    if (!body.credential_type || !body.credential_name) {
      return NextResponse.json(
        { error: "Missing required fields: credential_type and credential_name are required" },
        { status: 400 },
      )
    }

    // Check if credentials table exists and create if not
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'credentials'
      ) as exists
    `

    if (!tableExists[0]?.exists) {
      console.log("Creating credentials table")
      await sql`
        CREATE TABLE credentials (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          care_professional_id TEXT NOT NULL,
          credential_type TEXT NOT NULL,
          credential_name TEXT NOT NULL,
          issuing_authority TEXT,
          credential_number TEXT,
          issue_date DATE,
          expiry_date DATE,
          verification_status TEXT DEFAULT 'pending',
          verification_date TIMESTAMP,
          verified_by TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          tenant_id TEXT
        )
      `
    }

    // Insert new credential
    const newCredential = await sql`
      INSERT INTO credentials (
        care_professional_id,
        credential_type,
        credential_name,
        issuing_authority,
        credential_number,
        issue_date,
        expiry_date,
        verification_status,
        notes,
        tenant_id
      ) VALUES (
        ${careProfessionalId},
        ${body.credential_type},
        ${body.credential_name},
        ${body.issuing_authority || null},
        ${body.credential_number || null},
        ${body.issue_date ? new Date(body.issue_date) : null},
        ${body.expiry_date ? new Date(body.expiry_date) : null},
        ${"pending"},
        ${body.notes || null},
        ${body.tenant_id || null}
      ) RETURNING *
    `

    return NextResponse.json(newCredential[0], { status: 201 })
  } catch (error) {
    console.error("Error creating credential:", error)
    return NextResponse.json(
      { error: "Failed to create credential", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
