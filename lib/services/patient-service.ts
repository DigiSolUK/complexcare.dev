import { v4 as uuidv4 } from "uuid"
import { getAll, getById, insert, update, remove, sql } from "../db-connection"
import { DEFAULT_TENANT_ID } from "../constants"

export type Patient = {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  nhs_number?: string
  contact_number?: string
  email?: string
  address?: string
  postcode?: string
  primary_condition?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  is_active: boolean
}

export async function getAllPatients(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<Patient[]> {
  return getAll<Patient>("patients", tenantId, limit, offset)
}

export async function getPatientById(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Patient | null> {
  return getById<Patient>("patients", id, tenantId)
}

export async function searchPatients(
  searchTerm: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<Patient[]> {
  try {
    const query = `
      SELECT * FROM patients
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND (
        first_name ILIKE $2 OR
        last_name ILIKE $2 OR
        nhs_number ILIKE $2 OR
        email ILIKE $2 OR
        primary_condition ILIKE $2
      )
      ORDER BY last_name ASC, first_name ASC
      LIMIT $3 OFFSET $4
    `
    const result = await sql.query(query, [tenantId, `%${searchTerm}%`, limit, offset])
    return result.rows as Patient[]
  } catch (error) {
    console.error("Error searching patients:", error)
    throw error
  }
}

export async function createPatient(
  data: Omit<Patient, "id" | "tenant_id" | "created_at" | "updated_at" | "deleted_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Patient | null> {
  const patientData = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return insert<Patient>("patients", patientData, tenantId)
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Patient | null> {
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  return update<Patient>("patients", id, updateData, tenantId)
}

export async function deletePatient(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  return remove("patients", id, tenantId, true)
}

export async function getPatientCount(tenantId: string = DEFAULT_TENANT_ID): Promise<number> {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM patients
      WHERE tenant_id = $1 AND deleted_at IS NULL
    `
    const result = await sql.query(query, [tenantId])
    return Number.parseInt(result.rows?.[0]?.count || "0", 10)
  } catch (error) {
    console.error("Error counting patients:", error)
    throw error
  }
}

export async function getPatientsByCondition(
  condition: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Patient[]> {
  try {
    const query = `
      SELECT * FROM patients
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND primary_condition ILIKE $2
      ORDER BY last_name ASC, first_name ASC
    `
    const result = await sql.query(query, [tenantId, `%${condition}%`])
    return result.rows as Patient[]
  } catch (error) {
    console.error("Error getting patients by condition:", error)
    throw error
  }
}
