import { type NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/error-handling/api-error-handler"
import { executeQuery } from "@/lib/db"

/**
 * Get detailed error reports for diagnostics
 */
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const level = searchParams.get("level") || undefined
    const component = searchParams.get("component") || undefined
    const route = searchParams.get("route") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined

    // Build query conditions
    const conditions = []
    const params: any[] = []

    if (level) {
      conditions.push(`level = $${params.length + 1}`)
      params.push(level)
    }

    if (component) {
      conditions.push(`component = $${params.length + 1}`)
      params.push(component)
    }

    if (route) {
      conditions.push(`route = $${params.length + 1}`)
      params.push(route)
    }

    if (startDate) {
      conditions.push(`timestamp >= $${params.length + 1}`)
      params.push(startDate)
    }

    if (endDate) {
      conditions.push(`timestamp <= $${params.length + 1}`)
      params.push(endDate)
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM error_logs
      ${whereClause}
    `

    const countResult = await executeQuery(countQuery, params)
    const total = Number.parseInt(countResult[0]?.total || "0", 10)

    // Get errors with pagination
    const errorsQuery = `
      SELECT id, message, level, component, route, timestamp, stack, details
      FROM error_logs
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    const errors = await executeQuery(errorsQuery, [...params, limit, offset])

    // Return paginated results
    return NextResponse.json({
      data: errors,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    return handleApiError(error, req)
  }
}

/**
 * Clear error logs (for admin use)
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const before = searchParams.get("before") || undefined
    const id = searchParams.get("id") || undefined

    if (id) {
      // Delete specific error
      await executeQuery("DELETE FROM error_logs WHERE id = $1", [id])
      return NextResponse.json({ success: true, message: "Error deleted" })
    } else if (before) {
      // Delete errors before a certain date
      await executeQuery("DELETE FROM error_logs WHERE timestamp < $1", [before])
      return NextResponse.json({ success: true, message: "Errors deleted" })
    } else {
      // Delete all errors (dangerous!)
      await executeQuery("DELETE FROM error_logs")
      return NextResponse.json({ success: true, message: "All errors deleted" })
    }
  } catch (error) {
    return handleApiError(error, req)
  }
}
