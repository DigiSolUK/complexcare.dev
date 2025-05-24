"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PatientViewDialog } from "./patient-view-dialog"
import { PatientCarePlanDialog } from "./patient-care-plan-dialog"
import { PatientEmptyState } from "./patient-empty-state"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText, Calendar, MoreHorizontal, UserPlus, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  status: string
  primaryCondition: string
  avatar?: string
  nhsNumber?: string
  riskLevel?: string
  lastAppointment?: string
  nextAppointment?: string
}

interface PatientTableProps {
  patients: Patient[]
  isLoading?: boolean
}

export function PatientTable({ patients, isLoading = false }: PatientTableProps) {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [carePlanDialogOpen, setCarePlanDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")

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

  const getRiskColor = (risk: string | undefined) => {
    if (!risk) return "bg-gray-100 text-gray-800"

    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  const handleViewPatient = (patient: Patient) => {
    router.push(`/patients/${patient.id}`)
  }

  const handleAddPatient = () => {
    router.push("/patients/new")
  }

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter((patient) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.nhsNumber && patient.nhsNumber.includes(searchQuery)) ||
      (patient.primaryCondition && patient.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    // Risk filter
    const matchesRisk =
      riskFilter === "all" || (patient.riskLevel && patient.riskLevel.toLowerCase() === riskFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesRisk
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b bg-gray-50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b last:border-0 flex items-center px-4">
              <div className="w-full flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[130px] h-10">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="h-10" onClick={handleAddPatient}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <PatientEmptyState onAddPatient={handleAddPatient} />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Primary Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {patient.avatar ? (
                            <div className="relative h-10 w-10">
                              <Image
                                src={patient.avatar || "/placeholder.svg"}
                                alt={patient.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) : (
                            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          {patient.nhsNumber && (
                            <div className="text-xs text-muted-foreground">NHS: {patient.nhsNumber}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {patient.riskLevel ? (
                        <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assessed</span>
                      )}
                    </TableCell>
                    <TableCell>{patient.primaryCondition}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPatient(patient)
                            setViewDialogOpen(true)
                          }}
                          className="h-8 w-8"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPatient(patient)
                            setCarePlanDialogOpen(true)
                          }}
                          className="h-8 w-8"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewPatient(patient)}>View Patient</DropdownMenuItem>
                            <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Add Appointment</DropdownMenuItem>
                            <DropdownMenuItem>Add Medication</DropdownMenuItem>
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Archive Patient</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

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
