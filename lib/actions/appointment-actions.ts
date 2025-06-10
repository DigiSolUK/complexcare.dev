"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import * as appointmentService from "@/lib/services/appointment-service"
import type { AppointmentFormData, AppointmentStatus } from "@/types/appointment"

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  provider_id: z.string().min(1, "Provider is required"),
  title: z.string().min(1, "Title is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  status: z.string().min(1, "Status is required"),
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
  location: z.string().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: z.string().optional(),
  recurrence_end_date: z.string().optional(),
})

export async function createAppointmentAction(formData: FormData) {
  try {
    const validatedFields = appointmentSchema.parse({
      patient_id: formData.get("patient_id"),
      provider_id: formData.get("provider_id"),
      title: formData.get("title"),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
      status: formData.get("status"),
      type: formData.get("type"),
      notes: formData.get("notes"),
      location: formData.get("location"),
      is_recurring: formData.get("is_recurring") === "true",
      recurrence_pattern: formData.get("recurrence_pattern"),
      recurrence_end_date: formData.get("recurrence_end_date"),
    })

    const appointment = await appointmentService.createAppointment(
      validatedFields as AppointmentFormData,
      DEFAULT_TENANT_ID,
    )

    revalidatePath("/appointments")
    revalidatePath("/dashboard")
    revalidatePath(`/patients/${validatedFields.patient_id}`)

    return { success: true, data: appointment }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create appointment",
    }
  }
}

export async function updateAppointmentAction(id: string, formData: FormData) {
  try {
    const validatedFields = appointmentSchema.partial().parse({
      patient_id: formData.get("patient_id"),
      provider_id: formData.get("provider_id"),
      title: formData.get("title"),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
      status: formData.get("status"),
      type: formData.get("type"),
      notes: formData.get("notes"),
      location: formData.get("location"),
      is_recurring: formData.get("is_recurring") === "true",
      recurrence_pattern: formData.get("recurrence_pattern"),
      recurrence_end_date: formData.get("recurrence_end_date"),
    })

    const appointment = await appointmentService.updateAppointment(
      id,
      validatedFields as Partial<AppointmentFormData>,
      DEFAULT_TENANT_ID,
    )

    revalidatePath("/appointments")
    revalidatePath("/dashboard")
    if (validatedFields.patient_id) {
      revalidatePath(`/patients/${validatedFields.patient_id}`)
    }

    return { success: true, data: appointment }
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update appointment",
    }
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    const success = await appointmentService.deleteAppointment(id, DEFAULT_TENANT_ID)

    revalidatePath("/appointments")
    revalidatePath("/dashboard")

    return { success }
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete appointment",
    }
  }
}

export async function updateAppointmentStatusAction(id: string, status: AppointmentStatus) {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(id, status, DEFAULT_TENANT_ID)

    revalidatePath("/appointments")
    revalidatePath("/dashboard")

    return { success: true, data: appointment }
  } catch (error) {
    console.error(`Error updating status for appointment ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update appointment status",
    }
  }
}

export async function getAppointmentsAction(startDate?: string, endDate?: string) {
  try {
    const appointments = await appointmentService.getAllAppointments(DEFAULT_TENANT_ID, startDate, endDate)

    return { success: true, data: appointments }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch appointments",
    }
  }
}

export async function getAppointmentByIdAction(id: string) {
  try {
    const appointment = await appointmentService.getAppointmentById(id, DEFAULT_TENANT_ID)

    return { success: true, data: appointment }
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch appointment",
    }
  }
}
