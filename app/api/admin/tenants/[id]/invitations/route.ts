import { NextResponse } from "next/server"
import { createTenantInvitationAction } from "@/lib/actions/tenant-actions"
import { AppError } from "@/lib/error-handler"
import { getCurrentUser } from "@/lib/auth-utils"
import { PERMISSIONS } from "@/lib/auth/permissions"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    // Check if the current user has permission to invite users in this tenant
    // For superadmin, they can invite to any tenant. For tenant admin, only their own.
    if (user.role !== PERMISSIONS.SUPERADMIN && user.tenantId !== params.id) {
      throw new AppError("Forbidden: Not authorized to invite users to this tenant.", 403)
    }

    const { email, role } = await request.json()

    if (!email || !role) {
      throw new AppError("Email and role are required for invitation.", 400)
    }

    const result = await createTenantInvitationAction(params.id, email, role)

    if (result.success) {
      return NextResponse.json(
        { message: "Invitation sent successfully", invitation: result.data, invitationUrl: result.invitationUrl },
        { status: 201 },
      )
    } else {
      throw new AppError(result.error || "Failed to send invitation", 500)
    }
  } catch (error) {
    const appError = AppError.fromError(error)
    return NextResponse.json({ message: appError.message }, { status: appError.statusCode })
  }
}
