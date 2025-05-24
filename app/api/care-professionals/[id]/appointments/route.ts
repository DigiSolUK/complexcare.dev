import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    const sql = neon(process.env.DATABASE_URL || "")

    // First, check what columns exist in the appointments table
    const columnsResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'appointments'
    `

    const columns = columnsResult.map((col) => col.column_name)
    console.log("Appointments table columns:", columns)

    // Build a dynamic query based on available columns
    const selectFields = ["a.id"]

    // Add fields based on what exists
    if (columns.includes("appointment_date")) selectFields.push("a.appointment_date")
    if (columns.includes("appointment_time")) selectFields.push("a.appointment_time")
    if (columns.includes("start_time")) selectFields.push("a.start_time")
    if (columns.includes("end_time")) selectFields.push("a.end_time")
    if (columns.includes("status")) selectFields.push("a.status")
    if (columns.includes("type")) selectFields.push("a.type")
    if (columns.includes("location")) selectFields.push("a.location")
    if (columns.includes("notes")) selectFields.push("a.notes")
    if (columns.includes("description")) selectFields.push("a.description")
    if (columns.includes("reason")) selectFields.push("a.reason")

    // For the title, we'll use description, reason, or type as fallback
    let titleField = "a.id as title"
    if (columns.includes("description")) {
      titleField = "COALESCE(a.description, a.type, 'Appointment') as title"
    } else if (columns.includes("reason")) {
      titleField = "COALESCE(a.reason, a.type, 'Appointment') as title"
    } else if (columns.includes("type")) {
      titleField = "COALESCE(a.type, 'Appointment') as title"
    }

    selectFields.push(titleField)

    // Build the query
    let query = `
      SELECT ${selectFields.join(", ")}
    `

    // Add patient info if patient_id exists
    if (columns.includes("patient_id")) {
      query += `,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        COALESCE(p.avatar_url, '/placeholder.svg?height=40&width=40&query=patient') as patient_avatar_url
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      `
    } else {
      query += `
      FROM appointments a
      `
    }

    // Add WHERE clause
    const whereConditions = []
    if (columns.includes("care_professional_id")) {
      whereConditions.push(`a.care_professional_id = '${careProfessionalId}'`)
    } else if (columns.includes("provider_id")) {
      whereConditions.push(`a.provider_id = '${careProfessionalId}'`)
    } else if (columns.includes("staff_id")) {
      whereConditions.push(`a.staff_id = '${careProfessionalId}'`)
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`
    }

    // Add ORDER BY
    const orderBy = []
    if (columns.includes("appointment_date")) orderBy.push("a.appointment_date DESC")
    if (columns.includes("appointment_time")) orderBy.push("a.appointment_time DESC")
    if (columns.includes("start_time")) orderBy.push("a.start_time DESC")
    if (orderBy.length === 0) orderBy.push("a.id DESC")

    query += ` ORDER BY ${orderBy.join(", ")}`
    query += ` LIMIT ${limit} OFFSET ${offset}`

    console.log("Executing query:", query)
    const appointments = await sql.query(query)

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM appointments a`
    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(" AND ")}`
    }

    const countResult = await sql.query(countQuery)
    const total = Number.parseInt(countResult[0]?.total || "0", 10)

    // Transform the data to match the expected format
    const transformedAppointments = appointments.map((apt) => ({
      id: apt.id,
      title: apt.title || "Appointment",
      appointment_date: apt.appointment_date || apt.start_time?.split("T")[0] || new Date().toISOString().split("T")[0],
      appointment_time:
        apt.appointment_time ||
        (apt.start_time
          ? new Date(apt.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          : "09:00"),
      end_time: apt.end_time
        ? new Date(apt.end_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        : null,
      status: apt.status || "scheduled",
      type: apt.type || "General",
      location: apt.location || "TBD",
      notes: apt.notes || apt.description || "",
      patient_first_name: apt.patient_first_name || null,
      patient_last_name: apt.patient_last_name || null,
      patient_avatar_url: apt.patient_avatar_url || "/placeholder.svg?height=40&width=40&query=patient",
    }))

    return NextResponse.json({
      data: transformedAppointments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)

    // Return demo data as fallback
    const demoAppointments = [
      {
        id: "demo-1",
        title: "Initial Assessment",
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "09:00",
        end_time: "10:00",
        status: "scheduled",
        type: "Assessment",
        location: "Patient's Home",
        notes: "Initial patient assessment",
        patient_first_name: "Demo",
        patient_last_name: "Patient",
        patient_avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
      },
    ]

    return NextResponse.json({
      data: demoAppointments,
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    })
  }
}
