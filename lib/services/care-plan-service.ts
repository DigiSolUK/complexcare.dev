import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"
import type { CarePlan } from "@/types"

// Get all care plans for a tenant, with patient and assigned professional names
export async function getCarePlans(tenantId: string): Promise<CarePlan[]> {
  try {
    const carePlans = await tenantQuery<CarePlan>(
      tenantId,
      `
      SELECT
        cp.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        cp_assigned.first_name AS assigned_to_first_name,
        cp_assigned.last_name AS assigned_to_last_name
      FROM care_plans cp
      JOIN patients p ON cp.patient_id = p.id
      LEFT JOIN care_professionals cp_assigned ON cp.assigned_to = cp_assigned.id
      WHERE cp.tenant_id = $1
      ORDER BY cp.start_date DESC
    `,
      [tenantId],
    )

    return carePlans.map((cp: any) => ({
      ...cp,
      patient_name: `${cp.patient_first_name} ${cp.patient_last_name}`,
      assigned_to_name: cp.assigned_to_first_name ? `${cp.assigned_to_first_name} ${cp.assigned_to_last_name}` : null,
    }))
  } catch (error) {
    console.error("Error fetching care plans:", error)
    return []
  }
}

// Get care plans for a patient
export async function getCarePlansForPatient(tenantId: string, patientId: string): Promise<CarePlan[]> {
  try {
    const carePlans = await tenantQuery<CarePlan>(
      tenantId,
      `
      SELECT
        cp.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        cp_assigned.first_name AS assigned_to_first_name,
        cp_assigned.last_name AS assigned_to_last_name
      FROM care_plans cp
      JOIN patients p ON cp.patient_id = p.id
      LEFT JOIN care_professionals cp_assigned ON cp.assigned_to = cp_assigned.id
      WHERE cp.tenant_id = $1 AND cp.patient_id = $2
      ORDER BY cp.start_date DESC
    `,
      [tenantId, patientId],
    )

    return carePlans.map((cp: any) => ({
      ...cp,
      patient_name: `${cp.patient_first_name} ${cp.patient_last_name}`,
      assigned_to_name: cp.assigned_to_first_name ? `${cp.assigned_to_first_name} ${cp.assigned_to_last_name}` : null,
    }))
  } catch (error) {
    console.error("Error fetching patient care plans:", error)
    return []
  }
}

// Get a care plan by ID
export async function getCarePlanById(tenantId: string, carePlanId: string): Promise<CarePlan | null> {
  try {
    const carePlans = await tenantQuery<CarePlan>(
      tenantId,
      `
      SELECT
        cp.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        cp_assigned.first_name AS assigned_to_first_name,
        cp_assigned.last_name AS assigned_to_last_name
      FROM care_plans cp
      JOIN patients p ON cp.patient_id = p.id
      LEFT JOIN care_professionals cp_assigned ON cp.assigned_to = cp_assigned.id
      WHERE cp.tenant_id = $1 AND cp.id = $2
    `,
      [tenantId, carePlanId],
    )
    const carePlan = carePlans.length > 0 ? carePlans[0] : null
    if (carePlan) {
      return {
        ...carePlan,
        patient_name: `${(carePlan as any).patient_first_name} ${(carePlan as any).patient_last_name}`,
        assigned_to_name: (carePlan as any).assigned_to_first_name
          ? `${(carePlan as any).assigned_to_first_name} ${(carePlan as any).assigned_to_last_name}`
          : null,
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching care plan:", error)
    return null
  }
}

// Create a new care plan
export async function createCarePlan(
  tenantId: string,
  carePlanData: Omit<CarePlan, "id" | "tenant_id" | "created_at" | "updated_at" | "patient_name" | "assigned_to_name">,
  userId: string,
): Promise<CarePlan | null> {
  try {
    const now = new Date().toISOString()
    const carePlans = await tenantInsert<CarePlan>(tenantId, "care_plans", {
      ...carePlanData,
      tenant_id: tenantId,
      created_at: now,
      updated_at: now,
      created_by: userId,
      updated_by: userId,
    })
    return carePlans.length > 0 ? carePlans[0] : null
  } catch (error) {
    console.error("Error creating care plan:", error)
    return null
  }
}

// Update a care plan
export async function updateCarePlan(
  tenantId: string,
  carePlanId: string,
  carePlanData: Partial<Omit<CarePlan, "patient_name" | "assigned_to_name">>,
  userId: string,
): Promise<CarePlan | null> {
  try {
    const now = new Date().toISOString()
    const carePlans = await tenantUpdate<CarePlan>(tenantId, "care_plans", carePlanId, {
      ...carePlanData,
      updated_at: now,
      updated_by: userId,
    })
    return carePlans.length > 0 ? carePlans[0] : null
  } catch (error) {
    console.error("Error updating care plan:", error)
    return null
  }
}

// Delete a care plan
export async function deleteCarePlan(tenantId: string, carePlanId: string): Promise<boolean> {
  try {
    const carePlans = await tenantDelete<CarePlan>(tenantId, "care_plans", carePlanId)
    return carePlans.length > 0
  } catch (error) {
    console.error("Error deleting care plan:", error)
    return false
  }
}

// Get active care plans count
export async function getActiveCarePlansCount(tenantId: string): Promise<number> {
  try {
    const result = await tenantQuery<{ count: number }>(
      tenantId,
      `SELECT COUNT(*) as count FROM care_plans WHERE status = 'active' AND tenant_id = $1`,
      [tenantId],
    )
    return result[0]?.count || 0
  } catch (error) {
    console.error("Error counting active care plans:", error)
    return 0
  }
}
