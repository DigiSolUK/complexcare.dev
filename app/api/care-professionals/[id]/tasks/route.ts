import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL || "")

// Demo data for tasks
const demoTasks = [
  {
    id: "task-001",
    title: "Complete patient assessment",
    description: "Perform comprehensive assessment for new patient",
    status: "in-progress",
    priority: "high",
    due_date: "2023-06-20",
    patient_first_name: "John",
    patient_last_name: "Doe",
    patient_avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
  {
    id: "task-002",
    title: "Update care plan",
    description: "Review and update care plan based on recent assessment",
    status: "pending",
    priority: "medium",
    due_date: "2023-06-25",
    patient_first_name: "Jane",
    patient_last_name: "Smith",
    patient_avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
  {
    id: "task-003",
    title: "Submit medication report",
    description: "Complete and submit medication administration report",
    status: "completed",
    priority: "medium",
    due_date: "2023-06-15",
    patient_first_name: "Robert",
    patient_last_name: "Johnson",
    patient_avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Check if tasks table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks'
      ) as exists
    `

    if (!tableExists[0]?.exists) {
      console.log("Tasks table does not exist, returning demo data")
      return NextResponse.json({
        data: demoTasks,
        meta: {
          total: demoTasks.length,
          limit,
          offset,
          hasMore: offset + limit < demoTasks.length,
        },
      })
    }

    // Get column information
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'tasks'
    `

    console.log(
      "Tasks table columns:",
      columns.map((col) => col.column_name),
    )

    // Determine the correct column name for assigned_to
    let assignedToColumn = "assigned_to"
    if (columns.some((col) => col.column_name === "assigned_to_id")) {
      assignedToColumn = "assigned_to_id"
    } else if (columns.some((col) => col.column_name === "care_professional_id")) {
      assignedToColumn = "care_professional_id"
    }

    // Build a simple query that works with the available columns
    const selectColumns = ["id"]

    // Add other columns if they exist
    if (columns.some((col) => col.column_name === "title")) {
      selectColumns.push("title")
    }
    if (columns.some((col) => col.column_name === "description")) {
      selectColumns.push("description")
    }
    if (columns.some((col) => col.column_name === "status")) {
      selectColumns.push("status")
    }
    if (columns.some((col) => col.column_name === "priority")) {
      selectColumns.push("priority")
    }
    if (columns.some((col) => col.column_name === "due_date")) {
      selectColumns.push("due_date")
    }

    // Build and execute the query
    const query = `
      SELECT ${selectColumns.join(", ")}
      FROM tasks
      WHERE ${assignedToColumn} = $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    `

    console.log("Executing query:", query)
    const tasks = await sql.query(query, [careProfessionalId, limit, offset])

    // Count total tasks
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks
      WHERE ${assignedToColumn} = $1
    `

    const countResult = await sql.query(countQuery, [careProfessionalId])
    const total = Number.parseInt(countResult[0]?.total || "0", 10)

    // Transform the results to match expected format
    const transformedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title || "Untitled Task",
      description: task.description || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
      due_date: task.due_date || null,
      patient_first_name: null,
      patient_last_name: null,
      patient_avatar_url: "/placeholder.svg?height=40&width=40&query=patient",
    }))

    return NextResponse.json({
      data: transformedTasks,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching care professional tasks:", error)

    // Return demo data as fallback
    return NextResponse.json({
      data: demoTasks,
      meta: {
        total: demoTasks.length,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    })
  }
}
