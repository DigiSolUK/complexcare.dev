import { Suspense } from "react"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"

async function getPatients() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const patients = await sql`
      SELECT id, first_name, last_name
      FROM patients
      WHERE tenant_id = ${DEFAULT_TENANT_ID}
      AND deleted_at IS NULL
      ORDER BY last_name, first_name
    `

    return patients
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

async function getProviders() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const providers = await sql`
      SELECT id, first_name, last_name
      FROM users
      WHERE tenant_id = ${DEFAULT_TENANT_ID}
      AND role IN ('doctor', 'nurse', 'therapist', 'admin')
      ORDER BY last_name, first_name
    `

    return providers
  } catch (error) {
    console.error("Error fetching providers:", error)
    return []
  }
}

export default async function AppointmentsPage() {
  const [patients, providers] = await Promise.all([getPatients(), getProviders()])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Manage and schedule patient appointments</p>
      </div>

      <Suspense fallback={<div>Loading calendar...</div>}>
        <AppointmentCalendar patients={patients} providers={providers} />
      </Suspense>
    </div>
  )
}
