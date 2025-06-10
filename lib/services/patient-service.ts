import { neonSql } from "@/lib/db"
import type { Patient } from "@/types/patient"
import { patientSchema } from "@/lib/validations/schemas"
import type { z } from "zod"

export class PatientService {
  static async getAll(tenantId: string, page = 1, limit = 10): Promise<{ patients: Patient[]; totalCount: number }> {
    const offset = (page - 1) * limit
    const patientsResult = await neonSql`
      SELECT * FROM patients 
      WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
      ORDER BY last_name ASC, first_name ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await neonSql`
      SELECT COUNT(*) FROM patients
      WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
    `
    const totalCount = Number.parseInt(countResult[0].count as string, 10)

    return { patients: patientsResult as Patient[], totalCount }
  }

  static async getById(id: string, tenantId: string): Promise<Patient | null> {
    if (!id) return null
    const result = await neonSql`
      SELECT * FROM patients 
      WHERE id = ${id} AND tenant_id = ${tenantId} AND deleted_at IS NULL
    `
    return result.length > 0 ? (result[0] as Patient) : null
  }

  static async create(
    data: z.infer<typeof patientSchema>,
    tenantId: string,
    createdByUserId?: string,
  ): Promise<Patient> {
    const validatedData = patientSchema
      .omit({ id: true, tenantId: true, createdAt: true, updatedAt: true, deletedAt: true })
      .parse(data)

    const { firstName, lastName, dateOfBirth, nhsNumber, address, phone, email, emergencyContact } = validatedData

    const result = await neonSql`
      INSERT INTO patients (
        tenant_id, first_name, last_name, date_of_birth, nhs_number, 
        address, phone, email, emergency_contact, created_at, updated_at
      ) VALUES (
        ${tenantId}, ${firstName}, ${lastName}, ${dateOfBirth}, ${nhsNumber}, 
        ${address}, ${phone}, ${email}, ${emergencyContact ? neonSql.json(emergencyContact) : null}, NOW(), NOW()
      ) RETURNING *
    `
    return result[0] as Patient
  }

  static async update(
    id: string,
    data: Partial<z.infer<typeof patientSchema>>,
    tenantId: string,
    updatedByUserId?: string,
  ): Promise<Patient | null> {
    const existingPatient = await this.getById(id, tenantId)
    if (!existingPatient) return null

    const validatedData = patientSchema.partial().parse(data)

    const setClauses: string[] = []
    const values: any[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined && key !== "id" && key !== "tenantId") {
        if (key === "emergencyContact") {
          setClauses.push(`emergency_contact = $${paramIndex++}`)
          values.push(value ? neonSql.json(value) : null)
        } else {
          setClauses.push(`${this.toSnakeCase(key)} = $${paramIndex++}`)
          values.push(value)
        }
      }
    }

    if (setClauses.length === 0) {
      return existingPatient
    }

    setClauses.push(`updated_at = NOW()`)

    values.push(id)
    values.push(tenantId)

    const query = `
      UPDATE patients 
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex++} AND deleted_at IS NULL
      RETURNING *
    `

    const result = await neonSql.query(query, values)
    return result.rows.length > 0 ? (result.rows[0] as Patient) : null
  }

  static async delete(id: string, tenantId: string, deletedByUserId?: string): Promise<boolean> {
    const result = await neonSql`
      UPDATE patients 
      SET deleted_at = NOW() 
      WHERE id = ${id} AND tenant_id = ${tenantId} AND deleted_at IS NULL
    `
    return result.rowCount > 0
  }

  static async validatePatientsTable(): Promise<{ exists: boolean; columns: any[] }> {
    try {
      const result = await neonSql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'patients'
      `
      return { exists: result.length > 0, columns: result }
    } catch (error) {
      console.error("Error validating patients table:", error)
      return { exists: false, columns: [] }
    }
  }

  static async countAllPatients(tenantId: string): Promise<number> {
    const result = await neonSql`
      SELECT COUNT(*) as count FROM patients WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
    `
    return Number.parseInt(result[0].count as string, 10)
  }

  static async getTenantsWithPatients(): Promise<any[]> {
    return neonSql`
      SELECT tenant_id, COUNT(id) as patient_count
      FROM patients
      WHERE deleted_at IS NULL
      GROUP BY tenant_id
      ORDER BY patient_count DESC
    `
  }

  static async createTestPatient(tenantId: string): Promise<Patient> {
    const testPatientData = {
      firstName: "Test",
      lastName: `Patient-${Date.now()}`,
      dateOfBirth: "1990-01-01",
      nhsNumber: `999${Math.floor(1000000 + Math.random() * 9000000)}`,
      address: "123 Test Street, Testville, TS1 1TS",
      phone: "01234567890",
      email: `test.patient.${Date.now()}@example.com`,
    }
    return this.create(testPatientData, tenantId)
  }

  private static toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }
}

// Aliases to satisfy missing exports
export const getPatients = PatientService.getAll
export const getPatientById = PatientService.getById
export const validatePatientsTable = PatientService.validatePatientsTable
export const countAllPatients = PatientService.countAllPatients
export const getTenantsWithPatients = PatientService.getTenantsWithPatients
export const createTestPatient = PatientService.createTestPatient
