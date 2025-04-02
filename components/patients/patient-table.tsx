"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientViewDialog } from "./patient-view-dialog"
import { PatientCarePlanDialog } from "./patient-care-plan-dialog"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  status: string
  primaryCondition: string
  avatar?: string
}

interface PatientTableProps {
  patients: Patient[]
}

export function PatientTable({ patients }: PatientTableProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [carePlanDialogOpen, setCarePlanDialogOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Primary Condition</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                </Avatar>
                {patient.name}
              </TableCell>
              <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
              </TableCell>
              <TableCell>{patient.primaryCondition}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPatient(patient)
                    setViewDialogOpen(true)
                  }}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPatient(patient)
                    setCarePlanDialogOpen(true)
                  }}
                >
                  Care Plan
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPatient && (
        <>
          <PatientViewDialog patient={selectedPatient} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
          <PatientCarePlanDialog
            patient={selectedPatient}
            open={carePlanDialogOpen}
            onOpenChange={setCarePlanDialogOpen}
          />
        </>
      )}
    </>
  )
}

