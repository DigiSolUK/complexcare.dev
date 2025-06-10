import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { resolveError } from "@/lib/services/error-logging-service"
import { createApiHandler, AppError, validateUUID } from "@/lib/error-handler"

export const POST = createApiHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession()

  if (!session?.user) {
    throw new AppError("Unauthorized", 401, true, "low")
  }

  // Check if user has admin permissions
  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    throw new AppError("Forbidden - Admin access required", 403, true, "low")
  }

  // Validate error ID
  validateUUID(params.id)

  const success = await resolveError(params.id, session.user.id, session.user.tenant_id)

  if (!success) {
    throw new AppError("Failed to resolve error", 500, true, "medium")
  }

  return NextResponse.json({ success: true })
})
