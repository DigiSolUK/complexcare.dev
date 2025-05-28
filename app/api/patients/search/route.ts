import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const filters = {
      status: searchParams.get("status"),
      ageMin: searchParams.get("ageMin"),
      ageMax: searchParams.get("ageMax"),
      gender: searchParams.get("gender"),
      condition: searchParams.get("condition"),
      careTeam: searchParams.get("careTeam"),
    }

    const sql = neon(process.env.DATABASE_URL!)

    let sqlQuery = `
      SELECT DISTINCT
        p.id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.status,
        p.nhs_number,
        p.email,
        p.phone,
        p.created_at,
        COUNT(DISTINCT a.id) as appointment_count,
        COUNT(DISTINCT cn.id) as clinical_note_count,
        MAX(a.appointment_date) as last_appointment
      FROM patients p
      LEFT JOIN appointments a ON p.id = a.patient_id
      LEFT JOIN clinical_notes cn ON p.id = cn.patient_id
      WHERE p.tenant_id = $1
    `

    const params: any[] = [session.user.tenantId]
    let paramIndex = 2

    // Add search query
    if (query) {
      sqlQuery += ` AND (
        p.first_name ILIKE $${paramIndex} OR 
        p.last_name ILIKE $${paramIndex} OR 
        p.nhs_number ILIKE $${paramIndex} OR
        p.email ILIKE $${paramIndex} OR
        CONCAT(p.first_name, ' ', p.last_name) ILIKE $${paramIndex}
      )`
      params.push(`%${query}%`)
      paramIndex++
    }

    // Add filters
    if (filters.status) {
      sqlQuery += ` AND p.status = $${paramIndex}`
      params.push(filters.status)
      paramIndex++
    }

    if (filters.gender) {
      sqlQuery += ` AND p.gender = $${paramIndex}`
      params.push(filters.gender)
      paramIndex++
    }

    // Age filter
    if (filters.ageMin || filters.ageMax) {
      const currentDate = new Date()
      if (filters.ageMin) {
        const minBirthDate = new Date(
          currentDate.getFullYear() - Number.parseInt(filters.ageMin),
          currentDate.getMonth(),
          currentDate.getDate(),
        )
        sqlQuery += ` AND p.date_of_birth <= $${paramIndex}`
        params.push(minBirthDate.toISOString())
        paramIndex++
      }
      if (filters.ageMax) {
        const maxBirthDate = new Date(
          currentDate.getFullYear() - Number.parseInt(filters.ageMax),
          currentDate.getMonth(),
          currentDate.getDate(),
        )
        sqlQuery += ` AND p.date_of_birth >= $${paramIndex}`
        params.push(maxBirthDate.toISOString())
        paramIndex++
      }
    }

    sqlQuery += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT 50`

    const patients = await sql(sqlQuery, params)

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Patient search error:", error)
    return NextResponse.json({ error: "Failed to search patients" }, { status: 500 })
  }
}
