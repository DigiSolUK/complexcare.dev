import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"
import { logActivity } from "./activity-log-service"

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
    // Log activity for viewing care plans
    await logActivity({
      tenantId,
      activityType: "care_plans_viewed",
      description: `Patient care plans viewed`,
      patientId,
    })

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

    if (carePlans.length > 0) {
      const carePlan = carePlans[0]

      // Log activity for viewing a specific care plan
      await logActivity({
        tenantId,
        activityType: "care_plan_viewed",
        description: `Care plan viewed: ${carePlan.title}`,
        patientId: carePlan.patient_id,
        metadata: {
          carePlanId,
          carePlanTitle: carePlan.title,
          status: carePlan.status,
        },
      })

      return carePlan
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

    if (carePlans.length > 0) {
      const newCarePlan = carePlans[0]

      // Log activity for creating a care plan
      await logActivity({
        tenantId,
        activityType: "care_plan_created",
        description: `Care plan created: ${newCarePlan.title}`,
        patientId: carePlanData.patient_id,
        userId,
        metadata: {
          carePlanId: newCarePlan.id,
          carePlanTitle: newCarePlan.title,
          status: newCarePlan.status,
          startDate: newCarePlan.start_date,
          endDate: newCarePlan.end_date,
        },
      })

      return newCarePlan
    }

    return null
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
    // Get original care plan data for comparison
    const originalCarePlan = await getCarePlanById(tenantId, carePlanId)
    if (!originalCarePlan) return null

    const now = new Date().toISOString()
    const carePlans = await tenantUpdate<CarePlan>(tenantId, "care_plans", carePlanId, {
      ...carePlanData,
      updated_at: now,
      updated_by: userId,
    })

    if (carePlans.length > 0) {
      const updatedCarePlan = carePlans[0]

      // Determine which fields were updated
      const updatedFields = []
      if (carePlanData.title && carePlanData.title !== originalCarePlan.title) updatedFields.push("title")
      if (carePlanData.description && carePlanData.description !== originalCarePlan.description)
        updatedFields.push("description")
      if (carePlanData.start_date && carePlanData.start_date !== originalCarePlan.start_date)
        updatedFields.push("start_date")
      if (carePlanData.end_date && carePlanData.end_date !== originalCarePlan.end_date) updatedFields.push("end_date")
      if (carePlanData.status && carePlanData.status !== originalCarePlan.status) updatedFields.push("status")
      if (carePlanData.goals && carePlanData.goals !== originalCarePlan.goals) updatedFields.push("goals")
      if (carePlanData.interventions && carePlanData.interventions !== originalCarePlan.interventions)
        updatedFields.push("interventions")
      if (carePlanData.review_date && carePlanData.review_date !== originalCarePlan.review_date)
        updatedFields.push("review_date")
      if (carePlanData.assigned_to && carePlanData.assigned_to !== originalCarePlan.assigned_to)
        updatedFields.push("assigned_to")

      // Log activity for updating a care plan
      await logActivity({
        tenantId,
        activityType: "care_plan_updated",
        description: `Care plan updated: ${updatedCarePlan.title}`,
        patientId: updatedCarePlan.patient_id,
        userId,
        metadata: {
          carePlanId,
          carePlanTitle: updatedCarePlan.title,
          updatedFields,
          newStatus: carePlanData.status,
        },
      })

      // If status changed, log a specific activity
      if (carePlanData.status && carePlanData.status !== originalCarePlan.status) {
        let statusChangeType = ""
        let statusChangeDescription = ""

        switch (carePlanData.status) {
          case "active":
            statusChangeType = "care_plan_activated"
            statusChangeDescription = `Care plan activated: ${updatedCarePlan.title}`
            break
          case "completed":
            statusChangeType = "care_plan_completed"
            statusChangeDescription = `Care plan completed: ${updatedCarePlan.title}`
            break
          case "cancelled":
            statusChangeType = "care_plan_cancelled"
            statusChangeDescription = `Care plan cancelled: ${updatedCarePlan.title}`
            break
          default:
            break
        }

        if (statusChangeType) {
          await logActivity({
            tenantId,
            activityType: statusChangeType,
            description: statusChangeDescription,
            patientId: updatedCarePlan.patient_id,
            userId,
            metadata: {
              carePlanId,
              carePlanTitle: updatedCarePlan.title,
              previousStatus: originalCarePlan.status,
            },
          })
        }
      }

      return updatedCarePlan
    }

    return null
  } catch (error) {
    console.error("Error updating care plan:", error)
    return null
  }
}

// Delete a care plan
export async function deleteCarePlan(tenantId: string, carePlanId: string, userId?: string): Promise<boolean> {
  try {
    // Get care plan details before deletion
    const carePlan = await getCarePlanById(tenantId, carePlanId)
    if (!carePlan) return false

    const carePlans = await tenantDelete<CarePlan>(tenantId, "care_plans", carePlanId)

    if (carePlans.length > 0) {
      // Log activity for deleting a care plan
      await logActivity({
        tenantId,
        activityType: "care_plan_deleted",
        description: `Care plan deleted: ${carePlan.title}`,
        patientId: carePlan.patient_id,
        userId,
        metadata: {
          carePlanId,
          carePlanTitle: carePlan.title,
          status: carePlan.status,
        },
      })

      return true
    }

    return false
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
