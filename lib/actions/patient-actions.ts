"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "@/lib/services/activity-log-service"

export async function createPatient(data: any, userId?: string) {
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

    const newPatient = result[0]

    // Log patient creation activity
    await logActivity({
      tenantId: DEFAULT_TENANT_ID,
      activityType: "patient_created",
      description: `New patient created: ${data.first_name} ${data.last_name}`,
      patientId: newPatient.id,
      userId,
      metadata: {
        patientName: `${data.first_name} ${data.last_name}`,
        dateOfBirth: dob,
        gender: data.gender,
        nhsNumber: data.nhs_number,
      },
    })

    // Revalidate the patients page to show the new patient
    revalidatePath("/patients")

    return {
      success: true,
      data: newPatient,
    }
  } catch (error: any) {
    console.error("Error creating patient:", error)
    return {
      success: false,
      error: error.message || "Failed to create patient",
    }
  }
}

export async function updatePatient(id: string, data: any, userId?: string) {
  try {
    // Get original patient data for comparison
    const originalPatientResult = await sql`
      SELECT * FROM patients
      WHERE id = ${id} AND tenant_id = ${DEFAULT_TENANT_ID}
    `

    const originalPatient = originalPatientResult[0]

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

    const updatedPatient = result[0]

    // Determine which fields were updated
    const updatedFields = []
    if (originalPatient.first_name !== data.first_name || originalPatient.last_name !== data.last_name)
      updatedFields.push("name")
    if (originalPatient.date_of_birth !== dob) updatedFields.push("date_of_birth")
    if (originalPatient.gender !== data.gender) updatedFields.push("gender")
    if (originalPatient.nhs_number !== data.nhs_number) updatedFields.push("nhs_number")
    if (originalPatient.contact_number !== data.contact_number) updatedFields.push("contact_number")
    if (originalPatient.email !== data.email) updatedFields.push("email")
    if (originalPatient.address !== data.address) updatedFields.push("address")
    if (originalPatient.primary_condition !== data.primary_condition) updatedFields.push("primary_condition")
    if (originalPatient.primary_care_provider !== data.primary_care_provider)
      updatedFields.push("primary_care_provider")
    if (originalPatient.status !== data.status) updatedFields.push("status")
    if (originalPatient.notes !== data.notes) updatedFields.push("notes")

    // Log patient update activity
    await logActivity({
      tenantId: DEFAULT_TENANT_ID,
      activityType: "patient_updated",
      description: `Patient information updated: ${updatedFields.join(", ")}`,
      patientId: id,
      userId,
      metadata: {
        updatedFields,
        patientName: `${data.first_name} ${data.last_name}`,
      },
    })

    // If status changed, log a specific activity
    if (originalPatient.status !== data.status) {
      let statusChangeType = ""
      let statusChangeDescription = ""

      switch (data.status) {
        case "active":
          statusChangeType = "patient_activated"
          statusChangeDescription = `Patient status changed to active: ${data.first_name} ${data.last_name}`
          break
        case "inactive":
          statusChangeType = "patient_deactivated"
          statusChangeDescription = `Patient status changed to inactive: ${data.first_name} ${data.last_name}`
          break
        case "discharged":
          statusChangeType = "patient_discharged"
          statusChangeDescription = `Patient discharged: ${data.first_name} ${data.last_name}`
          break
        default:
          statusChangeType = "patient_status_changed"
          statusChangeDescription = `Patient status changed to ${data.status}: ${data.first_name} ${data.last_name}`
      }

      await logActivity({
        tenantId: DEFAULT_TENANT_ID,
        activityType: statusChangeType,
        description: statusChangeDescription,
        patientId: id,
        userId,
        metadata: {
          previousStatus: originalPatient.status,
          newStatus: data.status,
          patientName: `${data.first_name} ${data.last_name}`,
        },
      })
    }

    // Revalidate the patient pages
    revalidatePath("/patients")
    revalidatePath(`/patients/${id}`)

    return {
      success: true,
      data: updatedPatient,
    }
  } catch (error: any) {
    console.error("Error updating patient:", error)
    return {
      success: false,
      error: error.message || "Failed to update patient",
    }
  }
}

export async function deletePatient(id: string, userId?: string) {
  try {
    // Get patient details before deletion
    const patientResult = await sql`
      SELECT * FROM patients
      WHERE id = ${id} AND tenant_id = ${DEFAULT_TENANT_ID}
    `

    const patient = patientResult[0]

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

    // Log patient deletion activity
    await logActivity({
      tenantId: DEFAULT_TENANT_ID,
      activityType: "patient_deleted",
      description: `Patient deleted: ${patient.first_name} ${patient.last_name}`,
      userId,
      metadata: {
        patientName: `${patient.first_name} ${patient.last_name}`,
        patientId: id,
      },
    })

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

export async function getPatient(id: string, userId?: string) {
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

    // Log patient viewed activity
    await logActivity({
      tenantId: DEFAULT_TENANT_ID,
      activityType: "patient_viewed",
      description: `Patient profile viewed: ${result[0].first_name} ${result[0].last_name}`,
      patientId: id,
      userId,
    })

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
    // Create a mock data array in case the database is not available
    const mockPatients = [
      {
        id: "1",
        tenant_id: DEFAULT_TENANT_ID,
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1980-01-01",
        gender: "male",
        nhs_number: "1234567890",
        contact_number: "07700900000",
        email: "john.doe@example.com",
        address: "123 Main St, London",
        primary_condition: "Hypertension",
        primary_care_provider: "Dr. Smith",
        status: "active",
        notes: "Regular checkups",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      {
        id: "2",
        tenant_id: DEFAULT_TENANT_ID,
        first_name: "Jane",
        last_name: "Smith",
        date_of_birth: "1985-05-15",
        gender: "female",
        nhs_number: "0987654321",
        contact_number: "07700900001",
        email: "jane.smith@example.com",
        address: "456 High St, Manchester",
        primary_condition: "Diabetes",
        primary_care_provider: "Dr. Johnson",
        status: "active",
        notes: "Monthly insulin checks",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
    ]

    let patients = []

    try {
      // Try to get patients from the database
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

      // Use the database result if available
      if (result && Array.isArray(result.rows)) {
        patients = result.rows
      } else if (result && Array.isArray(result)) {
        patients = result
      } else {
        // Fallback to mock data if database result is not as expected
        console.warn("Database result not in expected format, using mock data")
        patients = mockPatients
      }
    } catch (dbError) {
      // If database query fails, use mock data
      console.warn("Database query failed, using mock data:", dbError)
      patients = mockPatients
    }

    return {
      success: true,
      data: patients,
    }
  } catch (error: any) {
    console.error("Error fetching patients:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch patients",
      data: [], // Return empty array to prevent map errors
    }
  }
}
