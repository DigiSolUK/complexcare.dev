import type { NextRequest } from "next/server"
import { z } from "zod"
import {
  getTimesheetById,
  updateTimesheet,
  deleteTimesheet,
  approveTimesheet,
  type UpdateTimesheetInput,
} from "@/lib/services/timesheet-service"
import { apiError, apiSuccess, parseRequestBody, getTenantIdFromRequest } from "@/lib/api-utils"
import { idSchema, updateTimesheetSchema } from "@/lib/validations/schemas"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID
    const id = idSchema.parse(params.id)

    // Get and validate tenant ID
    const tenantId = getTenantIdFromRequest(req)

    // Get timesheet
    const timesheet = await getTimesheetById(id, tenantId)

    if (!timesheet) {
      return apiError("Timesheet not found", 404)
    }

    return apiSuccess(timesheet)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID
    const id = idSchema.parse(params.id)

    // Parse request body
    const body = await parseRequestBody<UpdateTimesheetInput>(req)

    // Get tenant ID from request
    const tenantId = getTenantIdFromRequest(req)

    // Validate with Zod
    const validatedData = updateTimesheetSchema.parse(body)

    // Update timesheet
    const timesheet = await updateTimesheet(id, validatedData, tenantId)

    return apiSuccess(timesheet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error, 400)
    }
    return apiError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID
    const id = idSchema.parse(params.id)

    // Get tenant ID from request
    const tenantId = getTenantIdFromRequest(req)

    // Delete timesheet
    const success = await deleteTimesheet(id, tenantId)

    if (!success) {
      return apiError("Timesheet not found", 404)
    }

    return apiSuccess({ deleted: true })
  } catch (error) {
    return apiError(error)
  }
}

// Special route for approving timesheets
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate ID
    const id = idSchema.parse(params.id)

    // Parse request body
    const body = await parseRequestBody<{ action: string; approvedBy: string }>(req)

    // Get tenant ID from request
    const tenantId = getTenantIdFromRequest(req)

    // Validate action
    if (body.action !== "approve") {
      return apiError("Invalid action. Only 'approve' is supported.", 400)
    }

    // Validate approvedBy
    if (!body.approvedBy) {
      return apiError("approvedBy is required", 400)
    }

    // Approve timesheet
    const timesheet = await approveTimesheet(id, body.approvedBy, tenantId)

    return apiSuccess(timesheet)
  } catch (error) {
    return apiError(error)
  }
}
