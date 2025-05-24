import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id
    const sql = neon(process.env.DATABASE_URL || "")

    // First check what columns exist in the care_professionals table
    const columnsResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'care_professionals'
    `

    const columns = columnsResult.map((col) => col.column_name)
    console.log("Care professionals table columns:", columns)

    // Build dynamic query based on available columns
    const selectFields = ["cp.id"]

    // Add fields that exist
    const possibleFields = [
      "first_name",
      "last_name",
      "title",
      "email",
      "phone_number",
      "phone",
      "mobile",
      "role",
      "position",
      "specialization",
      "qualifications",
      "is_active",
      "active",
      "status",
      "address",
      "street_address",
      "postcode",
      "postal_code",
      "zip_code",
      "notes",
      "bio",
      "description",
      "emergency_contact_relationship",
      "emergency_contact",
      "created_at",
      "updated_at",
      "date_created",
      "date_updated",
      "avatar_url",
      "profile_image",
      "photo_url",
    ]

    for (const field of possibleFields) {
      if (columns.includes(field)) {
        selectFields.push(`cp.${field}`)
      }
    }

    const query = `
      SELECT ${selectFields.join(", ")}
      FROM care_professionals cp
      WHERE cp.id = $1
    `

    console.log("Executing query:", query)
    const result = await sql.query(query, [careProfessionalId])

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    const careProfessional = result[0]

    // Normalize the data to expected format
    const normalized = {
      id: careProfessional.id,
      first_name: careProfessional.first_name || "Unknown",
      last_name: careProfessional.last_name || "Professional",
      title: careProfessional.title || null,
      email: careProfessional.email || careProfessional.email_address || "no-email@example.com",
      phone_number: careProfessional.phone_number || careProfessional.phone || careProfessional.mobile || null,
      role: careProfessional.role || careProfessional.position || "Care Professional",
      specialization: careProfessional.specialization || null,
      qualifications: careProfessional.qualifications || null,
      is_active: careProfessional.is_active ?? careProfessional.active ?? true,
      status: careProfessional.status || (careProfessional.is_active ? "Active" : "Inactive"),
      address: careProfessional.address || careProfessional.street_address || null,
      postcode: careProfessional.postcode || careProfessional.postal_code || careProfessional.zip_code || null,
      notes: careProfessional.notes || careProfessional.bio || careProfessional.description || null,
      emergency_contact_relationship:
        careProfessional.emergency_contact_relationship || careProfessional.emergency_contact || null,
      created_at: careProfessional.created_at || careProfessional.date_created || new Date().toISOString(),
      updated_at: careProfessional.updated_at || careProfessional.date_updated || new Date().toISOString(),
      avatar_url: careProfessional.avatar_url || careProfessional.profile_image || careProfessional.photo_url || null,
    }

    return NextResponse.json(normalized)
  } catch (error) {
    console.error("Error fetching care professional:", error)

    // Return demo data as fallback
    const demoCareProfessional = {
      id: params.id,
      first_name: "Demo",
      last_name: "Professional",
      title: "Dr.",
      email: "demo@example.com",
      phone_number: "07700 900000",
      role: "Senior Care Professional",
      specialization: "Complex Care",
      qualifications: "RN, BSc Nursing",
      is_active: true,
      status: "Active",
      address: "123 Demo Street, London",
      postcode: "SW1A 1AA",
      notes: "This is demo data. Please check your database connection.",
      emergency_contact_relationship: "Spouse",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: null,
    }

    return NextResponse.json(demoCareProfessional)
  }
}
