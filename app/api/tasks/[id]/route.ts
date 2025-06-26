import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

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

    // Query task using tagged template literal syntax
    const task = await sql`
      SELECT * FROM tasks
      WHERE id = ${taskId} AND tenant_id = ${tenantId}
    `

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

    // Update task using tagged template literal syntax
    const result = await sql`
      UPDATE tasks
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        assigned_to = COALESCE(${assigned_to}, assigned_to),
        updated_at = NOW()
      WHERE id = ${taskId} AND tenant_id = ${tenantId}
      RETURNING *
    `

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

    // Delete task using tagged template literal syntax
    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${taskId} AND tenant_id = ${tenantId}
      RETURNING id
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
