import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { getCurrentTenantId } from "./tenant"

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

/**
 * Creates a successful API response
 */
export function apiSuccess<T>(data: T, meta?: ApiResponse<T>["meta"]): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  })
}

/**
 * Creates an error API response
 */
export function apiError(error: string | Error | ZodError, status = 400): NextResponse<ApiResponse<never>> {
  let errorMessage: string

  if (error instanceof ZodError) {
    // Format Zod validation errors
    errorMessage = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = String(error)
  }

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status },
  )
}

/**
 * Extracts and validates the tenant ID from a request
 */
export function getTenantIdFromRequest(req: NextRequest): string {
  // Try to get from URL params
  const url = new URL(req.url)
  const tenantId = url.searchParams.get("tenantId")

  // Validate and return
  return getCurrentTenantId(tenantId || undefined)
}

/**
 * Parses JSON from request with error handling
 */
export async function parseRequestBody<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T
  } catch (error) {
    throw new Error("Invalid JSON in request body")
  }
}
