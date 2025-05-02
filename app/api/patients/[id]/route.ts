import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Demo patient data as fallback
const demoPatients = [
  {
    id: "9da03ce9-b13f-48ca-a98d-d5065d193965",
    first_name: "John",
    last_name: "Smith",
    date_of_birth: "1965-05-14",
    nhs_number: "1234567890",
    gender: "Male",
    status: "active",
    address: {
      street: "42 Oak Street",
      city: "London",
      postcode: "SW1A 1AA",
      country: "United Kingdom",
    },
    contact: {
      phone: "07700900123",
      email: "john.smith@example.com",
      emergency_contact_name: "Mary Smith",
      emergency_contact_phone: "07700900456",
      emergency_contact_relationship: "Spouse",
    },
    medical_information: {
      primary_care_provider: "Dr. Elizabeth Johnson",
      primary_care_provider_contact: "020 7946 0321",
      primary_condition: "Type 2 diabetes diagnosed in 2010, Hypertension since 2015",
      allergies: ["Penicillin", "Shellfish"],
      blood_type: "A+",
      height: 178,
      weight: 82,
      bmi: 25.9,
      smoking_status: "Former smoker, quit in 2018",
      alcohol_consumption: "Occasional",
    },
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        start_date: "2010-06-15",
        prescribing_doctor: "Dr. Elizabeth Johnson",
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        start_date: "2015-03-22",
        prescribing_doctor: "Dr. Elizabeth Johnson",
      },
    ],
    care_plan: {
      id: "cp-001",
      created_date: "2022-01-10",
      updated_date: "2023-05-20",
      goals: [
        "Maintain blood glucose levels within target range",
        "Reduce blood pressure to below 130/80",
        "Increase physical activity to 30 minutes daily",
      ],
      interventions: [
        "Weekly blood glucose monitoring",
        "Monthly blood pressure check",
        "Dietary consultation every 3 months",
      ],
      assigned_care_professionals: [
        {
          id: "cp-001",
          name: "Sarah Johnson",
          role: "Registered Nurse",
        },
        {
          id: "cp-004",
          name: "Robert Smith",
          role: "Healthcare Assistant",
        },
      ],
    },
    appointments: [
      {
        id: "app-001",
        date: "2023-06-15T10:00:00Z",
        type: "Regular Check-up",
        care_professional: "Dr. Elizabeth Johnson",
        location: "London Community Health Center",
        status: "completed",
        notes: "Patient's blood pressure has improved. Continue current medication.",
      },
      {
        id: "app-002",
        date: "2023-09-20T14:30:00Z",
        type: "Diabetes Review",
        care_professional: "Dr. Michael Chen",
        location: "London Diabetes Clinic",
        status: "scheduled",
        notes: "Annual diabetes review appointment",
      },
    ],
    notes: [
      {
        id: "note-001",
        date: "2023-06-15T10:45:00Z",
        author: "Dr. Elizabeth Johnson",
        content:
          "Patient reports feeling better with current medication regimen. Blood pressure readings have improved to 135/85.",
      },
      {
        id: "note-002",
        date: "2023-05-02T09:15:00Z",
        author: "Sarah Johnson, RN",
        content:
          "Patient called with concerns about mild dizziness. Advised to monitor blood pressure and report if symptoms worsen.",
      },
    ],
    created_at: "2022-01-05T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
  // More demo patients can be added here
]

/**
 * Helper function to find a demo patient by ID
 */
function findDemoPatient(id: string) {
  return demoPatients.find((patient) => patient.id === id)
}

/**
 * GET handler for fetching a patient by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`Fetching patient with ID: ${id}`)

    // First try to fetch from database
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`SELECT * FROM patients WHERE id = ${id}`

      if (result && result.length > 0) {
        console.log("Patient found in database")
        return NextResponse.json(result[0])
      }
    } catch (dbError) {
      console.error("Database error when fetching patient:", dbError)
      // Continue to fallback
    }

    // If database fetch fails, try to find in demo data
    const demoPatient = findDemoPatient(id)
    if (demoPatient) {
      console.log("Patient found in demo data")
      return NextResponse.json(demoPatient)
    }

    // If not found anywhere, return 404
    return NextResponse.json({ error: `Patient with ID ${id} not found` }, { status: 404 })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient details", details: String(error) }, { status: 500 })
  }
}
