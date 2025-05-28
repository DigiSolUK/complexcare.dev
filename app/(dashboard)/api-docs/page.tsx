import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <p className="text-gray-500 mb-8">
        This page documents the available API endpoints in public mode. All endpoints are accessible without
        authentication.
      </p>

      <Tabs defaultValue="patients">
        <TabsList className="mb-4">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="care-professionals">Care Professionals</TabsTrigger>
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patients API</CardTitle>
              <CardDescription>Endpoints for managing patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/patients</TableCell>
                    <TableCell>Get all patients</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/patients/[id]</TableCell>
                    <TableCell>Get a specific patient by ID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>POST</TableCell>
                    <TableCell>/api/patients</TableCell>
                    <TableCell>Create a new patient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PUT</TableCell>
                    <TableCell>/api/patients/[id]</TableCell>
                    <TableCell>Update a patient</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-professionals">
          <Card>
            <CardHeader>
              <CardTitle>Care Professionals API</CardTitle>
              <CardDescription>Endpoints for managing care professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/care-professionals</TableCell>
                    <TableCell>Get all care professionals</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/care-professionals/[id]</TableCell>
                    <TableCell>Get a specific care professional by ID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>POST</TableCell>
                    <TableCell>/api/care-professionals</TableCell>
                    <TableCell>Create a new care professional</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PUT</TableCell>
                    <TableCell>/api/care-professionals/[id]</TableCell>
                    <TableCell>Update a care professional</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical-notes">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes API</CardTitle>
              <CardDescription>Endpoints for managing clinical notes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/clinical-notes</TableCell>
                    <TableCell>Get all clinical notes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/clinical-notes?patientId=[id]</TableCell>
                    <TableCell>Get clinical notes for a specific patient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/clinical-notes/[id]</TableCell>
                    <TableCell>Get a specific clinical note by ID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>POST</TableCell>
                    <TableCell>/api/clinical-notes</TableCell>
                    <TableCell>Create a new clinical note</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments API</CardTitle>
              <CardDescription>Endpoints for managing appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/appointments</TableCell>
                    <TableCell>Get all appointments</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/appointments?patientId=[id]</TableCell>
                    <TableCell>Get appointments for a specific patient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>POST</TableCell>
                    <TableCell>/api/appointments</TableCell>
                    <TableCell>Create a new appointment</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks API</CardTitle>
              <CardDescription>Endpoints for managing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/tasks</TableCell>
                    <TableCell>Get all tasks</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GET</TableCell>
                    <TableCell>/api/tasks?assignedTo=[id]</TableCell>
                    <TableCell>Get tasks assigned to a specific user</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>POST</TableCell>
                    <TableCell>/api/tasks</TableCell>
                    <TableCell>Create a new task</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PUT</TableCell>
                    <TableCell>/api/tasks/[id]</TableCell>
                    <TableCell>Update a task</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
