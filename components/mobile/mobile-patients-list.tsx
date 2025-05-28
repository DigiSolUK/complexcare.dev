"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MobilePatientsList() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample patient data
  const patients = [
    { id: "1", name: "John Smith", age: 45, condition: "Diabetes Type 2" },
    { id: "2", name: "Sarah Johnson", age: 67, condition: "Hypertension" },
    { id: "3", name: "Michael Brown", age: 52, condition: "COPD" },
    { id: "4", name: "Emma Wilson", age: 38, condition: "Anxiety" },
    { id: "5", name: "David Lee", age: 71, condition: "Parkinson's" },
    { id: "6", name: "Lisa Taylor", age: 29, condition: "Asthma" },
    { id: "7", name: "Robert Miller", age: 63, condition: "Heart Disease" },
    { id: "8", name: "Jennifer Davis", age: 42, condition: "Migraine" },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button size="sm" variant="outline">
          Add
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Link key={patient.id} href={`/mobile/patients/${patient.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-muted-foreground">
                  Age: {patient.age} • {patient.condition}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No patients found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  )
}
