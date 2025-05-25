import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"

export type CarePlan = {
  id: string
  tenant_id: string
  patient_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  status: "draft" | "active" | "completed" | "cancelled"
  goals: string | null
  interventions: string | null
  review_date: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Get all care plans for a tenant
export async function getCarePlans(tenantId: string): Promise<CarePlan[]> {
  try {
    return tenantQuery<CarePlan>(
      tenantId,
      `
      SELECT * FROM care_plans 
      ORDER BY start_date DESC
    `,
    )
  } catch (error) {
    console.error("Error fetching care plans:", error)
    return []
  }
}

// Get care plans for a patient
export async function getCarePlansForPatient(tenantId: string, patientId: string): Promise<CarePlan[]> {
  try {
    return tenantQuery<CarePlan>(
      tenantId,
      `
      SELECT * FROM care_plans 
      WHERE patient_id = $1 
      ORDER BY start_date DESC
    `,
      [patientId],
    )
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
      SELECT * FROM care_plans 
      WHERE id = $1
    `,
      [carePlanId],
    )
    return carePlans.length > 0 ? carePlans[0] : null
  } catch (error) {
    console.error("Error fetching care plan:", error)
    return null
  }
}

// Create a new care plan
export async function createCarePlan(
  tenantId: string,
  carePlanData: Omit<CarePlan, "id" | "tenant_id" | "created_at" | "updated_at">,
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
  carePlanData: Partial<CarePlan>,
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
      `SELECT COUNT(*) as count FROM care_plans WHERE status = 'active'`,
    )
    return result[0]?.count || 0
  } catch (error) {
    console.error("Error counting active care plans:", error)
    return 0
  }
}
