import type { Patient } from "@/types/patient"

// Mock data with avatars
const mockPatients: Patient[] = [
  {
    id: "p1",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1975-05-15",
    nhsNumber: "123 456 7890",
    address: "123 Main St, London, UK",
    phoneNumber: "07700 900123",
    email: "john.smith@example.com",
    emergencyContact: "Jane Smith: 07700 900124",
    medicalConditions: ["Diabetes Type 2", "Hypertension"],
    medications: ["Metformin", "Lisinopril"],
    allergies: ["Penicillin"],
    notes: "Patient prefers afternoon appointments.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "active",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-06-10T14:15:00Z",
  },
  {
    id: "p2",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1982-11-22",
    nhsNumber: "234 567 8901",
    address: "456 Oak Ave, Manchester, UK",
    phoneNumber: "07700 900125",
    email: "sarah.johnson@example.com",
    emergencyContact: "Michael Johnson: 07700 900126",
    medicalConditions: ["Asthma", "Anxiety"],
    medications: ["Ventolin", "Sertraline"],
    allergies: ["Latex", "Peanuts"],
    notes: "Patient requires an interpreter for appointments.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "active",
    createdAt: "2023-02-20T09:15:00Z",
    updatedAt: "2023-06-15T11:30:00Z",
  },
  {
    id: "p3",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1968-07-03",
    nhsNumber: "345 678 9012",
    address: "789 Pine Ln, Birmingham, UK",
    phoneNumber: "07700 900127",
    email: "michael.brown@example.com",
    emergencyContact: "Emily Brown: 07700 900128",
    medicalConditions: ["Depression"],
    medications: ["Fluoxetine"],
    allergies: [],
    notes: "Patient prefers email communication.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "inactive",
    createdAt: "2023-03-10T14:45:00Z",
    updatedAt: "2023-06-05T16:20:00Z",
  },
  {
    id: "p4",
    firstName: "Emily",
    lastName: "Wilson",
    dateOfBirth: "1990-02-19",
    nhsNumber: "456 789 0123",
    address: "101 Elm St, Glasgow, UK",
    phoneNumber: "07700 900129",
    email: "emily.wilson@example.com",
    emergencyContact: "Robert Wilson: 07700 900130",
    medicalConditions: ["Rheumatoid Arthritis", "Osteoporosis", "Hypertension"],
    medications: ["Methotrexate", "Calcium supplements", "Vitamin D"],
    allergies: ["Sulfa drugs"],
    notes: "Patient uses a wheelchair and requires accessible facilities.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    status: "active",
    createdAt: "2023-01-25T11:30:00Z",
    updatedAt: "2023-06-20T10:45:00Z",
  },
  {
    id: "p5",
    firstName: "David",
    lastName: "Taylor",
    dateOfBirth: "1955-09-30",
    nhsNumber: "567 890 1234",
    address: "202 Cedar Rd, Edinburgh, UK",
    phoneNumber: "07700 900131",
    email: "david.taylor@example.com",
    emergencyContact: "Olivia Taylor: 07700 900132",
    medicalConditions: ["Epilepsy", "Hypertension"],
    medications: ["Lamotrigine"],
    allergies: ["Shellfish"],
    notes: "Patient requires reminder calls for appointments.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    status: "active",
    createdAt: "2023-02-15T13:20:00Z",
    updatedAt: "2023-05-30T15:10:00Z",
  },
  {
    id: "p6",
    firstName: "Jessica",
    lastName: "Lee",
    dateOfBirth: "1987-12-12",
    nhsNumber: "678 901 2345",
    address: "303 Maple Dr, Cardiff, UK",
    phoneNumber: "07700 900133",
    email: "jessica.lee@example.com",
    emergencyContact: "Daniel Lee: 07700 900134",
    medicalConditions: ["Migraine"],
    medications: ["Sumatriptan"],
    allergies: ["Aspirin"],
    notes: "Patient prefers morning appointments.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    status: "on hold",
    createdAt: "2023-03-05T10:15:00Z",
    updatedAt: "2023-06-25T09:30:00Z",
  },
  {
    id: "p7",
    firstName: "Robert",
    lastName: "Martin",
    dateOfBirth: "1972-04-25",
    nhsNumber: "789 012 3456",
    address: "404 Birch St, Belfast, UK",
    phoneNumber: "07700 900135",
    email: "robert.martin@example.com",
    emergencyContact: "Mary Martin: 07700 900136",
    medicalConditions: ["COPD", "Diabetes Type 1", "Heart Disease"],
    medications: ["Salbutamol", "Insulin", "Atorvastatin"],
    allergies: ["Ibuprofen"],
    notes: "Patient requires oxygen therapy.",
    tenantId: "demo-tenant",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    status: "active",
    createdAt: "2023-01-10T08:45:00Z",
    updatedAt: "2023-06-18T14:20:00Z",
  },
]

export async function getPatients(tenantId?: string): Promise<Patient[]> {
  try {
    // Always return mock data to avoid tenant ID issues
    return mockPatients
  } catch (error) {
    console.error("Error fetching patients:", error)
    return mockPatients // Fallback to mock data
  }
}

export async function getPatientById(id: string, tenantId?: string): Promise<Patient | null> {
  try {
    // Always return mock data to avoid tenant ID issues
    return mockPatients.find((patient) => patient.id === id) || null
  } catch (error) {
    console.error("Error fetching patient:", error)
    return mockPatients.find((patient) => patient.id === id) || null // Fallback to mock data
  }
}

export async function createPatient(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
  try {
    // In a real app, this would create a patient in the database
    // For now, return a mock patient with a generated ID
    const newPatient: Patient = {
      ...patient,
      id: `p${mockPatients.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newPatient
  } catch (error) {
    console.error("Error creating patient:", error)
    throw error
  }
}

export async function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  try {
    // In a real app, this would update a patient in the database
    // For now, return a mock patient
    const existingPatient = mockPatients.find((p) => p.id === id)
    if (!existingPatient) {
      throw new Error(`Patient with ID ${id} not found`)
    }
    const updatedPatient: Patient = {
      ...existingPatient,
      ...patient,
      updatedAt: new Date().toISOString(),
    }
    return updatedPatient
  } catch (error) {
    console.error("Error updating patient:", error)
    throw error
  }
}

export async function deletePatient(id: string): Promise<void> {
  try {
    // In a real app, this would delete a patient from the database
    // For now, do nothing
  } catch (error) {
    console.error("Error deleting patient:", error)
    throw error
  }
}

