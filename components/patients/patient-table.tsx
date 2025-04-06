import type { Patient } from "@/types/patient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface PatientTableProps {
  patients: Patient[]
}

export function PatientTable({ patients }: PatientTableProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  // Function to determine care needs level
  const getCareNeedsLevel = (patient: Patient) => {
    if (!patient.medicalConditions || patient.medicalConditions.length === 0) {
      return { label: "Low", variant: "outline" as const }
    }

    if (patient.medicalConditions.length > 2) {
      return { label: "Complex", variant: "destructive" as const }
    }

    if (patient.medicalConditions.length > 1) {
      return { label: "High", variant: "default" as const }
    }

    return { label: "Medium", variant: "secondary" as const }
  }

  // If no patients, show empty state
  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No patients found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">NHS Number</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date of Birth</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Care Needs</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const careNeeds = getCareNeedsLevel(patient)
            const fullName = `${patient.firstName} ${patient.lastName}`

            return (
              <tr key={patient.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          patient.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${patient.firstName}+${patient.lastName}&background=random`
                        }
                        alt={fullName}
                      />
                      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                    </Avatar>
                    <Link href={`/patients/${patient.id}`} className="font-medium hover:underline">
                      {fullName}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">{patient.nhsNumber || "-"}</td>
                <td className="px-4 py-3">
                  {new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={careNeeds.variant}>{careNeeds.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={patient.status === "inactive" ? "outline" : "default"}>
                    {patient.status === "on hold" ? "On Hold" : patient.status === "inactive" ? "Inactive" : "Active"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

