import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema" // Assuming schema defines tables
import { eq } from "drizzle-orm"
import type { TenantInvitation } from "@/types"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Functions for tenant_invitations
export async function createTenantInvitation(data: {
  tenant_id: string
  email: string
  role: string
  token: string
  expires_at: Date
}): Promise<TenantInvitation> {
  const [invitation] = await db
    .insert(schema.tenantInvitations)
    .values({
      tenant_id: data.tenant_id,
      email: data.email,
      role: data.role,
      token: data.token,
      expires_at: data.expires_at,
      created_at: new Date(),
      updated_at: new Date(),
      accepted_at: null, // Ensure accepted_at is null initially
    })
    .returning()

  if (!invitation) {
    throw new Error("Failed to create tenant invitation.")
  }

  return {
    ...invitation,
    created_at: new Date(invitation.created_at),
    updated_at: new Date(invitation.updated_at),
    expires_at: new Date(invitation.expires_at),
    accepted_at: invitation.accepted_at ? new Date(invitation.accepted_at) : null,
  }
}

export async function getTenantInvitationByToken(token: string): Promise<TenantInvitation | null> {
  const invitation = await db.query.tenantInvitations.findFirst({
    where: (table, { eq }) => eq(table.token, token),
  })
  if (!invitation) return null
  return {
    ...invitation,
    created_at: new Date(invitation.created_at),
    updated_at: new Date(invitation.updated_at),
    expires_at: new Date(invitation.expires_at),
    accepted_at: invitation.accepted_at ? new Date(invitation.accepted_at) : null,
  }
}

export async function updateTenantInvitationAcceptedAt(id: string, acceptedAt: Date): Promise<TenantInvitation> {
  const [updatedInvitation] = await db
    .update(schema.tenantInvitations)
    .set({ accepted_at: acceptedAt, updated_at: new Date() })
    .where(eq(schema.tenantInvitations.id, id))
    .returning()

  if (!updatedInvitation) {
    throw new Error("Failed to update tenant invitation.")
  }

  return {
    ...updatedInvitation,
    created_at: new Date(updatedInvitation.created_at),
    updated_at: new Date(updatedInvitation.updated_at),
    expires_at: new Date(updatedInvitation.expires_at),
    accepted_at: updatedInvitation.accepted_at ? new Date(updatedInvitation.accepted_at) : null,
  }
}
