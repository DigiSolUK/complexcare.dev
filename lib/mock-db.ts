// Mock database service for preview environment
export const mockDb = {
  patients: [
    { id: "1", name: "John Doe", nhsNumber: "NHS123456", dateOfBirth: "1980-01-01", status: "Active" },
    { id: "2", name: "Jane Smith", nhsNumber: "NHS654321", dateOfBirth: "1975-05-15", status: "Active" },
  ],
  careProfessionals: [
    { id: "1", name: "Dr. Alice Johnson", role: "Doctor", specialization: "General Practice" },
    { id: "2", name: "Nurse Bob Williams", role: "Nurse", specialization: "Community Care" },
  ],
  tasks: [
    { id: "1", title: "Follow-up call", dueDate: "2023-06-01", assignedTo: "1", status: "Pending" },
    { id: "2", title: "Medication review", dueDate: "2023-06-05", assignedTo: "2", status: "Completed" },
  ],
  appointments: [
    { id: "1", patientId: "1", professionalId: "1", date: "2023-06-10", time: "09:00", status: "Scheduled" },
    { id: "2", patientId: "2", professionalId: "2", date: "2023-06-12", time: "14:30", status: "Scheduled" },
  ],
  medications: [
    { id: "1", patientId: "1", name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily" },
    { id: "2", patientId: "2", name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
  ],
  clinicalNotes: [
    {
      id: "1",
      patientId: "1",
      professionalId: "1",
      date: "2023-05-20",
      content: "Patient reported improvement in symptoms.",
    },
    {
      id: "2",
      patientId: "2",
      professionalId: "2",
      date: "2023-05-22",
      content: "Blood pressure remains elevated. Adjusting medication.",
    },
  ],

  // Mock query function that returns data based on the query
  query: async (text, params = []) => {
    console.log("Mock DB Query:", text, params)

    // Simple query parser to return appropriate mock data
    if (text.toLowerCase().includes("from patients")) {
      return { rows: mockDb.patients }
    } else if (text.toLowerCase().includes("from care_professionals")) {
      return { rows: mockDb.careProfessionals }
    } else if (text.toLowerCase().includes("from tasks")) {
      return { rows: mockDb.tasks }
    } else if (text.toLowerCase().includes("from appointments")) {
      return { rows: mockDb.appointments }
    } else if (text.toLowerCase().includes("from medications")) {
      return { rows: mockDb.medications }
    } else if (text.toLowerCase().includes("from clinical_notes")) {
      return { rows: mockDb.clinicalNotes }
    }

    // Default empty response
    return { rows: [] }
  },
}

export default mockDb
