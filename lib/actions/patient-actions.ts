"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function createPatient(data: any) {
  try {
    // Format date of birth to ISO string
    const dob = data.date_of_birth instanceof Date ? data.date_of_birth.toISOString().split("T")[0] : data.date_of_birth

    // Insert the patient into the database
    const result = await sql`
      INSERT INTO patients (
        tenant_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        nhs_number,
        contact_number,
        email,
        address,
        primary_condition,
        primary_care_provider,
        status,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${DEFAULT_TENANT_ID},
        ${data.first_name},
        ${data.last_name},
        ${dob},
        ${data.gender},
        ${data.nhs_number || null},
        ${data.contact_number || null},
        ${data.email || null},
        ${data.address || null},
        ${data.primary_condition || null},
        ${data.primary_care_provider || null},
        ${data.status || "active"},
        ${data.notes || null},
        NOW(),
        NOW()
      ) RETURNING *
    `

    // Revalidate the patients page to show the new patient
    revalidatePath("/patients")

    return {
      success: true,
      data: result[0],
    }
  } catch (error: any) {
    console.error("Error creating patient:", error)
    return {
      success: false,
      error: error.message || "Failed to create patient",
    }
  }
}

export async function updatePatient(id: string, data: any) {
  try {
    // Format date of birth to ISO string
    const dob = data.date_of_birth instanceof Date ? data.date_of_birth.toISOString().split("T")[0] : data.date_of_birth

    // Update the patient in the database
    const result = await sql`
      UPDATE patients
      SET
        first_name = ${data.first_name},
        last_name = ${data.last_name},
        date_of_birth = ${dob},
        gender = ${data.gender},
        nhs_number = ${data.nhs_number || null},
        contact_number = ${data.contact_number || null},
        email = ${data.email || null},
        address = ${data.address || null},
        primary_condition = ${data.primary_condition || null},
        primary_care_provider = ${data.primary_care_provider || null},
        status = ${data.status || "active"},
        notes = ${data.notes || null},
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${DEFAULT_TENANT_ID}
      RETURNING *
    `

    if (result.length === 0) {
      throw new Error("Patient not found or you don't have permission to update this patient")
    }

    // Revalidate the patient pages
    revalidatePath("/patients")
    revalidatePath(`/patients/${id}`)

    return {
      success: true,
      data: result[0],
    }
  } catch (error: any) {
    console.error("Error updating patient:", error)
    return {
      success: false,
      error: error.message || "Failed to update patient",
    }
  }
}

export async function deletePatient(id: string) {
  try {
    // Soft delete the patient by setting deleted_at
    const result = await sql`
      UPDATE patients
      SET
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${DEFAULT_TENANT_ID}
      RETURNING *
    `

    if (result.length === 0) {
      throw new Error("Patient not found or you don't have permission to delete this patient")
    }

    // Revalidate the patients page
    revalidatePath("/patients")

    return {
      success: true,
      data: result[0],
    }
  } catch (error: any) {
    console.error("Error deleting patient:", error)
    return {
      success: false,
      error: error.message || "Failed to delete patient",
    }
  }
}

export async function getPatient(id: string) {
  try {
    const result = await sql`
      SELECT * FROM patients
      WHERE id = ${id} 
      AND tenant_id = ${DEFAULT_TENANT_ID}
      AND deleted_at IS NULL
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Patient not found",
      }
    }

    return {
      success: true,
      data: result[0],
    }
  } catch (error: any) {
    console.error("Error fetching patient:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch patient",
    }
  }
}

export async function getPatients(limit = 100, offset = 0, searchTerm = "") {
  try {
    let query = `
      SELECT * FROM patients
      WHERE tenant_id = $1
      AND deleted_at IS NULL
    `

    const queryParams = [DEFAULT_TENANT_ID]

    // Add search condition if searchTerm is provided
    if (searchTerm) {
      query += `
        AND (
          first_name ILIKE $2 OR
          last_name ILIKE $2 OR
          nhs_number ILIKE $2 OR
          primary_condition ILIKE $2
        )
      `
      queryParams.push(`%${searchTerm}%`)
    }

    // Add ordering and pagination
    query += `
      ORDER BY updated_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `
    queryParams.push(limit.toString(), offset.toString())

    // Execute the query
    const result = await sql.query(query, queryParams)

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error("Error fetching patients:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch patients",
    }
  }
}
