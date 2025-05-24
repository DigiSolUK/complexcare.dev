import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`Fetching patient with ID: ${id}`)

    // Get the patient from the database using the correct Neon API
    const result = await sql.query(`SELECT * FROM patients WHERE id = $1`, [id])

    const patient = result[0]

    if (!patient) {
      console.log(`Patient with ID ${id} not found`)
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    console.log("Patient found in database")

    // Log the patient data for debugging
    console.log("Patient data received:", patient)

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}
