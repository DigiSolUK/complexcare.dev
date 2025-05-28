import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockData } from "@/lib/db"

export default function AppointmentsPage() {
  // Use mock data directly
  const appointments = mockData.appointments

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Link href="/appointments/new">
          <Button>Schedule New Appointment</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                // Find patient name
                const patient = mockData.patients.find((p) => p.id === appointment.patient_id)
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"

                // Find provider name
                const provider = mockData.care_professionals.find((cp) => cp.id === appointment.care_professional_id)
                const providerName = provider
                  ? `${provider.title} ${provider.first_name} ${provider.last_name}`
                  : "Unknown Provider"

                return (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{patientName}</TableCell>
                    <TableCell>{providerName}</TableCell>
                    <TableCell>{appointment.appointment_date}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>{appointment.appointment_type}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            appointment.status === "completed"
                              ? "bg-blue-500"
                              : appointment.status === "scheduled"
                                ? "bg-green-500"
                                : appointment.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                          } mr-2`}
                        ></div>
                        <span className="capitalize">{appointment.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/appointments/${appointment.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/appointments/${appointment.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Add a few more mock appointments */}
              <TableRow>
                <TableCell className="font-medium">Robert Johnson</TableCell>
                <TableCell>Dr. Wilson</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>14:30</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Pending</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/appointments/a3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/appointments/a3/edit">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Sarah Williams</TableCell>
                <TableCell>Nurse Johnson</TableCell>
                <TableCell>{new Date(Date.now() + 86400000).toLocaleDateString()}</TableCell>
                <TableCell>10:15</TableCell>
                <TableCell>Vaccination</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Scheduled</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/appointments/a4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/appointments/a4/edit">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
