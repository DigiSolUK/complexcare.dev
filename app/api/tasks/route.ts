import { NextResponse } from "next/server"
import { getTasks, createTask } from "@/lib/services/task-service"

export async function GET(request: Request) {
  try {
    // Always use demo-tenant for consistency
    const tenantId = "demo-tenant"
    const tasks = await getTasks(tenantId)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // In demo mode, just return success with mock data
    const tenantId = "demo-tenant"
    const userId = "demo-user"

    // Parse the request body
    const body = await request.json()

    // Create a new task with the mock service
    const newTask = await createTask(tenantId, body, userId)

    return NextResponse.json(newTask)
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

