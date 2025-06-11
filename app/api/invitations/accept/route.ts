import { NextResponse } from "next/server"
import { acceptTenantInvitationAction } from "@/lib/actions/tenant-actions"
import { AppError } from "@/lib/error-handler"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      throw new AppError("Invitation token is missing", 400)
    }

    const result = await acceptTenantInvitationAction(token)

    if (result.success) {
      return NextResponse.json({ message: result.message, data: result.data }, { status: 200 })
    } else {
      throw new AppError(result.error || "Failed to accept invitation", 500)
    }
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ message: appError.message }, { status: appError.statusCode })
  }
}
