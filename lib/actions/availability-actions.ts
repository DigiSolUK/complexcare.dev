"use server"

import { revalidatePath } from "next/cache"
import {
  getProviderAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getProviderTimeOffRequests,
  createTimeOffRequest,
  updateTimeOffRequestStatus,
} from "@/lib/services/availability-service"
import type { AvailabilityFormData, TimeOffFormData, TimeOffStatus } from "@/types/availability"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function getProviderAvailabilityAction(providerId: string) {
  try {
    const availability = await getProviderAvailability(providerId)
    return { success: true, data: availability }
  } catch (error) {
    console.error("Error fetching provider availability:", error)
    return { success: false, error: "Failed to fetch provider availability" }
  }
}

export async function createAvailabilityAction(formData: FormData) {
  try {
    const data: AvailabilityFormData = {
      provider_id: formData.get("provider_id") as string,
      day_of_week: formData.get("day_of_week") ? Number.parseInt(formData.get("day_of_week") as string) : null,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      is_available: formData.get("is_available") === "true",
      recurrence_type: formData.get("recurrence_type") as any,
      specific_date: (formData.get("specific_date") as string) || null,
      notes: (formData.get("notes") as string) || null,
      availability_type: formData.get("availability_type") as any,
    }

    const availability = await createAvailability(data, DEFAULT_TENANT_ID)

    revalidatePath(`/providers/${data.provider_id}/availability`)
    revalidatePath(`/settings/availability`)

    return { success: true, data: availability }
  } catch (error: any) {
    console.error("Error creating availability:", error)
    return { success: false, error: error.message || "Failed to create availability" }
  }
}

export async function updateAvailabilityAction(id: string, formData: FormData) {
  try {
    const data: Partial<AvailabilityFormData> = {}

    if (formData.has("provider_id")) data.provider_id = formData.get("provider_id") as string
    if (formData.has("day_of_week")) {
      const dayOfWeek = formData.get("day_of_week")
      data.day_of_week = dayOfWeek ? Number.parseInt(dayOfWeek as string) : null
    }
    if (formData.has("start_time")) data.start_time = formData.get("start_time") as string
    if (formData.has("end_time")) data.end_time = formData.get("end_time") as string
    if (formData.has("is_available")) data.is_available = formData.get("is_available") === "true"
    if (formData.has("recurrence_type")) data.recurrence_type = formData.get("recurrence_type") as any
    if (formData.has("specific_date")) data.specific_date = (formData.get("specific_date") as string) || null
    if (formData.has("notes")) data.notes = (formData.get("notes") as string) || null
    if (formData.has("availability_type")) data.availability_type = formData.get("availability_type") as any

    const availability = await updateAvailability(id, data, DEFAULT_TENANT_ID)

    revalidatePath(`/providers/${data.provider_id}/availability`)
    revalidatePath(`/settings/availability`)

    return { success: true, data: availability }
  } catch (error: any) {
    console.error("Error updating availability:", error)
    return { success: false, error: error.message || "Failed to update availability" }
  }
}

export async function deleteAvailabilityAction(id: string, providerId: string) {
  try {
    const success = await deleteAvailability(id, DEFAULT_TENANT_ID)

    revalidatePath(`/providers/${providerId}/availability`)
    revalidatePath(`/settings/availability`)

    return { success }
  } catch (error) {
    console.error("Error deleting availability:", error)
    return { success: false, error: "Failed to delete availability" }
  }
}

export async function getProviderTimeOffRequestsAction(providerId: string, status?: TimeOffStatus) {
  try {
    const timeOffRequests = await getProviderTimeOffRequests(providerId, DEFAULT_TENANT_ID, status)
    return { success: true, data: timeOffRequests }
  } catch (error) {
    console.error("Error fetching provider time off requests:", error)
    return { success: false, error: "Failed to fetch time off requests" }
  }
}

export async function createTimeOffRequestAction(formData: FormData) {
  try {
    const data: TimeOffFormData = {
      provider_id: formData.get("provider_id") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      reason: formData.get("reason") as string,
      notes: (formData.get("notes") as string) || null,
    }

    const timeOffRequest = await createTimeOffRequest(data, DEFAULT_TENANT_ID)

    revalidatePath(`/providers/${data.provider_id}/time-off`)
    revalidatePath(`/settings/time-off`)

    return { success: true, data: timeOffRequest }
  } catch (error: any) {
    console.error("Error creating time off request:", error)
    return { success: false, error: error.message || "Failed to create time off request" }
  }
}

export async function updateTimeOffRequestStatusAction(
  id: string,
  status: TimeOffStatus,
  approvedBy: string | null = null,
  providerId: string,
) {
  try {
    const timeOffRequest = await updateTimeOffRequestStatus(id, status, approvedBy, DEFAULT_TENANT_ID)

    revalidatePath(`/providers/${providerId}/time-off`)
    revalidatePath(`/settings/time-off`)

    return { success: true, data: timeOffRequest }
  } catch (error: any) {
    console.error("Error updating time off request status:", error)
    return { success: false, error: error.message || "Failed to update time off request status" }
  }
}
