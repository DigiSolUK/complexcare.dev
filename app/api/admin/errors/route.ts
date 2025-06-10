import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getErrorLogs } from "@/lib/services/error-logging-service"
import { createApiHandler, AppError } from "@/lib/error-handler"

export const GET = createApiHandler(async (request: NextRequest) => {
  const session = await getSession()

  if (!session?.user) {
    throw new AppError("Unauthorized", 401, true, "low")
  }

  // Check if user has admin permissions
  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    throw new AppError("Forbidden - Admin access required", 403, true, "low")
  }

  const searchParams = request.nextUrl.searchParams
  const severity = searchParams.get("severity") || undefined
  const status = searchParams.get("status") || undefined

  const result = await getErrorLogs(session.user.tenant_id, {
    severity,
    status,
  })

  return NextResponse.json(result)
})
