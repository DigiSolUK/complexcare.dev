"use server"

import { revalidatePath } from "next/cache"
import type { z } from "zod"
import { PatientService } from "@/lib/services/patient-service"
import { patientSchema } from "@/lib/validations/schemas"
import { getServerSession } from "@/lib/auth/stack-auth-server"
import type { Patient } from "@/lib/models/patient"

type ActionResult<T> = { success: true; data: T } | { success: false; error: string; errors?: z.ZodIssue[] }

export async function createPatientAction(formData: FormData): Promise<ActionResult<Patient>> {
  const session = await getServerSession()
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" }
  }
  const { user, tenantId } = session
  if (!tenantId) return { success: false, error: "Tenant ID not found" }

  const rawData = Object.fromEntries(formData.entries())
  if (rawData.dateOfBirth && typeof rawData.dateOfBirth === "string") {
    // Basic validation
  }
  if (rawData.emergencyContactName || rawData.emergencyContactRelationship || rawData.emergencyContactPhone) {
    rawData.emergencyContact = JSON.stringify({
      name: rawData.emergencyContactName,
      relationship: rawData.emergencyContactRelationship,
      phone: rawData.emergencyContactPhone,
    })
  }

  const validationResult = patientSchema
    .omit({ id: true, tenantId: true, createdAt: true, updatedAt: true, deletedAt: true })
    .safeParse(rawData)

  if (!validationResult.success) {
    return { success: false, error: "Validation failed", errors: validationResult.error.issues }
  }

  try {
    const newPatient = await PatientService.create(validationResult.data, tenantId, user.id)
    revalidatePath("/(dashboard)/patients")
    return { success: true, data: newPatient as Patient }
  } catch (error: any) {
    console.error("Create patient action error:", error)
    return { success: false, error: error.message || "Failed to create patient" }
  }
}

export async function updatePatientAction(patientId: string, formData: FormData): Promise<ActionResult<Patient>> {
  const session = await getServerSession()
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" }
  }
  const { user, tenantId } = session
  if (!tenantId) return { success: false, error: "Tenant ID not found" }

  const rawData = Object.fromEntries(formData.entries())
  if (rawData.dateOfBirth && typeof rawData.dateOfBirth === "string") {
    // Basic validation
  }
  if (rawData.emergencyContactName || rawData.emergencyContactRelationship || rawData.emergencyContactPhone) {
    rawData.emergencyContact = JSON.stringify({
      name: rawData.emergencyContactName,
      relationship: rawData.emergencyContactRelationship,
      phone: rawData.emergencyContactPhone,
    })
  }

  const validationResult = patientSchema.partial().safeParse(rawData)

  if (!validationResult.success) {
    return { success: false, error: "Validation failed", errors: validationResult.error.issues }
  }

  try {
    const updatedPatient = await PatientService.update(patientId, validationResult.data, tenantId, user.id)
    if (!updatedPatient) {
      return { success: false, error: "Patient not found or update failed" }
    }
    revalidatePath(`/(dashboard)/patients`)
    revalidatePath(`/(dashboard)/patients/${patientId}`)
    return { success: true, data: updatedPatient as Patient }
  } catch (error: any) {
    console.error("Update patient action error:", error)
    return { success: false, error: error.message || "Failed to update patient" }
  }
}

export async function deletePatientAction(patientId: string): Promise<ActionResult<null>> {
  const session = await getServerSession()
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" }
  }
  const { user, tenantId } = session
  if (!tenantId) return { success: false, error: "Tenant ID not found" }

  try {
    const success = await PatientService.delete(patientId, tenantId, user.id)
    if (!success) {
      return { success: false, error: "Patient not found or delete failed" }
    }
    revalidatePath("/(dashboard)/patients")
    return { success: true, data: null }
  } catch (error: any) {
    console.error("Delete patient action error:", error)
    return { success: false, error: error.message || "Failed to delete patient" }
  }
}

export async function getPatientAction(patientId: string): Promise<ActionResult<Patient | null>> {
  const session = await getServerSession()
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" }
  }
  const { tenantId } = session
  if (!tenantId) return { success: false, error: "Tenant ID not found" }

  try {
    const patient = await PatientService.getById(patientId, tenantId)
    return { success: true, data: patient }
  } catch (error: any) {
    console.error("Get patient action error:", error)
    return { success: false, error: error.message || "Failed to fetch patient" }
  }
}

// Aliases to satisfy missing exports
export const createPatient = createPatientAction
export const updatePatient = updatePatientAction
export const getPatient = getPatientAction
export const deletePatient = deletePatientAction
