import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"

export type Medication = {
  id: string
  tenant_id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date: string | null
  instructions: string | null
  prescribed_by: string | null
  status: "active" | "discontinued" | "completed"
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Get all medications for a tenant
export async function getMedications(tenantId: string): Promise<Medication[]> {
  return tenantQuery<Medication>(tenantId, `SELECT * FROM medications ORDER BY name`)
}

// Get medications for a patient
export async function getMedicationsForPatient(tenantId: string, patientId: string): Promise<Medication[]> {
  return tenantQuery<Medication>(tenantId, `SELECT * FROM medications WHERE patient_id = $1 ORDER BY name`, [patientId])
}

// Get active medications for a patient
export async function getActiveMedicationsForPatient(tenantId: string, patientId: string): Promise<Medication[]> {
  return tenantQuery<Medication>(
    tenantId,
    `SELECT * FROM medications 
     WHERE patient_id = $1 
     AND status = 'active' 
     ORDER BY name`,
    [patientId],
  )
}

// Get a medication by ID
export async function getMedicationById(tenantId: string, medicationId: string): Promise<Medication | null> {
  const medications = await tenantQuery<Medication>(tenantId, `SELECT * FROM medications WHERE id = $1`, [medicationId])
  return medications.length > 0 ? medications[0] : null
}

// Create a new medication
export async function createMedication(
  tenantId: string,
  medicationData: Omit<Medication, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Medication> {
  const now = new Date().toISOString()
  const medications = await tenantInsert<Medication>(tenantId, "medications", {
    ...medicationData,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return medications[0]
}

// Update a medication
export async function updateMedication(
  tenantId: string,
  medicationId: string,
  medicationData: Partial<Medication>,
  userId: string,
): Promise<Medication | null> {
  const now = new Date().toISOString()
  const medications = await tenantUpdate<Medication>(tenantId, "medications", medicationId, {
    ...medicationData,
    updated_at: now,
    updated_by: userId,
  })
  return medications.length > 0 ? medications[0] : null
}

// Delete a medication
export async function deleteMedication(tenantId: string, medicationId: string): Promise<Medication | null> {
  const medications = await tenantDelete<Medication>(tenantId, "medications", medicationId)
  return medications.length > 0 ? medications[0] : null
}
