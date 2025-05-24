import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Return a demo task
      return NextResponse.json({
        id: params.id,
        title: "Demo Task",
        description: "This is a demo task",
        status: "pending",
        priority: "medium",
        dueDate: new Date().toISOString(),
        assigned_to: "Demo User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant_id: "demo-tenant",
      })
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get task ID from params
    const taskId = params.id

    // Query task using the new API
    const task = await sql.query("SELECT * FROM tasks WHERE id = $1 AND tenant_id = $2", [taskId, tenantId])

    if (!task || task.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task[0])
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({ success: true, message: "Task updated successfully" })
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get task ID from params
    const taskId = params.id

    // Parse request body
    const { title, description, status, priority, due_date, assigned_to } = await request.json()

    // Update task using the new API
    const result = await sql.query(
      `UPDATE tasks
      SET 
        title = COALESCE($3, title),
        description = COALESCE($4, description),
        status = COALESCE($5, status),
        priority = COALESCE($6, priority),
        due_date = COALESCE($7, due_date),
        assigned_to = COALESCE($8, assigned_to),
        updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *`,
      [taskId, tenantId, title, description, status, priority, due_date, assigned_to],
    )

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({ success: true, message: "Task deleted successfully" })
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Get task ID from params
    const taskId = params.id

    // Delete task using the new API
    const result = await sql.query("DELETE FROM tasks WHERE id = $1 AND tenant_id = $2 RETURNING id", [
      taskId,
      tenantId,
    ])

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
