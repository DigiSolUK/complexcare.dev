import { mockData } from "@/lib/db"

// Public API service that returns mock data
export const publicApiService = {
  // Patients
  async getPatients(tenantId = "tenant-1") {
    return mockData.patients.filter((p) => p.tenant_id === tenantId)
  },

  async getPatientById(id: string, tenantId = "tenant-1") {
    return mockData.patients.find((p) => p.id === id && p.tenant_id === tenantId) || null
  },

  // Care Professionals
  async getCareProfessionals(tenantId = "tenant-1") {
    return mockData.care_professionals.filter((cp) => cp.tenant_id === tenantId)
  },

  async getCareProfessionalById(id: string, tenantId = "tenant-1") {
    return mockData.care_professionals.find((cp) => cp.id === id && cp.tenant_id === tenantId) || null
  },

  // Appointments
  async getAppointments(tenantId = "tenant-1") {
    return mockData.appointments.filter((a) => a.tenant_id === tenantId)
  },

  async getAppointmentsByPatientId(patientId: string, tenantId = "tenant-1") {
    return mockData.appointments.filter((a) => a.patient_id === patientId && a.tenant_id === tenantId)
  },

  // Clinical Notes
  async getClinicalNotes(tenantId = "tenant-1") {
    return mockData.clinical_notes.filter((cn) => cn.tenant_id === tenantId && !cn.is_deleted)
  },

  async getClinicalNotesByPatientId(patientId: string, tenantId = "tenant-1") {
    return mockData.clinical_notes.filter(
      (cn) => cn.patient_id === patientId && cn.tenant_id === tenantId && !cn.is_deleted,
    )
  },

  // Tasks
  async getTasks(tenantId = "tenant-1") {
    return mockData.tasks.filter((t) => t.tenant_id === tenantId)
  },

  async getTasksByAssignee(assigneeId: string, tenantId = "tenant-1") {
    return mockData.tasks.filter((t) => t.assigned_to === assigneeId && t.tenant_id === tenantId)
  },
}
