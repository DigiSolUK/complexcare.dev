"use server"

import { sql } from "@/lib/db-manager"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function executeQuery(query: string, params: any[] = [], tenantId: string = DEFAULT_TENANT_ID) {
  try {
    const result = await sql.query(query, params)
    return { success: true, data: result.rows }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: String(error) }
  }
}

export async function getById(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID) {
  try {
    const result = await sql.query(`SELECT * FROM ${table} WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL`, [
      id,
      tenantId,
    ])
    return { success: true, data: result.rows[0] || null }
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error)
    return { success: false, error: String(error) }
  }
}

export async function insert(table: string, data: Record<string, any>, tenantId: string = DEFAULT_TENANT_ID) {
  try {
    const dataWithTenant = { ...data, tenant_id: tenantId }
    const columns = Object.keys(dataWithTenant)
    const values = Object.values(dataWithTenant)

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${columns.map((_, i) => `$${i + 1}`).join(", ")})
      RETURNING *
    `

    const result = await sql.query(query, values)
    return { success: true, data: result.rows[0] || null }
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    return { success: false, error: String(error) }
  }
}

export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
) {
  try {
    const updateFields = Object.keys(data)
      .map((key, i) => `${key} = $${i + 3}`)
      .join(", ")

    const query = `
      UPDATE ${table}
      SET ${updateFields}, updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *
    `

    const values = [id, tenantId, ...Object.values(data)]
    const result = await sql.query(query, values)
    return { success: true, data: result.rows[0] || null }
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    return { success: false, error: String(error) }
  }
}

export async function remove(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID, softDelete = true) {
  try {
    if (softDelete) {
      await sql.query(`UPDATE ${table} SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND tenant_id = $2`, [
        id,
        tenantId,
      ])
    } else {
      await sql.query(`DELETE FROM ${table} WHERE id = $1 AND tenant_id = $2`, [id, tenantId])
    }
    return { success: true }
  } catch (error) {
    console.error(`Error removing from ${table}:`, error)
    return { success: false, error: String(error) }
  }
}
