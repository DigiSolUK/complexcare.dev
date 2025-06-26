import { sql } from "@/lib/db"
import type { CareProfessional, NewCareProfessional } from "@/types"

export async function getCareProfessionals(tenantId: string): Promise<CareProfessional[]> {
  try {
    const result = await sql`
      SELECT * FROM care_professionals
      WHERE tenant_id = ${tenantId}
      ORDER BY name ASC;
    `
    return result.rows as CareProfessional[]
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    throw new Error("Failed to fetch care professionals.")
  }
}

export async function getCareProfessionalById(id: string, tenantId: string): Promise<CareProfessional | null> {
  try {
    const result = await sql`
      SELECT * FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    return (result.rows[0] as CareProfessional) || null
  } catch (error) {
    console.error(`Error fetching care professional with ID ${id}:`, error)
    throw new Error(`Failed to fetch care professional with ID ${id}.`)
  }
}

export async function createCareProfessional(
  careProfessional: NewCareProfessional,
  tenantId: string,
): Promise<CareProfessional> {
  try {
    const result = await sql`
      INSERT INTO care_professionals (
        tenant_id, name, email, phone, address, qualifications, experience, specialty,
        date_of_birth, gender, emergency_contact_name, emergency_contact_phone,
        employment_status, start_date, end_date, notes, created_at, updated_at
      ) VALUES (
        ${tenantId}, ${careProfessional.name}, ${careProfessional.email}, ${careProfessional.phone},
        ${careProfessional.address}, ${careProfessional.qualifications}, ${careProfessional.experience},
        ${careProfessional.specialty}, ${careProfessional.date_of_birth}, ${careProfessional.gender},
        ${careProfessional.emergency_contact_name}, ${careProfessional.emergency_contact_phone},
        ${careProfessional.employment_status}, ${careProfessional.start_date}, ${careProfessional.end_date},
        ${careProfessional.notes}, NOW(), NOW()
      )
      RETURNING *;
    `
    return result.rows[0] as CareProfessional
  } catch (error) {
    console.error("Error creating care professional:", error)
    throw new Error("Failed to create care professional.")
  }
}

export async function updateCareProfessional(
  id: string,
  careProfessional: Partial<CareProfessional>,
  tenantId: string,
): Promise<CareProfessional> {
  try {
    const result = await sql`
      UPDATE care_professionals
      SET
        name = COALESCE(${careProfessional.name}, name),
        email = COALESCE(${careProfessional.email}, email),
        phone = COALESCE(${careProfessional.phone}, phone),
        address = COALESCE(${careProfessional.address}, address),
        qualifications = COALESCE(${careProfessional.qualifications}, qualifications),
        experience = COALESCE(${careProfessional.experience}, experience),
        specialty = COALESCE(${careProfessional.specialty}, specialty),
        date_of_birth = COALESCE(${careProfessional.date_of_birth}, date_of_birth),
        gender = COALESCE(${careProfessional.gender}, gender),
        emergency_contact_name = COALESCE(${careProfessional.emergency_contact_name}, emergency_contact_name),
        emergency_contact_phone = COALESCE(${careProfessional.emergency_contact_phone}, emergency_contact_phone),
        employment_status = COALESCE(${careProfessional.employment_status}, employment_status),
        start_date = COALESCE(${careProfessional.start_date}, start_date),
        end_date = COALESCE(${careProfessional.end_date}, end_date),
        notes = COALESCE(${careProfessional.notes}, notes),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *;
    `
    if (result.rows.length === 0) {
      throw new Error("Care professional not found or not authorized.")
    }
    return result.rows[0] as CareProfessional
  } catch (error) {
    console.error(`Error updating care professional with ID ${id}:`, error)
    throw new Error(`Failed to update care professional with ID ${id}.`)
  }
}

export async function deleteCareProfessional(id: string, tenantId: string): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    if (result.count === 0) {
      throw new Error("Care professional not found or not authorized.")
    }
  } catch (error) {
    console.error(`Error deleting care professional with ID ${id}:`, error)
    throw new Error(`Failed to delete care professional with ID ${id}.`)
  }
}
