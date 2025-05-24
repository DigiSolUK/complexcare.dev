import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Calendar, FileText, MessageSquare, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PatientHeaderProps {
  patient: {
    id: string
    name: string
    dateOfBirth: string
    gender: string
    status: string
    nhsNumber?: string
    avatar?: string
  }
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  const calculateAge = (dateString: string) => {
    try {
      const birthDate = new Date(dateString)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    } catch (e) {
      return "Unknown"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-primary/10">
          {patient.avatar ? (
            <Image src={patient.avatar || "/placeholder.svg"} alt={patient.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {getInitials(patient.name)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                {patient.nhsNumber && <span className="text-sm text-muted-foreground">NHS: {patient.nhsNumber}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Patient
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Medical History</DropdownMenuItem>
                  <DropdownMenuItem>View Care Plan</DropdownMenuItem>
                  <DropdownMenuItem>View Medications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Archive Patient</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
