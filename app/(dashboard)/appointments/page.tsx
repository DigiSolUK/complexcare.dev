import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllAppointments } from "@/lib/services/appointment-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Loading component for Suspense
function LoadingAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></CardTitle>
        <CardDescription className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Appointments table component
async function AppointmentsTable() {
  try {
    const appointments = await getAllAppointments(DEFAULT_TENANT_ID, 20, 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>View and manage appointments</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input placeholder="Search appointments..." className="max-w-sm" />
            <Button>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Care Professional</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                      {appointment.appointment_time.substring(0, 5)}
                    </TableCell>
                    <TableCell>Patient ID: {appointment.patient_id}</TableCell>
                    <TableCell>Professional ID: {appointment.care_professional_id}</TableCell>
                    <TableCell>{appointment.appointment_type}</TableCell>
                    <TableCell>{appointment.location}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          appointment.status === "scheduled"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : appointment.status === "completed"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/appointments/${appointment.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No appointments found</div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error loading appointments:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Error loading appointment data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <h3 className="text-lg font-semibold">Database Connection Error</h3>
            <p>Unable to load appointment data. Please check your database connection.</p>
            <p className="text-sm mt-2">Error details: {error instanceof Error ? error.message : String(error)}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default function AppointmentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <Button>Schedule Appointment</Button>
      </div>

      <Suspense fallback={<LoadingAppointments />}>
        <AppointmentsTable />
      </Suspense>
    </div>
  )
}
