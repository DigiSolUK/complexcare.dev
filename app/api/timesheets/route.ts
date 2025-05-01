import type { NextRequest } from "next/server"
import { z } from "zod"
import { createTimesheet, getTimesheets, type CreateTimesheetInput } from "@/lib/services/timesheet-service"
import { apiError, apiSuccess, parseRequestBody, getTenantIdFromRequest } from "@/lib/api-utils"
import { createTimesheetSchema } from "@/lib/validations/schemas"

export async function GET(req: NextRequest) {
  try {
    // Get and validate tenant ID
    const tenantId = getTenantIdFromRequest(req)

    // Get query parameters
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId") || undefined
    const status = url.searchParams.get("status") || undefined

    // Get timesheets
    const timesheets = await getTimesheets(tenantId, userId, status)

    return apiSuccess(timesheets)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await parseRequestBody<CreateTimesheetInput>(req)

    // Get tenant ID from request and ensure it's used
    const tenantId = getTenantIdFromRequest(req)
    body.tenantId = tenantId

    // Validate with Zod
    const validatedData = createTimesheetSchema.parse(body)

    // Create timesheet
    const timesheet = await createTimesheet(validatedData)

    return apiSuccess(timesheet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error, 400)
    }
    return apiError(error)
  }
}
