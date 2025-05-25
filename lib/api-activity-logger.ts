import type { NextRequest, NextResponse } from "next/server"
import { logActivity } from "./services/activity-log-service"

type ApiActivityOptions = {
  tenantId: string
  activityType: string
  description: string
  patientId?: string
  userId?: string
  metadata?: Record<string, any>
}

/**
 * Middleware to log API activities
 */
export async function logApiActivity(req: NextRequest, res: NextResponse, options: ApiActivityOptions) {
  try {
    await logActivity({
      tenantId: options.tenantId,
      activityType: options.activityType,
      description: options.description,
      patientId: options.patientId,
      userId: options.userId,
      metadata: {
        ...options.metadata,
        method: req.method,
        url: req.url,
        statusCode: res.status,
      },
    })
  } catch (error) {
    console.error("Error logging API activity:", error)
  }
}

/**
 * Wrapper for API handlers to log activities
 */
export function withActivityLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: Omit<ApiActivityOptions, "tenantId" | "patientId" | "userId"> & {
    getTenantId: (req: NextRequest) => string
    getPatientId?: (req: NextRequest) => string | undefined
    getUserId?: (req: NextRequest) => string | undefined
    getMetadata?: (req: NextRequest, res: NextResponse) => Record<string, any>
  },
) {
  return async (req: NextRequest) => {
    const res = await handler(req)

    try {
      const tenantId = options.getTenantId(req)
      const patientId = options.getPatientId ? options.getPatientId(req) : undefined
      const userId = options.getUserId ? options.getUserId(req) : undefined
      const metadata = options.getMetadata ? options.getMetadata(req, res) : undefined

      await logApiActivity(req, res, {
        tenantId,
        activityType: options.activityType,
        description: options.description,
        patientId,
        userId,
        metadata,
      })
    } catch (error) {
      console.error("Error in activity logging wrapper:", error)
    }

    return res
  }
}
