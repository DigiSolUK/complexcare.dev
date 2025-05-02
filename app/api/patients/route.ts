import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Demo data for patients (simplified version for listing)
const demoPatients = [
  {
    id: "p-001",
    first_name: "John",
    last_name: "Smith",
    date_of_birth: "1965-05-14",
    nhs_number: "1234567890",
    gender: "Male",
    status: "active",
    primary_condition: "Type 2 diabetes diagnosed in 2010, Hypertension since 2015",
    primary_care_provider: "Dr. Elizabeth Johnson",
    avatar_url: "/javascript-code-abstract.png",
  },
  {
    id: "p-002",
    first_name: "Emily",
    last_name: "Johnson",
    date_of_birth: "1978-09-23",
    nhs_number: "2345678901",
    gender: "Female",
    status: "active",
    primary_condition: "Asthma diagnosed in childhood, Migraine",
    primary_care_provider: "Dr. Robert Williams",
    avatar_url: "/stylized-ej-initials.png",
  },
  {
    id: "p-003",
    first_name: "Sarah",
    last_name: "Williams",
    date_of_birth: "1992-11-18",
    nhs_number: "3456789012",
    gender: "Female",
    status: "active",
    primary_condition: "Anxiety disorder diagnosed in 2018, Irritable Bowel Syndrome",
    primary_care_provider: "Dr. James Anderson",
    avatar_url: "/abstract-southwest.png",
  },
  {
    id: "p-004",
    first_name: "Margaret",
    last_name: "Brown",
    date_of_birth: "1945-03-12",
    nhs_number: "4567890123",
    gender: "Female",
    status: "active",
    primary_condition: "Osteoarthritis, Hypertension, Type 2 Diabetes",
    primary_care_provider: "Dr. Thomas Wilson",
    avatar_url: "/abstract-blue-burst.png",
  },
  {
    id: "p-005",
    first_name: "Robert",
    last_name: "Taylor",
    date_of_birth: "1982-07-30",
    nhs_number: "5678901234",
    gender: "Male",
    status: "active",
    primary_condition: "Lower back pain due to herniated disc, Depression",
    primary_care_provider: "Dr. Jennifer Lee",
    avatar_url: "/road-trip-sunset.png",
  },
  {
    id: "p-006",
    first_name: "Jennifer",
    last_name: "Wilson",
    date_of_birth: "1985-02-27",
    nhs_number: "6789012345",
    gender: "Female",
    status: "active",
    primary_condition: "Bipolar disorder diagnosed in 2015, Hypothyroidism",
    primary_care_provider: "Dr. Michael Roberts",
    avatar_url: "/intertwined-letters.png",
  },
  {
    id: "p-007",
    first_name: "Michael",
    last_name: "Davies",
    date_of_birth: "1950-06-12",
    nhs_number: "7890123456",
    gender: "Male",
    status: "active",
    primary_condition: "Stroke in 2021, Hypertension, High cholesterol",
    primary_care_provider: "Dr. Sarah Thompson",
    avatar_url: "/medical-doctor-portrait.png",
  },
]

export async function GET(request: Request) {
  try {
    // First try to get patients from the database
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`SELECT * FROM patients LIMIT 100`

      if (result && result.length > 0) {
        return NextResponse.json(result)
      }
    } catch (dbError) {
      console.error("Database error, falling back to demo data:", dbError)
      // If database fails, fall back to demo data
    }

    // Return demo data as fallback
    return NextResponse.json(demoPatients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    // Even if everything fails, still return demo data to prevent UI errors
    return NextResponse.json(demoPatients)
  }
}
