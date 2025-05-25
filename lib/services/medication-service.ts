import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"
import { logActivity } from "./activity-log-service"

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
  // Log activity when medications are viewed
  await logActivity({
    tenantId,
    activityType: "medications_viewed",
    description: `Patient medications viewed`,
    patientId,
  })

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

  if (medications.length > 0) {
    // Log medication viewed activity
    await logActivity({
      tenantId,
      activityType: "medication_viewed",
      description: `Medication details viewed: ${medications[0].name}`,
      patientId: medications[0].patient_id,
      metadata: {
        medicationId,
        medicationName: medications[0].name,
      },
    })
  }

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

  // Log medication creation activity
  await logActivity({
    tenantId,
    activityType: "medication_created",
    description: `New medication added: ${medicationData.name}`,
    patientId: medicationData.patient_id,
    userId,
    metadata: {
      medicationName: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      status: medicationData.status,
    },
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
  // Get original medication data for comparison
  const originalMedication = await getMedicationById(tenantId, medicationId)

  const now = new Date().toISOString()
  const medications = await tenantUpdate<Medication>(tenantId, "medications", medicationId, {
    ...medicationData,
    updated_at: now,
    updated_by: userId,
  })

  if (medications.length > 0 && originalMedication) {
    // Determine which fields were updated
    const updatedFields = Object.keys(medicationData).filter(
      (key) => medicationData[key as keyof Partial<Medication>] !== originalMedication[key as keyof Medication],
    )

    // Log medication update activity
    await logActivity({
      tenantId,
      activityType: "medication_updated",
      description: `Medication updated: ${medications[0].name}`,
      patientId: medications[0].patient_id,
      userId,
      metadata: {
        medicationId,
        medicationName: medications[0].name,
        updatedFields,
        newStatus: medicationData.status,
      },
    })

    // If status changed to discontinued, log a specific activity
    if (medicationData.status === "discontinued" && originalMedication.status !== "discontinued") {
      await logActivity({
        tenantId,
        activityType: "medication_discontinued",
        description: `Medication discontinued: ${medications[0].name}`,
        patientId: medications[0].patient_id,
        userId,
        metadata: {
          medicationId,
          medicationName: medications[0].name,
          reason: medicationData.notes || "No reason provided",
        },
      })
    }
  }

  return medications.length > 0 ? medications[0] : null
}

// Delete a medication
export async function deleteMedication(
  tenantId: string,
  medicationId: string,
  userId?: string,
): Promise<Medication | null> {
  // Get medication details before deletion
  const medication = await getMedicationById(tenantId, medicationId)

  const medications = await tenantDelete<Medication>(tenantId, "medications", medicationId)

  if (medications.length > 0 && medication) {
    // Log medication deletion activity
    await logActivity({
      tenantId,
      activityType: "medication_deleted",
      description: `Medication deleted: ${medication.name}`,
      patientId: medication.patient_id,
      userId,
      metadata: {
        medicationId,
        medicationName: medication.name,
      },
    })
  }

  return medications.length > 0 ? medications[0] : null
}
