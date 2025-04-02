import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, MessageSquare, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PatientGPConnectLink } from "@/components/patients/patient-gp-connect-link"

// Demo data for patients
const demoPatients = [
  {
    id: "P001",
    name: "John Smith",
    nhsNumber: "123 456 7890",
    dateOfBirth: "15/05/1975",
    careNeeds: "Complex",
    status: "Active",
    address: "123 Main St, London, UK",
    phone: "020 1234 5678",
    email: "john.smith@example.com",
    emergencyContact: "Jane Smith (Wife) - 020 8765 4321",
    primaryCareProvider: "Dr. Johnson",
    medicalConditions: ["Type 2 Diabetes", "Hypertension", "Osteoarthritis"],
    medications: ["Metformin", "Lisinopril", "Paracetamol"],
    allergies: ["Penicillin", "Shellfish"],
    notes: "Patient requires regular monitoring of blood sugar levels.",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    nhsNumber: "234 567 8901",
    dateOfBirth: "22/11/1982",
    careNeeds: "High",
    status: "Active",
    address: "456 Oak Ave, Manchester, UK",
    phone: "0161 234 5678",
    email: "sarah.johnson@example.com",
    emergencyContact: "Michael Johnson (Husband) - 0161 876 5432",
    primaryCareProvider: "Dr. Williams",
    medicalConditions: ["Multiple Sclerosis", "Depression"],
    medications: ["Interferon beta-1a", "Sertraline", "Vitamin D"],
    allergies: ["Sulfa drugs"],
    notes: "Patient has limited mobility and requires assistance with daily activities.",
  },
  // ... other patients
]

// Demo care plans for patients
const demoCarePlans = {
  P001: [
    {
      id: "CP001",
      title: "Diabetes Management Plan",
      description:
        "Comprehensive plan for managing Type 2 Diabetes including blood sugar monitoring, medication management, dietary guidelines, and exercise recommendations.",
      status: "Active",
      startDate: "15/01/2023",
      endDate: "15/07/2023",
      reviewDate: "15/04/2023",
      assignedTo: "Dr. Johnson",
    },
    {
      id: "CP002",
      title: "Hypertension Management",
      description: "Blood pressure monitoring and medication management plan.",
      status: "Active",
      startDate: "01/02/2023",
      endDate: "01/08/2023",
      reviewDate: "01/05/2023",
      assignedTo: "Dr. Williams",
    },
  ],
  P002: [
    {
      id: "CP003",
      title: "Multiple Sclerosis Care Plan",
      description: "Comprehensive management plan for MS symptoms and disease progression.",
      status: "Active",
      startDate: "10/03/2023",
      endDate: "10/09/2023",
      reviewDate: "10/06/2023",
      assignedTo: "Dr. Williams",
    },
  ],
  // ... other care plans
}

// Demo appointments for patients
const demoAppointments = {
  P001: [
    {
      id: "A001",
      title: "Regular Check-up",
      date: "15/04/2023",
      time: "10:00 AM",
      provider: "Dr. Johnson",
      location: "Main Clinic",
      status: "Scheduled",
    },
    {
      id: "A002",
      title: "Diabetes Review",
      date: "30/04/2023",
      time: "2:30 PM",
      provider: "Dr. Williams",
      location: "Diabetes Clinic",
      status: "Scheduled",
    },
  ],
  P002: [
    {
      id: "A003",
      title: "MS Treatment",
      date: "20/04/2023",
      time: "11:15 AM",
      provider: "Dr. Williams",
      location: "Neurology Department",
      status: "Scheduled",
    },
  ],
  // ... other appointments
}

// Demo notes for patients
const demoNotes = {
  P001: [
    {
      id: "N001",
      date: "01/04/2023",
      time: "11:30 AM",
      author: "Dr. Johnson",
      content:
        "Patient reports improved blood sugar levels following diet changes. Continue current medication regimen.",
    },
    {
      id: "N002",
      date: "15/03/2023",
      time: "9:45 AM",
      author: "Nurse Wilson",
      content: "Blood pressure reading: 138/85. Slightly elevated but improved from last visit.",
    },
  ],
  P002: [
    {
      id: "N003",
      date: "25/03/2023",
      time: "2:15 PM",
      author: "Dr. Williams",
      content:
        "Patient experiencing increased fatigue. Adjusted medication dosage and recommended additional rest periods.",
    },
  ],
  // ... other notes
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = demoPatients.find((p) => p.id === params.id)

  if (!patient) {
    notFound()
  }

  const carePlans = demoCarePlans[patient.id as keyof typeof demoCarePlans] || []
  const appointments = demoAppointments[patient.id as keyof typeof demoAppointments] || []
  const notes = demoNotes[patient.id as keyof typeof demoNotes] || []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">
              NHS Number: {patient.nhsNumber} | DOB: {patient.dateOfBirth}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={patient.status === "Active" ? "outline" : patient.status === "Inactive" ? "secondary" : "default"}
          >
            {patient.status}
          </Badge>
          <Badge
            variant={
              patient.careNeeds === "Complex" ? "destructive" : patient.careNeeds === "High" ? "default" : "secondary"
            }
          >
            {patient.careNeeds}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="carePlans">Care Plans</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">{patient.address}</div>
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{patient.phone}</div>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{patient.email}</div>
                </div>
                <div>
                  <div className="font-medium">Emergency Contact</div>
                  <div className="text-sm text-muted-foreground">{patient.emergencyContact}</div>
                </div>
                <div className="pt-4">
                  <PatientGPConnectLink patientId={patient.id} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="font-medium">Primary Care Provider</div>
                  <div className="text-sm text-muted-foreground">{patient.primaryCareProvider}</div>
                </div>
                <div>
                  <div className="font-medium">Medical Conditions</div>
                  <div className="text-sm text-muted-foreground">{patient.medicalConditions.join(", ")}</div>
                </div>
                <div>
                  <div className="font-medium">Medications</div>
                  <div className="text-sm text-muted-foreground">{patient.medications.join(", ")}</div>
                </div>
                <div>
                  <div className="font-medium">Allergies</div>
                  <div className="text-sm text-muted-foreground">{patient.allergies.join(", ")}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{patient.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carePlans" className="mt-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Care Plans</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Care Plan
            </Button>
          </div>

          {carePlans.length > 0 ? (
            carePlans.map((carePlan) => (
              <Card key={carePlan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{carePlan.title}</CardTitle>
                    <Badge
                      variant={
                        carePlan.status === "Active"
                          ? "default"
                          : carePlan.status === "Inactive"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {carePlan.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {carePlan.startDate} to {carePlan.endDate} | Review: {carePlan.reviewDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="font-medium">Description</div>
                    <div className="text-sm text-muted-foreground">{carePlan.description}</div>
                  </div>
                  <div>
                    <div className="font-medium">Assigned To</div>
                    <div className="text-sm text-muted-foreground">{carePlan.assignedTo}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No care plans found for this patient.</p>
              <Button className="mt-4">Create Care Plan</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="mt-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Appointments</h2>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>

          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{appointment.title}</CardTitle>
                    <Badge
                      variant={
                        appointment.status === "Scheduled"
                          ? "default"
                          : appointment.status === "Completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {appointment.date} at {appointment.time} | {appointment.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">Provider</div>
                  <div className="text-sm text-muted-foreground">{appointment.provider}</div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments scheduled for this patient.</p>
              <Button className="mt-4">Schedule Appointment</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Clinical Notes</h2>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>

          {notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {note.date} at {note.time}
                    </CardTitle>
                    <Badge variant="outline">{note.author}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clinical notes found for this patient.</p>
              <Button className="mt-4">Add Note</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

