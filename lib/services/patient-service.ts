\
Let's also update the appointment service to log activities:

```ts file="lib/services/appointment-service.ts"
[v0-no-op-code-block-prefix]
import { logActivity } from "./activity-log-service"

interface AppointmentData {
  patient_id: string
  appointment_date: Date
  type: string
  // ... other appointment data
}

interface AppointmentUpdateData {
  appointment_date?: Date
  type?: string
  // ... other updatable fields
}

interface CancellationData {
  cancellation_reason: string
}

interface Appointment {
  id: string
  patient_id: string
  appointment_date: Date
  type: string
  // ... other appointment properties
}

// Mock database for demonstration purposes
const appointments: Appointment[] = []

async function createAppointment(data: AppointmentData): Promise<Appointment> {
  // Simulate creating an appointment in a database
  const appointment: Appointment = {
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Generate a random ID
    patient_id: data.patient_id,
    appointment_date: data.appointment_date,
    type: data.type,
    // ... other appointment properties
  }

  appointments.push(appointment)

  // Log the activity
  await logActivity({
    activityType: "appointment_created",
    description: `Scheduled appointment for ${appointment.appointment_date}`,
    patientId: data.patient_id,
    metadata: {
      appointmentId: appointment.id,
      appointmentDate: appointment.appointment_date,
      appointmentType: data.type,
    },
  })

  return appointment
}

async function getAppointment(id: string): Promise<Appointment | undefined> {
  return appointments.find((appointment) => appointment.id === id)
}

async function updateAppointment(id: string, data: AppointmentUpdateData): Promise<Appointment | undefined> {
  const appointmentIndex = appointments.findIndex((appointment) => appointment.id === id)

  if (appointmentIndex === -1) {
    return undefined // Appointment not found
  }

  const appointment = appointments[appointmentIndex]

  // Update the appointment with the provided data
  const updatedAppointment: Appointment = {
    ...appointment,
    ...data,
  }

  appointments[appointmentIndex] = updatedAppointment

  // Log the activity
  await logActivity({
    activityType: "appointment_updated",
    description: `Updated appointment details`,
    patientId: appointment.patient_id,
    metadata: {
      appointmentId: id,
      updatedFields: Object.keys(data),
    },
  })

  return updatedAppointment
}

async function cancelAppointment(id: string, data: CancellationData): Promise<void> {
  const appointmentIndex = appointments.findIndex((appointment) => appointment.id === id)

  if (appointmentIndex === -1) {
    return // Appointment not found
  }

  const appointment = appointments[appointmentIndex]
  appointments.splice(appointmentIndex, 1)

  // Log the activity
  await logActivity({
    activityType: "appointment_cancelled",
    description: `Cancelled appointment`,
    patientId: appointment.patient_id,
    metadata: {
      appointmentId: id,
      reason: data.cancellation_reason,
    },
  })
}

export { createAppointment, getAppointment, updateAppointment, cancelAppointment }
