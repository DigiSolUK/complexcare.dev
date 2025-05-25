import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Try to fetch from database first
    try {
      const query = `
        SELECT * FROM care_professionals
        WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
        ORDER BY created_at DESC
      `
      const result = await db.query(query, [`%${search}%`])
      return NextResponse.json(result.rows)
    } catch (dbError) {
      console.error("Database error:", dbError)

      // Fallback to mock data if database query fails
      const mockProfessionals = [
        {
          id: "1",
          first_name: "John",
          last_name: "Smith",
          email: "john.smith@example.com",
          phone: "+44 7700 900123",
          role: "Nurse",
          specialization: "Geriatric Care",
          qualification: "RN",
          license_number: "RN123456",
          employment_status: "Full-time",
          start_date: "2022-01-15",
          is_active: true,
          created_at: "2022-01-10T10:00:00Z",
          updated_at: "2023-05-20T14:30:00Z",
          address: "123 Main St, London",
          notes: "Experienced in dementia care",
          emergency_contact_name: "Jane Smith",
          emergency_contact_phone: "+44 7700 900124",
          avatar_url: null,
        },
        {
          id: "2",
          first_name: "Sarah",
          last_name: "Johnson",
          email: "sarah.johnson@example.com",
          phone: "+44 7700 900125",
          role: "Physiotherapist",
          specialization: "Rehabilitation",
          qualification: "PT, MSc",
          license_number: "PT789012",
          employment_status: "Part-time",
          start_date: "2022-03-10",
          is_active: true,
          created_at: "2022-03-05T09:15:00Z",
          updated_at: "2023-06-12T11:45:00Z",
          address: "456 High St, Manchester",
          notes: "Specializes in stroke rehabilitation",
          emergency_contact_name: "Michael Johnson",
          emergency_contact_phone: "+44 7700 900126",
          avatar_url: null,
        },
        {
          id: "3",
          first_name: "David",
          last_name: "Williams",
          email: "david.williams@example.com",
          phone: "+44 7700 900127",
          role: "Care Assistant",
          specialization: "Home Care",
          qualification: "NVQ Level 3",
          license_number: "CA345678",
          employment_status: "Full-time",
          start_date: "2022-05-20",
          is_active: false,
          created_at: "2022-05-15T14:30:00Z",
          updated_at: "2023-04-18T10:20:00Z",
          address: "789 Park Lane, Birmingham",
          notes: "On extended leave",
          emergency_contact_name: "Emma Williams",
          emergency_contact_phone: "+44 7700 900128",
          avatar_url: null,
        },
      ]

      // Filter mock data if search parameter is provided
      const filteredProfessionals = search
        ? mockProfessionals.filter(
            (p) =>
              p.first_name.toLowerCase().includes(search.toLowerCase()) ||
              p.last_name.toLowerCase().includes(search.toLowerCase()) ||
              p.email.toLowerCase().includes(search.toLowerCase()),
          )
        : mockProfessionals

      return NextResponse.json(filteredProfessionals)
    }
  } catch (error) {
    console.error("Error in care professionals API:", error)
    return NextResponse.json({ error: "Failed to fetch care professionals" }, { status: 500 })
  }
}
