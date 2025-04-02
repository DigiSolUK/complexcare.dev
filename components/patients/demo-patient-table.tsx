"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, FileEdit, Trash2, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  {
    id: "P003",
    name: "Michael Brown",
    nhsNumber: "345 678 9012",
    dateOfBirth: "03/07/1968",
    careNeeds: "Medium",
    status: "Inactive",
    address: "789 Pine Rd, Birmingham, UK",
    phone: "0121 345 6789",
    email: "michael.brown@example.com",
    emergencyContact: "Susan Brown (Sister) - 0121 987 6543",
    primaryCareProvider: "Dr. Taylor",
    medicalConditions: ["COPD", "Coronary Artery Disease"],
    medications: ["Salbutamol", "Aspirin", "Atorvastatin"],
    allergies: ["Latex"],
    notes: "Patient is a smoker and has been advised to quit.",
  },
  {
    id: "P004",
    name: "Emily Wilson",
    nhsNumber: "456 789 0123",
    dateOfBirth: "19/02/1990",
    careNeeds: "Complex",
    status: "Active",
    address: "101 Elm St, Glasgow, UK",
    phone: "0141 456 7890",
    email: "emily.wilson@example.com",
    emergencyContact: "Robert Wilson (Father) - 0141 098 7654",
    primaryCareProvider: "Dr. Anderson",
    medicalConditions: ["Cystic Fibrosis", "Asthma", "Anxiety"],
    medications: ["Ivacaftor", "Salbutamol", "Fluoxetine"],
    allergies: ["Ibuprofen"],
    notes: "Patient requires regular respiratory therapy.",
  },
  {
    id: "P005",
    name: "David Taylor",
    nhsNumber: "567 890 1234",
    dateOfBirth: "30/09/1955",
    careNeeds: "High",
    status: "Active",
    address: "202 Maple Dr, Edinburgh, UK",
    phone: "0131 567 8901",
    email: "david.taylor@example.com",
    emergencyContact: "Margaret Taylor (Wife) - 0131 109 8765",
    primaryCareProvider: "Dr. Roberts",
    medicalConditions: ["Parkinson's Disease", "Glaucoma", "Hypertension"],
    medications: ["Levodopa", "Timolol eye drops", "Amlodipine"],
    allergies: ["Codeine"],
    notes: "Patient experiences tremors and requires assistance with fine motor tasks.",
  },
  {
    id: "P006",
    name: "Jessica Lee",
    nhsNumber: "678 901 2345",
    dateOfBirth: "12/12/1987",
    careNeeds: "Medium",
    status: "On Hold",
    address: "303 Cedar Ln, Bristol, UK",
    phone: "0117 678 9012",
    email: "jessica.lee@example.com",
    emergencyContact: "Thomas Lee (Brother) - 0117 210 9876",
    primaryCareProvider: "Dr. Martin",
    medicalConditions: ["Rheumatoid Arthritis", "Migraine"],
    medications: ["Methotrexate", "Sumatriptan", "Folic Acid"],
    allergies: ["NSAIDs"],
    notes: "Patient is currently pregnant and treatment plan has been adjusted accordingly.",
  },
  {
    id: "P007",
    name: "Robert Martin",
    nhsNumber: "789 012 3456",
    dateOfBirth: "25/04/1972",
    careNeeds: "Complex",
    status: "Active",
    address: "404 Birch St, Liverpool, UK",
    phone: "0151 789 0123",
    email: "robert.martin@example.com",
    emergencyContact: "Elizabeth Martin (Wife) - 0151 321 0987",
    primaryCareProvider: "Dr. Thompson",
    medicalConditions: ["Spinal Cord Injury", "Neurogenic Bladder", "Chronic Pain"],
    medications: ["Baclofen", "Oxybutynin", "Gabapentin"],
    allergies: ["Morphine"],
    notes: "Patient uses a wheelchair and requires specialized equipment for transfers.",
  },
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
  P003: [
    {
      id: "CP004",
      title: "COPD Management Plan",
      description: "Respiratory therapy and medication management for COPD.",
      status: "Inactive",
      startDate: "05/11/2022",
      endDate: "05/05/2023",
      reviewDate: "05/02/2023",
      assignedTo: "Dr. Taylor",
    },
  ],
  P004: [
    {
      id: "CP005",
      title: "Cystic Fibrosis Treatment Plan",
      description: "Comprehensive treatment plan including respiratory therapy, nutrition, and medication management.",
      status: "Active",
      startDate: "20/02/2023",
      endDate: "20/08/2023",
      reviewDate: "20/05/2023",
      assignedTo: "Dr. Anderson",
    },
    {
      id: "CP006",
      title: "Anxiety Management",
      description: "Therapy and medication plan for managing anxiety symptoms.",
      status: "Active",
      startDate: "15/03/2023",
      endDate: "15/09/2023",
      reviewDate: "15/06/2023",
      assignedTo: "Dr. Roberts",
    },
  ],
  P005: [
    {
      id: "CP007",
      title: "Parkinson's Disease Management",
      description: "Medication and physical therapy plan for managing Parkinson's symptoms.",
      status: "Active",
      startDate: "10/01/2023",
      endDate: "10/07/2023",
      reviewDate: "10/04/2023",
      assignedTo: "Dr. Roberts",
    },
  ],
  P006: [
    {
      id: "CP008",
      title: "Pregnancy Care with Rheumatoid Arthritis",
      description: "Specialized care plan for managing rheumatoid arthritis during pregnancy.",
      status: "On Hold",
      startDate: "01/03/2023",
      endDate: "01/12/2023",
      reviewDate: "01/06/2023",
      assignedTo: "Dr. Martin",
    },
  ],
  P007: [
    {
      id: "CP009",
      title: "Spinal Cord Injury Management",
      description: "Comprehensive care plan for managing complications of spinal cord injury.",
      status: "Active",
      startDate: "15/02/2023",
      endDate: "15/08/2023",
      reviewDate: "15/05/2023",
      assignedTo: "Dr. Thompson",
    },
    {
      id: "CP010",
      title: "Chronic Pain Management",
      description:
        "Multimodal approach to managing chronic pain including medication, physical therapy, and psychological support.",
      status: "Active",
      startDate: "01/03/2023",
      endDate: "01/09/2023",
      reviewDate: "01/06/2023",
      assignedTo: "Dr. Anderson",
    },
  ],
}

