// Demo patient service that doesn't rely on Auth0

// Demo data for patients
const demoPatients = [
  {
    id: "1",
    name: "John Smith",
    nhs_number: "123 456 7890",
    date_of_birth: "1975-05-15",
    care_needs: "Complex",
    status: "Active",
    address: "123 Main St, London, UK",
    phone: "020 1234 5678",
    email: "john.smith@example.com",
    emergency_contact: "Jane Smith (Wife) - 020 8765 4321",
    primary_care_provider: "Dr. Johnson",
    medical_conditions: ["Type 2 Diabetes", "Hypertension", "Osteoarthritis"],
    medications: ["Metformin", "Lisinopril", "Paracetamol"],
    allergies: ["Penicillin", "Shellfish"],
    notes: "Patient requires regular monitoring of blood sugar levels.",
    tenant_id: "demo-tenant",
    avatar_url: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    nhs_number: "234 567 8901",
    date_of_birth: "1982-11-22",
    care_needs: "High",
    status: "Active",
    address: "456 Oak Ave, Manchester, UK",
    phone: "0161 234 5678",
    email: "sarah.johnson@example.com",
    emergency_contact: "Michael Johnson (Husband) - 0161 876 5432",
    primary_care_provider: "Dr. Williams",
    medical_conditions: ["Multiple Sclerosis", "Depression"],
    medications: ["Interferon beta-1a", "Sertraline", "Vitamin D"],
    allergies: ["Sulfa drugs"],
    notes: "Patient has limited mobility and requires assistance with daily activities.",
    tenant_id: "demo-tenant",
    avatar_url: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: "3",
    name: "Michael Brown",
    nhs_number: "345 678 9012",
    date_of_birth: "1968-07-03",
    care_needs: "Medium",
    status: "Inactive",
    address: "789 Pine Rd, Birmingham, UK",
    phone: "0121 345 6789",
    email: "michael.brown@example.com",
    emergency_contact: "Susan Brown (Sister) - 0121 987 6543",
    primary_care_provider: "Dr. Taylor",
    medical_conditions: ["COPD", "Coronary Artery Disease"],
    medications: ["Salbutamol", "Aspirin", "Atorvastatin"],
    allergies: ["Latex"],
    notes: "Patient is a smoker and has been advised to quit.",
    tenant_id: "demo-tenant",
    avatar_url: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: "4",
    name: "Emily Wilson",
    nhs_number: "456 789 0123",
    date_of_birth: "1990-02-19",
    care_needs: "Complex",
    status: "Active",
    address: "101 Elm St, Glasgow, UK",
    phone: "0141 456 7890",
    email: "emily.wilson@example.com",
    emergency_contact: "Robert Wilson (Father) - 0141 098 7654",
    primary_care_provider: "Dr. Anderson",
    medical_conditions: ["Cystic Fibrosis", "Asthma", "Anxiety"],
    medications: ["Ivacaftor", "Salbutamol", "Fluoxetine"],
    allergies: ["Ibuprofen"],
    notes: "Patient requires regular respiratory therapy.",
    tenant_id: "demo-tenant",
    avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "5",
    name: "David Taylor",
    nhs_number: "567 890 1234",
    date_of_birth: "1955-09-30",
    care_needs: "High",
    status: "Active",
    address: "202 Maple Dr, Edinburgh, UK",
    phone: "0131 567 8901",
    email: "david.taylor@example.com",
    emergency_contact: "Margaret Taylor (Wife) - 0131 109 8765",
    primary_care_provider: "Dr. Roberts",
    medical_conditions: ["Parkinson's Disease", "Glaucoma", "Hypertension"],
    medications: ["Levodopa", "Timolol eye drops", "Amlodipine"],
    allergies: ["Codeine"],
    notes: "Patient experiences tremors and requires assistance with fine motor tasks.",
    tenant_id: "demo-tenant",
    avatar_url: "https://randomuser.me/api/portraits/men/78.jpg",
  },
]

export async function getPatients() {
  // In demo mode, return demo data
  return demoPatients
}

export async function getPatientById(id: string) {
  // In demo mode, find the patient in demo data
  const patient = demoPatients.find((patient) => patient.id === id)
  if (!patient) {
    throw new Error(`Patient with ID ${id} not found`)
  }
  return patient
}

export async function createPatient(patientData: any) {
  // In demo mode, just return success
  return {
    id: Math.random().toString(36).substring(7),
    ...patientData,
    tenant_id: "demo-tenant",
    avatar_url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "women" : "men"}/${Math.floor(Math.random() * 99)}.jpg`,
  }
}

export async function updatePatient(id: string, patientData: any) {
  // In demo mode, just return success
  return {
    id,
    ...patientData,
    tenant_id: "demo-tenant",
  }
}

export async function deletePatient(id: string) {
  // In demo mode, just return success
  return { success: true }
}

export async function getPatientCarePlans(patientId: string) {
  // Demo care plans for the patient
  return [
    {
      id: "cp1",
      patient_id: patientId,
      title: "Diabetes Management Plan",
      description: "Comprehensive plan for managing Type 2 Diabetes",
      status: "Active",
      start_date: "2023-01-15",
      end_date: "2023-07-15",
      review_date: "2023-04-15",
      assigned_to: "Dr. Johnson",
      created_at: "2023-01-10",
      updated_at: "2023-03-15",
      tenant_id: "demo-tenant",
    },
    {
      id: "cp2",
      patient_id: patientId,
      title: "Hypertension Management",
      description: "Blood pressure monitoring and medication management",
      status: "Active",
      start_date: "2023-02-01",
      end_date: "2023-08-01",
      review_date: "2023-05-01",
      assigned_to: "Dr. Williams",
      created_at: "2023-01-25",
      updated_at: "2023-03-10",
      tenant_id: "demo-tenant",
    },
  ]
}

