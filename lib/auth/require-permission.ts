import { type UserRole, PERMISSIONS } from "@/lib/auth/permissions"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

type Permission = keyof typeof PERMISSIONS

export const requirePermission = (
  permission: Permission,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user || !session.user.role) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userRole = session.user.role as UserRole

    if (!PERMISSIONS[permission].includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    return handler(req, res)
  }
}
