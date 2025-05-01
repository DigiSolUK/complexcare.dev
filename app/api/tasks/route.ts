import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.DATABASE_URL!)

// Demo data for tasks
const demoTasks = [
  {
    id: "1",
    title: "Review medication for John Smith",
    description: "Check for interactions with new prescription",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    assigned_to: "Dr. Johnson",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "demo-tenant",
  },
  {
    id: "2",
    title: "Schedule follow-up appointment for Sarah Johnson",
    description: "Need to check progress after therapy session",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    assigned_to: "Nurse Williams",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "demo-tenant",
  },
  {
    id: "3",
    title: "Update care plan for Michael Brown",
    description: "Incorporate new physical therapy recommendations",
    status: "completed",
    priority: "medium",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    assigned_to: "Dr. Smith",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    tenant_id: "demo-tenant",
  },
  {
    id: "4",
    title: "Process insurance claim for Emily Wilson",
    description: "Submit documentation for recent hospital stay",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 43200000).toISOString(),
    assigned_to: "Admin Staff",
    created_at: new Date(Date.now() - 129600000).toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "demo-tenant",
  },
  {
    id: "5",
    title: "Order medical supplies for David Taylor",
    description: "Need new mobility aids and wound dressings",
    status: "in-progress",
    priority: "low",
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    assigned_to: "Supply Manager",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    tenant_id: "demo-tenant",
  },
]

export async function GET(request: Request) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json(demoTasks)
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Query tasks from database using tagged template literal syntax
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check for demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({ success: true, message: "Task created successfully" })
    }

    // Get tenant ID from request
    const url = new URL(request.url)
    const tenantId =
      request.headers.get("x-tenant-id") || url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    // Parse request body
    const { title, description, status, priority, due_date, assigned_to } = await request.json()

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Insert task using tagged template literal syntax
    const result = await sql`
      INSERT INTO tasks (
        title, 
        description, 
        status, 
        priority, 
        due_date, 
        assigned_to, 
        tenant_id, 
        created_at, 
        updated_at
      )
      VALUES (
        ${title}, 
        ${description || null}, 
        ${status || "pending"}, 
        ${priority || "medium"}, 
        ${due_date || null}, 
        ${assigned_to || null}, 
        ${tenantId}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
