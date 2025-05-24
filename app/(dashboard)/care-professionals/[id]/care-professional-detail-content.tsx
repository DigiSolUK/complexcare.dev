import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CareProfessional } from "@/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppointmentList } from "@/components/care-professionals/appointment-list"
import { AssignedPatientsList } from "@/components/care-professionals/assigned-patients-list"

interface CareProfessionalDetailContentProps {
  professional: CareProfessional
}

export function CareProfessionalDetailContent({ professional }: CareProfessionalDetailContentProps) {
  return (
    <Tabs defaultValue="details" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="patients">Assigned Patients</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Details about the care professional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={professional.image || "/placeholder.svg"} alt="Care Professional" />
                <AvatarFallback>
                  {professional.first_name[0]}
                  {professional.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {professional.first_name} {professional.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">{professional.specialty}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm text-muted-foreground">{professional.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone:</p>
                <p className="text-sm text-muted-foreground">{professional.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date of Birth:</p>
                <p className="text-sm text-muted-foreground">{format(new Date(professional.date_of_birth), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Gender:</p>
                <p className="text-sm text-muted-foreground">{professional.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm text-muted-foreground">{professional.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="credentials" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>Details about the care professional's credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of the care professional's credentials.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professional.credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">{credential.type}</TableCell>
                    <TableCell>{credential.name}</TableCell>
                    <TableCell>{format(new Date(credential.issue_date), "PPP")}</TableCell>
                    <TableCell>
                      {credential.expiration_date ? format(new Date(credential.expiration_date), "PPP") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {credential.is_active ? (
                        <Badge variant="outline">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="appointments" className="space-y-4">
        <AppointmentList careProfessionalId={professional.id} />
      </TabsContent>
      <TabsContent value="patients" className="space-y-4">
        <AssignedPatientsList
          careProfessionalId={professional.id}
          careProfessionalName={`${professional.first_name} ${professional.last_name}`}
        />
      </TabsContent>
      <TabsContent value="tasks" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Details about the care professional's tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Tasks content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
