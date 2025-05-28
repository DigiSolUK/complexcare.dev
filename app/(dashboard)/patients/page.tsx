import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllPatients } from "@/lib/services/patient-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Loading component for Suspense
function LoadingPatients() {
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

// Patients table component
async function PatientsTable() {
  try {
    const patients = await getAllPatients(DEFAULT_TENANT_ID, 20, 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Manage your patients and their information</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input placeholder="Search patients..." className="max-w-sm" />
            <Button>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>NHS Number</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Primary Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell>{patient.nhs_number || "N/A"}</TableCell>
                    <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.primary_condition || "None recorded"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          patient.is_active
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}
                      >
                        {patient.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/patients/${patient.id}`}>
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
            <div className="text-center py-4 text-muted-foreground">No patients found</div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error loading patients:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Error loading patient data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <h3 className="text-lg font-semibold">Database Connection Error</h3>
            <p>Unable to load patient data. Please check your database connection.</p>
            <p className="text-sm mt-2">Error details: {error instanceof Error ? error.message : String(error)}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default function PatientsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        <Button>Add Patient</Button>
      </div>

      <Suspense fallback={<LoadingPatients />}>
        <PatientsTable />
      </Suspense>
    </div>
  )
}