export function DemoPatientTable() {
  const [selectedPatient, setSelectedPatient] = useState<(typeof demoPatients)[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const handleViewPatient = (patient: (typeof demoPatients)[0]) => {
    setSelectedPatient(patient)
    setIsViewDialogOpen(true)
    setActiveTab("details")
  }

  const handleViewCarePlan = (patient: (typeof demoPatients)[0]) => {
    setSelectedPatient(patient)
    setIsViewDialogOpen(true)
    setActiveTab("carePlans")
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>NHS Number</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Care Needs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.nhsNumber}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.careNeeds === "Complex"
                        ? "destructive"
                        : patient.careNeeds === "High"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {patient.careNeeds}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.status === "Active" ? "outline" : patient.status === "Inactive" ? "secondary" : "default"
                    }
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View patient
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewCarePlan(patient)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View care plan
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Patient View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedPatient.name}</DialogTitle>
                    <DialogDescription>
                      NHS Number: {selectedPatient.nhsNumber} | DOB: {selectedPatient.dateOfBirth}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Patient Details</TabsTrigger>
                  <TabsTrigger value="carePlans">Care Plans</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <div className="font-medium">Address</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.address}</div>
                        </div>
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.phone}</div>
                        </div>
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.email}</div>
                        </div>
                        <div>
                          <div className="font-medium">Emergency Contact</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.emergencyContact}</div>
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
                          <div className="text-sm text-muted-foreground">{selectedPatient.primaryCareProvider}</div>
                        </div>
                        <div>
                          <div className="font-medium">Medical Conditions</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedPatient.medicalConditions.join(", ")}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Medications</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.medications.join(", ")}</div>
                        </div>
                        <div>
                          <div className="font-medium">Allergies</div>
                          <div className="text-sm text-muted-foreground">{selectedPatient.allergies.join(", ")}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedPatient.notes}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="carePlans" className="mt-4 space-y-4">
                  {demoCarePlans[selectedPatient.id as keyof typeof demoCarePlans]?.length > 0 ? (
                    demoCarePlans[selectedPatient.id as keyof typeof demoCarePlans].map((carePlan) => (
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
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

