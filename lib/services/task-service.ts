import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface Task {
  id: string
  tenant_id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  assigned_to: string
  created_by: string
  related_to_type: string
  related_to_id: string
  created_at: string
  updated_at: string
  completed_at: string | null
  deleted_at: string | null
}

export async function getTasksByAssignee(
  tenantId: string = DEFAULT_TENANT_ID,
  userId: string,
  limit = 10,
): Promise<Task[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM tasks
      WHERE tenant_id = ${tenantId}
      AND assigned_to = ${userId}
      AND deleted_at IS NULL
      AND (status = 'pending' OR status = 'in_progress')
      ORDER BY due_date ASC, priority DESC
      LIMIT ${limit}
    `

    return result as Task[]
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}
