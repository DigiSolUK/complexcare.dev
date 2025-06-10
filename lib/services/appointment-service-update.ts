import { checkProviderAvailability } from "@/lib/services/availability-service"
import { checkAppointmentConflicts } from "@/lib/services/appointment-conflict-service"

const DEFAULT_TENANT_ID = "default"

// Add this function to the appointment service
export async function validateAppointmentAvailability(
  providerId: string,
  date: string,
  startTime: string,
  endTime: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<{ available: boolean; message?: string }> {
  try {
    // First check if there are any conflicting appointments
    const conflicts = await checkAppointmentConflicts(providerId, startTime, endTime, tenantId)

    if (conflicts.length > 0) {
      return {
        available: false,
        message: "Provider already has an appointment scheduled during this time",
      }
    }

    // Then check if the provider is available during this time
    const isAvailable = await checkProviderAvailability(providerId, date, startTime, endTime, tenantId)

    if (!isAvailable) {
      return {
        available: false,
        message: "Provider is not available during this time",
      }
    }

    return { available: true }
  } catch (error) {
    console.error("Error validating appointment availability:", error)
    return {
      available: false,
      message: "An error occurred while checking availability",
    }
  }
}
