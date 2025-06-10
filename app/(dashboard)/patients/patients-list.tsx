"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Demo patient data
const demoPatients = [
  {
    id: "p-001",
    name: "John Smith",
    dateOfBirth: "1965-05-14",
    gender: "Male",
    status: "Active",
    primaryCondition: "Type 2 diabetes, Hypertension",
    nhsNumber: "1234567890",
    avatar: "/javascript-code.png",
  },
  {
    id: "p-002",
    name: "Emily Johnson",
    dateOfBirth: "1978-09-23",
    gender: "Female",
    status: "Critical",
    primaryCondition: "Asthma, Migraine",
    nhsNumber: "2345678901",
    avatar: "/abstract-ej-typography.png",
  },
  {
    id: "p-003",
    name: "Sarah Williams",
    dateOfBirth: "1992-11-18",
    gender: "Female",
    status: "Active",
    primaryCondition: "Anxiety disorder, IBS",
    nhsNumber: "3456789012",
    avatar: "/stylized-sw.png",
  },
  {
    id: "p-004",
    name: "Margaret Brown",
    dateOfBirth: "1945-03-12",
    gender: "Female",
    status: "Stable",
    primaryCondition: "Osteoarthritis, Hypertension",
    nhsNumber: "4567890123",
    avatar: "/monogram-mb.png",
  },
  {
    id: "p-005",
    name: "Robert Taylor",
    dateOfBirth: "1982-07-30",
    gender: "Male",
    status: "Active",
    primaryCondition: "Lower back pain, Depression",
    nhsNumber: "5678901234",
    avatar: "/road-trip-scenic-route.png",
  },
]

export function PatientsList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter patients based on search and status
  const filteredPatients = demoPatients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.nhsNumber.includes(searchQuery) ||
      patient.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleViewPatient = (id: string) => {
    router.push(`/patients/${id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
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
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Primary Condition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewPatient(patient.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-gray-500">NHS: {patient.nhsNumber}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                </TableCell>
                <TableCell>{patient.primaryCondition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
