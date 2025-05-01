import { NextResponse } from "next/server"

// Demo data for patients with more comprehensive information
const demoPatients = [
  {
    id: "p-001",
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
      height: 178, // cm
      weight: 82, // kg
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
  {
    id: "p-002",
    first_name: "Emily",
    last_name: "Johnson",
    date_of_birth: "1978-09-23",
    nhs_number: "2345678901",
    gender: "Female",
    status: "active",
    address: {
      street: "15 Maple Avenue",
      city: "Manchester",
      postcode: "M1 1AE",
      country: "United Kingdom",
    },
    contact: {
      phone: "07700900234",
      email: "emily.johnson@example.com",
      emergency_contact_name: "David Johnson",
      emergency_contact_phone: "07700900567",
      emergency_contact_relationship: "Husband",
    },
    medical_information: {
      primary_care_provider: "Dr. Robert Williams",
      primary_care_provider_contact: "0161 234 5678",
      primary_condition: "Asthma diagnosed in childhood, Migraine",
      allergies: ["Dust mites", "Pollen"],
      blood_type: "O-",
      height: 165, // cm
      weight: 62, // kg
      bmi: 22.8,
      smoking_status: "Never smoked",
      alcohol_consumption: "Rare",
    },
    medications: [
      {
        name: "Salbutamol Inhaler",
        dosage: "100mcg",
        frequency: "As needed",
        start_date: "2005-03-10",
        prescribing_doctor: "Dr. Robert Williams",
      },
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed for migraines",
        start_date: "2018-11-05",
        prescribing_doctor: "Dr. Robert Williams",
      },
    ],
    care_plan: {
      id: "cp-002",
      created_date: "2022-02-15",
      updated_date: "2023-04-10",
      goals: [
        "Reduce frequency of asthma attacks",
        "Identify and avoid migraine triggers",
        "Maintain healthy lifestyle",
      ],
      interventions: ["Regular peak flow monitoring", "Headache diary maintenance", "Annual asthma review"],
      assigned_care_professionals: [
        {
          id: "cp-003",
          name: "Emily Brown",
          role: "Occupational Therapist",
        },
      ],
    },
    appointments: [
      {
        id: "app-003",
        date: "2023-05-10T11:30:00Z",
        type: "Asthma Review",
        care_professional: "Dr. Robert Williams",
        location: "Manchester Medical Center",
        status: "completed",
        notes: "Asthma well controlled. Continue current management plan.",
      },
      {
        id: "app-004",
        date: "2023-10-05T09:00:00Z",
        type: "General Check-up",
        care_professional: "Dr. Robert Williams",
        location: "Manchester Medical Center",
        status: "scheduled",
        notes: "Routine annual check-up",
      },
    ],
    notes: [
      {
        id: "note-003",
        date: "2023-05-10T12:15:00Z",
        author: "Dr. Robert Williams",
        content: "Patient reports good control of asthma symptoms. No recent severe migraine episodes.",
      },
    ],
    created_at: "2022-01-10T00:00:00Z",
    updated_at: "2023-05-10T00:00:00Z",
  },
  {
    id: "p-003",
    first_name: "Sarah",
    last_name: "Williams",
    date_of_birth: "1992-11-18",
    nhs_number: "3456789012",
    gender: "Female",
    status: "active",
    address: {
      street: "27 Pine Road",
      city: "Birmingham",
      postcode: "B1 1AA",
      country: "United Kingdom",
    },
    contact: {
      phone: "07700900345",
      email: "sarah.williams@example.com",
      emergency_contact_name: "Thomas Williams",
      emergency_contact_phone: "07700900678",
      emergency_contact_relationship: "Father",
    },
    medical_information: {
      primary_care_provider: "Dr. James Anderson",
      primary_care_provider_contact: "0121 345 6789",
      primary_condition: "Anxiety disorder diagnosed in 2018, Irritable Bowel Syndrome",
      allergies: ["Latex"],
      blood_type: "B+",
      height: 170, // cm
      weight: 65, // kg
      bmi: 22.5,
      smoking_status: "Never smoked",
      alcohol_consumption: "Occasional",
    },
    medications: [
      {
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        start_date: "2018-06-20",
        prescribing_doctor: "Dr. James Anderson",
      },
      {
        name: "Mebeverine",
        dosage: "135mg",
        frequency: "Three times daily",
        start_date: "2019-03-15",
        prescribing_doctor: "Dr. James Anderson",
      },
    ],
    care_plan: {
      id: "cp-003",
      created_date: "2022-03-05",
      updated_date: "2023-05-15",
      goals: ["Reduce anxiety symptoms", "Manage IBS symptoms through diet", "Develop stress management techniques"],
      interventions: [
        "Cognitive Behavioral Therapy sessions",
        "Dietary advice and food diary",
        "Regular exercise program",
      ],
      assigned_care_professionals: [
        {
          id: "cp-005",
          name: "Olivia Taylor",
          role: "Speech and Language Therapist",
        },
      ],
    },
    appointments: [
      {
        id: "app-005",
        date: "2023-04-20T13:45:00Z",
        type: "Mental Health Review",
        care_professional: "Dr. James Anderson",
        location: "Birmingham Health Center",
        status: "completed",
        notes: "Patient reports improvement in anxiety symptoms with current medication.",
      },
      {
        id: "app-006",
        date: "2023-07-15T10:30:00Z",
        type: "Gastroenterology Consultation",
        care_professional: "Dr. Lisa Chen",
        location: "Birmingham Digestive Health Clinic",
        status: "completed",
        notes: "IBS symptoms improved with dietary changes. Continue current management.",
      },
    ],
    notes: [
      {
        id: "note-004",
        date: "2023-04-20T14:30:00Z",
        author: "Dr. James Anderson",
        content: "Patient reports reduced anxiety symptoms. Sleep has improved. Continue current medication.",
      },
      {
        id: "note-005",
        date: "2023-07-15T11:15:00Z",
        author: "Dr. Lisa Chen",
        content:
          "Patient has been following low FODMAP diet with good results. IBS symptoms have decreased in frequency and severity.",
      },
    ],
    created_at: "2022-01-15T00:00:00Z",
    updated_at: "2023-07-15T00:00:00Z",
  },
  {
    id: "p-004",
    first_name: "Margaret",
    last_name: "Brown",
    date_of_birth: "1945-03-12",
    nhs_number: "4567890123",
    gender: "Female",
    status: "active",
    address: {
      street: "8 Elm Court",
      city: "Leeds",
      postcode: "LS1 1AA",
      country: "United Kingdom",
    },
    contact: {
      phone: "07700900456",
      email: "margaret.brown@example.com",
      emergency_contact_name: "Richard Brown",
      emergency_contact_phone: "07700900789",
      emergency_contact_relationship: "Son",
    },
    medical_information: {
      primary_care_provider: "Dr. Thomas Wilson",
      primary_care_provider_contact: "0113 456 7890",
      primary_condition: "Osteoarthritis, Hypertension, Type 2 Diabetes",
      allergies: ["Sulfa drugs", "Ibuprofen"],
      blood_type: "A-",
      height: 162, // cm
      weight: 70, // kg
      bmi: 26.7,
      smoking_status: "Former smoker, quit in 1995",
      alcohol_consumption: "None",
    },
    medications: [
      {
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "As needed for pain",
        start_date: "2015-05-10",
        prescribing_doctor: "Dr. Thomas Wilson",
      },
      {
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        start_date: "2010-08-15",
        prescribing_doctor: "Dr. Thomas Wilson",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        start_date: "2012-03-20",
        prescribing_doctor: "Dr. Thomas Wilson",
      },
    ],
    care_plan: {
      id: "cp-004",
      created_date: "2022-01-20",
      updated_date: "2023-06-05",
      goals: [
        "Manage pain from osteoarthritis",
        "Maintain blood pressure below 140/90",
        "Keep blood glucose levels within target range",
        "Maintain mobility and independence",
      ],
      interventions: [
        "Pain management strategies",
        "Regular blood pressure monitoring",
        "Weekly blood glucose checks",
        "Home safety assessment",
        "Mobility aids provision",
      ],
      assigned_care_professionals: [
        {
          id: "cp-002",
          name: "James Williams",
          role: "Physiotherapist",
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
        id: "app-007",
        date: "2023-06-05T09:30:00Z",
        type: "Geriatric Assessment",
        care_professional: "Dr. Thomas Wilson",
        location: "Leeds Elderly Care Center",
        status: "completed",
        notes: "Patient managing well at home with support. Mobility slightly decreased.",
      },
      {
        id: "app-008",
        date: "2023-08-10T11:00:00Z",
        type: "Diabetes Review",
        care_professional: "Dr. Sarah Adams",
        location: "Leeds Diabetes Clinic",
        status: "completed",
        notes: "Blood glucose levels well controlled. Continue current medication.",
      },
      {
        id: "app-009",
        date: "2023-11-15T10:00:00Z",
        type: "Physiotherapy Session",
        care_professional: "James Williams",
        location: "Leeds Community Health Center",
        status: "scheduled",
        notes: "Follow-up for home exercise program",
      },
    ],
    notes: [
      {
        id: "note-006",
        date: "2023-06-05T10:15:00Z",
        author: "Dr. Thomas Wilson",
        content:
          "Patient reports increased joint pain in knees. Discussed pain management strategies and referred for physiotherapy assessment.",
      },
      {
        id: "note-007",
        date: "2023-08-10T11:45:00Z",
        author: "Dr. Sarah Adams",
        content:
          "HbA1c level at 48 mmol/mol (6.5%), indicating good diabetes control. Patient adhering well to medication and diet recommendations.",
      },
    ],
    created_at: "2022-01-20T00:00:00Z",
    updated_at: "2023-08-10T00:00:00Z",
  },
  {
    id: "p-005",
    first_name: "Robert",
    last_name: "Taylor",
    date_of_birth: "1982-07-30",
    nhs_number: "5678901234",
    gender: "Male",
    status: "active",
    address: {
      street: "53 Birch Lane",
      city: "Sheffield",
      postcode: "S1 1AA",
      country: "United Kingdom",
    },
    contact: {
      phone: "07700900567",
      email: "robert.taylor@example.com",
      emergency_contact_name: "Laura Taylor",
      emergency_contact_phone: "07700900890",
      emergency_contact_relationship: "Wife",
    },
    medical_information: {
      primary_care_provider: "Dr. Jennifer Lee",
      primary_care_provider_contact: "0114 567 8901",
      primary_condition: "Lower back pain due to herniated disc, Depression",
      allergies: ["Codeine"],
      blood_type: "O+",
      height: 183, // cm
      weight: 90, // kg
      bmi: 26.9,
      smoking_status: "Current smoker - 10 cigarettes per day",
      alcohol_consumption: "Moderate - 10-15 units per week",
    },
    medications: [
      {
        name: "Naproxen",
        dosage: "500mg",
        frequency: "Twice daily",
        start_date: "2020-11-15",
        prescribing_doctor: "Dr. Jennifer Lee",
      },
      {
        name: "Fluoxetine",
        dosage: "20mg",
        frequency: "Once daily",
        start_date: "2021-02-10",
        prescribing_doctor: "Dr. Jennifer Lee",
      },
    ],
    care_plan: {
      id: "cp-005",
      created_date: "2022-02-05",
      updated_date: "2023-05-15",
      goals: [
        "Reduce back pain and improve mobility",
        "Manage depression symptoms",
        "Reduce smoking",
        "Return to work part-time",
      ],
      interventions: [
        "Physiotherapy for back pain",
        "Cognitive Behavioral Therapy for depression",
        "Smoking cessation support",
        "Occupational health assessment for work",
      ],
      assigned_care_professionals: [
        {
          id: "cp-002",
          name: "James Williams",
          role: "Physiotherapist",
        },
      ],
    },
    appointments: [
      {
        id: "app-010",
        date: "2023-05-15T14:00:00Z",
        type: "Back Pain Review",
        care_professional: "Dr. Jennifer Lee",
        location: "Sheffield Medical Center",
        status: "completed",
        notes:
          "Patient reports improvement in back pain. Depression symptoms stable. Discussed smoking cessation strategies.",
      },
      {
        id: "app-011",
        date: "2023-06-20T11:30:00Z",
        type: "Physiotherapy Session",
        care_professional: "James Williams",
        location: "Sheffield Physiotherapy Clinic",
        status: "completed",
        notes: "Good progress with exercises. Provided additional home exercise program.",
      },
      {
        id: "app-012",
        date: "2023-09-10T13:00:00Z",
        type: "Mental Health Review",
        care_professional: "Dr. Mark Johnson",
        location: "Sheffield Mental Health Center",
        status: "scheduled",
        notes: "Follow-up for depression management",
      },
    ],
    notes: [
      {
        id: "note-008",
        date: "2023-05-15T14:45:00Z",
        author: "Dr. Jennifer Lee",
        content:
          "Patient reports improvement in back pain. Depression symptoms stable. Discussed smoking cessation strategies.",
      },
      {
        id: "note-009",
        date: "2023-06-20T12:15:00Z",
        author: "James Williams",
        content:
          "Patient showing good compliance with exercise program. Range of motion improved. Strength exercises progressed.",
      },
    ],
    created_at: "2022-01-25T00:00:00Z",
    updated_at: "2023-06-20T00:00:00Z",
  },
]

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Find the patient with the matching ID
    const patient = demoPatients.find((p) => p.id === id)

    if (!patient) {
      return NextResponse.json({ error: `Patient with ID ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient details" }, { status: 500 })
  }
}
