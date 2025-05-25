import { type NextRequest, NextResponse } from "next/server"
import { logError } from "./error-logger"

export interface ApiErrorOptions {
  status?: number
  code?: string
  details?: Record<string, any>
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  status: number
  code: string
  details?: Record<string, any>

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = "ApiError"
    this.status = options.status || 500
    this.code = options.code || "INTERNAL_SERVER_ERROR"
    this.details = options.details
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, req: NextRequest) {
  // Determine if this is a known API error or an unknown error
  const isApiError = error instanceof ApiError

  // Default values
  let status = 500
  let code = "INTERNAL_SERVER_ERROR"
  let message = "An unexpected error occurred"
  let details = undefined

  // Extract error information
  if (isApiError) {
    status = error.status
    code = error.code
    message = error.message
    details = error.details
  } else if (error instanceof Error) {
    message = error.message
  }

  // Log the error with context
  logError(error instanceof Error ? error : new Error(String(error)), {
    route: req.nextUrl.pathname,
    action: "API Request",
    input: {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    },
  })

  // Return consistent error response
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  )
}

/**
 * Create common API errors
 */
export const ApiErrors = {
  notFound: (message = "Resource not found", details?: Record<string, any>) =>
    new ApiError(message, { status: 404, code: "NOT_FOUND", details }),

  badRequest: (message = "Invalid request", details?: Record<string, any>) =>
    new ApiError(message, { status: 400, code: "BAD_REQUEST", details }),

  unauthorized: (message = "Unauthorized", details?: Record<string, any>) =>
    new ApiError(message, { status: 401, code: "UNAUTHORIZED", details }),

  forbidden: (message = "Forbidden", details?: Record<string, any>) =>
    new ApiError(message, { status: 403, code: "FORBIDDEN", details }),

  conflict: (message = "Resource conflict", details?: Record<string, any>) =>
    new ApiError(message, { status: 409, code: "CONFLICT", details }),

  tooManyRequests: (message = "Too many requests", details?: Record<string, any>) =>
    new ApiError(message, { status: 429, code: "TOO_MANY_REQUESTS", details }),

  internal: (message = "Internal server error", details?: Record<string, any>) =>
    new ApiError(message, { status: 500, code: "INTERNAL_SERVER_ERROR", details }),
}
