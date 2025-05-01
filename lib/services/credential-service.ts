import { sql } from "@/lib/db"
import type { ProfessionalCredential } from "@/types"

export async function getCredentials(
  tenantId: string,
  filters?: { userId?: string; status?: string; type?: string },
): Promise<ProfessionalCredential[]> {
  try {
    let query = sql`
      SELECT c.*, 
        u.name as user_name,
        v.name as verifier_name
      FROM professional_credentials c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users v ON c.verified_by = v.id
      WHERE c.tenant_id = ${tenantId}
    `

    if (filters?.userId) {
      query = sql`${query} AND c.user_id = ${filters.userId}`
    }

    if (filters?.status) {
      query = sql`${query} AND c.verification_status = ${filters.status}`
    }

    if (filters?.type) {
      query = sql`${query} AND c.credential_type = ${filters.type}`
    }

    query = sql`${query} ORDER BY c.expiry_date ASC NULLS LAST, c.created_at DESC`

    const result = await query
    return result.rows
  } catch (error) {
    console.error("Error fetching credentials:", error)
    throw new Error("Failed to fetch credentials")
  }
}

export async function getCredentialById(tenantId: string, id: string): Promise<ProfessionalCredential | null> {
  try {
    const result = await sql`
      SELECT c.*, 
        u.name as user_name,
        v.name as verifier_name
      FROM professional_credentials c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users v ON c.verified_by = v.id
      WHERE c.tenant_id = ${tenantId} AND c.id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    // Get reminders for this credential
    const remindersResult = await sql`
      SELECT * FROM credential_reminders
      WHERE tenant_id = ${tenantId} AND credential_id = ${id}
      ORDER BY reminder_date ASC
    `

    const credential = result.rows[0]
    credential.reminders = remindersResult.rows

    return credential
  } catch (error) {
    console.error("Error fetching credential:", error)
    throw new Error("Failed to fetch credential")
  }
}

// Alias for getCredentialById to match the expected export
export const getCredential = getCredentialById

export async function createCredential(
  tenantId: string,
  userId: string,
  credentialType: string,
  credentialNumber: string,
  issueDate: string,
  expiryDate?: string,
  documentUrl?: string,
): Promise<ProfessionalCredential> {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Create the credential
    const result = await sql`
      INSERT INTO professional_credentials (
        tenant_id, user_id, credential_type, credential_number,
        issue_date, expiry_date, verification_status, document_url
      )
      VALUES (
        ${tenantId}, ${userId}, ${credentialType}, ${credentialNumber},
        ${issueDate}, ${expiryDate || null}, 'pending', ${documentUrl || null}
      )
      RETURNING *
    `

    const newCredential = result.rows[0]

    // Create a reminder if there's an expiry date (30 days before expiry)
    if (expiryDate) {
      const expiryDateObj = new Date(expiryDate)
      const reminderDate = new Date(expiryDateObj)
      reminderDate.setDate(reminderDate.getDate() - 30)

      await sql`
        INSERT INTO credential_reminders (
          tenant_id, credential_id, reminder_date, reminder_sent
        )
        VALUES (
          ${tenantId}, ${newCredential.id}, ${reminderDate.toISOString().split("T")[0]}, false
        )
      `
    }

    // Commit the transaction
    await sql`COMMIT`

    // Get the complete credential with reminders
    return (await getCredentialById(tenantId, newCredential.id)) as ProfessionalCredential
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error creating credential:", error)
    throw new Error("Failed to create credential")
  }
}

export async function updateCredential(
  tenantId: string,
  id: string,
  updates: {
    credentialType?: string
    credentialNumber?: string
    issueDate?: string
    expiryDate?: string | null
    documentUrl?: string | null
    notes?: string | null
  },
): Promise<ProfessionalCredential> {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Build the update query dynamically based on provided fields
    let updateQuery = sql`
      UPDATE professional_credentials
      SET updated_at = NOW()
    `

    if (updates.credentialType !== undefined) {
      updateQuery = sql`${updateQuery}, credential_type = ${updates.credentialType}`
    }

    if (updates.credentialNumber !== undefined) {
      updateQuery = sql`${updateQuery}, credential_number = ${updates.credentialNumber}`
    }

    if (updates.issueDate !== undefined) {
      updateQuery = sql`${updateQuery}, issue_date = ${updates.issueDate}`
    }

    if (updates.expiryDate !== undefined) {
      updateQuery = sql`${updateQuery}, expiry_date = ${updates.expiryDate}`
    }

    if (updates.documentUrl !== undefined) {
      updateQuery = sql`${updateQuery}, document_url = ${updates.documentUrl}`
    }

    if (updates.notes !== undefined) {
      updateQuery = sql`${updateQuery}, notes = ${updates.notes}`
    }

    // Add the WHERE clause
    updateQuery = sql`
      ${updateQuery}
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `

    const result = await updateQuery

    if (result.rows.length === 0) {
      throw new Error("Credential not found")
    }

    const updatedCredential = result.rows[0]

    // If expiry date was updated, update or create reminder
    if (updates.expiryDate !== undefined) {
      // Delete existing reminders
      await sql`
        DELETE FROM credential_reminders
        WHERE tenant_id = ${tenantId} AND credential_id = ${id}
      `

      // Create a new reminder if there's an expiry date (30 days before expiry)
      if (updates.expiryDate) {
        const expiryDateObj = new Date(updates.expiryDate)
        const reminderDate = new Date(expiryDateObj)
        reminderDate.setDate(reminderDate.getDate() - 30)

        await sql`
          INSERT INTO credential_reminders (
            tenant_id, credential_id, reminder_date, reminder_sent
          )
          VALUES (
            ${tenantId}, ${id}, ${reminderDate.toISOString().split("T")[0]}, false
          )
        `
      }
    }

    // Commit the transaction
    await sql`COMMIT`

    // Get the complete credential with reminders
    return (await getCredentialById(tenantId, id)) as ProfessionalCredential
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error updating credential:", error)
    throw new Error("Failed to update credential")
  }
}

export async function deleteCredential(tenantId: string, id: string): Promise<{ success: boolean }> {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Delete reminders first (foreign key constraint)
    await sql`
      DELETE FROM credential_reminders
      WHERE tenant_id = ${tenantId} AND credential_id = ${id}
    `

    // Delete the credential
    const result = await sql`
      DELETE FROM professional_credentials
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING id
    `

    // Commit the transaction
    await sql`COMMIT`

    if (result.rows.length === 0) {
      throw new Error("Credential not found")
    }

    return { success: true }
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error deleting credential:", error)
    throw new Error("Failed to delete credential")
  }
}

export async function verifyCredential(
  tenantId: string,
  id: string,
  verifierId: string,
  status: "verified" | "rejected",
  notes?: string,
): Promise<ProfessionalCredential> {
  try {
    const result = await sql`
      UPDATE professional_credentials
      SET 
        verification_status = ${status},
        verified_by = ${verifierId},
        verification_date = NOW(),
        verification_notes = ${notes || null},
        updated_at = NOW()
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      throw new Error("Credential not found")
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error verifying credential:", error)
    throw new Error("Failed to verify credential")
  }
}

export async function getExpiringCredentials(tenantId: string, daysThreshold = 30): Promise<ProfessionalCredential[]> {
  try {
    const result = await sql`
      SELECT c.*, 
        u.name as user_name,
        v.name as verifier_name
      FROM professional_credentials c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users v ON c.verified_by = v.id
      WHERE 
        c.tenant_id = ${tenantId}
        AND c.verification_status = 'verified'
        AND c.expiry_date IS NOT NULL
        AND c.expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + ${daysThreshold} * INTERVAL '1 day')
      ORDER BY c.expiry_date ASC
    `

    return result.rows
  } catch (error) {
    console.error("Error fetching expiring credentials:", error)
    throw new Error("Failed to fetch expiring credentials")
  }
}
