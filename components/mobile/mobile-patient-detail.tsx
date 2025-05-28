"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Phone, MessageSquare, Calendar, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MobilePatientDetailProps {
  patientId: string
}

export function MobilePatientDetail({ patientId }: MobilePatientDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample patient data - in a real app, this would be fetched based on patientId
  const patient = {
    id: patientId,
    name: "John Smith",
    age: 45,
    dob: "12/05/1978",
    address: "123 Main Street, London, UK",
    phone: "+44 7700 900123",
    email: "john.smith@example.com",
    condition: "Diabetes Type 2",
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    ],
    appointments: [
      { date: "15/06/2025", time: "10:30", type: "Check-up" },
      { date: "28/07/2025", time: "14:15", type: "Blood Test" },
    ],
    notes: [
      {
        date: "05/05/2025",
        content: "Patient reported increased fatigue. Recommended dietary changes and increased fluid intake.",
      },
      { date: "20/04/2025", content: "Blood glucose levels stable. Continuing current medication regimen." },
    ],
  }

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4 flex items-center space-x-2">
          <Link href="/mobile/patients">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{patient.name}</h1>
        </div>

        <div className="px-4 pb-2 flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>

        <TabsList className="w-full justify-start px-4 pb-2 pt-0">
          <TabsTrigger
            value="overview"
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            onClick={() => setActiveTab("notes")}
            className={activeTab === "notes" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            onClick={() => setActiveTab("medications")}
            className={activeTab === "medications" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Medications
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="p-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{patient.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{patient.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{patient.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{patient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-right">{patient.address}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span>{patient.condition}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Allergies:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {patient.allergies.map((allergy) => (
                      <span key={allergy} className="bg-muted px-2 py-1 rounded-md text-xs">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Upcoming Appointments</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.appointments.map((appointment, index) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div>{appointment.type}</div>
                      <div className="text-xs text-muted-foreground">{appointment.date}</div>
                    </div>
                    <div className="text-sm">{appointment.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Clinical Notes</h2>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>

            {patient.notes.map((note, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground mb-1">{note.date}</div>
                  <div className="text-sm">{note.content}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "medications" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Medications</h2>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {patient.medications.map((medication, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="font-medium">{medication.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {medication.dosage} • {medication.frequency}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
