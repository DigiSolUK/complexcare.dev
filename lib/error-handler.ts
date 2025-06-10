import { NextResponse } from "next/server"
import { logError } from "@/lib/services/error-logging-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export class AppError extends Error {
  statusCode: number
  isOperational: boolean
  severity: "low" | "medium" | "high" | "critical"

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    severity: "low" | "medium" | "high" | "critical" = "medium",
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.severity = severity
    Error.captureStackTrace(this, this.constructor)
  }
}

export async function handleApiError(
  error: unknown,
  context?: {
    url?: string
    method?: string
    userId?: string
    tenantId?: string
    componentPath?: string
  },
): Promise<NextResponse> {
  console.error("API Error:", error)

  let statusCode = 500
  let message = "Internal server error"
  let severity: "low" | "medium" | "high" | "critical" = "medium"

  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    severity = error.severity
  } else if (error instanceof Error) {
    message = error.message

    // Determine severity based on error type
    if (error.message.includes("Database") || error.message.includes("connection")) {
      severity = "critical"
    } else if (error.message.includes("Authentication") || error.message.includes("Permission")) {
      severity = "high"
    }
  }

  // Log error to database
  try {
    await logError({
      message,
      stack: error instanceof Error ? error.stack : undefined,
      severity,
      url: context?.url,
      method: context?.method,
      componentPath: context?.componentPath || "API Route",
      tenant_id: context?.tenantId || DEFAULT_TENANT_ID,
      user_id: context?.userId,
    })
  } catch (loggingError) {
    console.error("Failed to log error:", loggingError)
  }

  return NextResponse.json(
    {
      error: {
        message: statusCode === 500 ? "Internal server error" : message,
        statusCode,
      },
    },
    { status: statusCode },
  )
}

export function createApiHandler<T = any>(handler: (req: Request, context?: any) => Promise<T>) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleApiError(error, {
        url: req.url,
        method: req.method,
      })
    }
  }
}

// Validation helpers
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter((field) => !data[field])

  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400, true, "low")
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400, true, "low")
  }
  return true
}

export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    throw new AppError("Invalid ID format", 400, true, "low")
  }
  return true
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError("Invalid date format", 400, true, "low")
  }

  if (start > end) {
    throw new AppError("Start date must be before end date", 400, true, "low")
  }

  return true
}
