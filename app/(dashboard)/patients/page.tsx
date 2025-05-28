import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockData } from "@/lib/db"

export default function PatientsPage() {
  // Use mock data directly
  const patients = mockData.patients

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Link href="/patients/new">
          <Button>Add New Patient</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{patient.nhs_number}</TableCell>
                  <TableCell>{patient.date_of_birth}</TableCell>
                  <TableCell>{patient.primary_condition}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Active</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/patients/${patient.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {/* Add a few more mock patients */}
              <TableRow>
                <TableCell className="font-medium">Robert Johnson</TableCell>
                <TableCell>NHS54321</TableCell>
                <TableCell>1965-03-22</TableCell>
                <TableCell>Asthma</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Active</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/patients/p3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/patients/p3/edit">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Sarah Williams</TableCell>
                <TableCell>NHS98765</TableCell>
                <TableCell>1982-11-15</TableCell>
                <TableCell>Migraine</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Active</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/patients/p4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/patients/p4/edit">
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
