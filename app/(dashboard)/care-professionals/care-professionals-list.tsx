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

// Demo care professionals data
const demoCareProfessionals = [
  {
    id: "cp-001",
    name: "Sarah Johnson",
    role: "Registered Nurse",
    specialization: "Palliative Care",
    status: "Active",
    email: "sarah.johnson@example.com",
    phone: "07700 900123",
    avatar: "/stylized-letters-sj.png",
  },
  {
    id: "cp-002",
    name: "James Williams",
    role: "Physiotherapist",
    specialization: "Neurological Rehabilitation",
    status: "Active",
    email: "james.williams@example.com",
    phone: "07700 900234",
    avatar: "/intertwined-letters.png",
  },
  {
    id: "cp-003",
    name: "Emily Brown",
    role: "Occupational Therapist",
    specialization: "Home Adaptations",
    status: "Active",
    email: "emily.brown@example.com",
    phone: "07700 900345",
    avatar: "/electric-bass-guitar.png",
  },
  {
    id: "cp-004",
    name: "Robert Smith",
    role: "Healthcare Assistant",
    specialization: "Personal Care",
    status: "Active",
    email: "robert.smith@example.com",
    phone: "07700 900456",
    avatar: "/abstract-rs.png",
  },
  {
    id: "cp-005",
    name: "Olivia Taylor",
    role: "Speech and Language Therapist",
    specialization: "Dysphagia Management",
    status: "Inactive",
    email: "olivia.taylor@example.com",
    phone: "07700 900567",
    avatar: "/abstract-ot.png",
  },
]

export function CareProfessionalsList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Filter care professionals based on search and role
  const filteredProfessionals = demoCareProfessionals.filter((professional) => {
    const matchesSearch =
      searchQuery === "" ||
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.specialization.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || professional.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleViewProfessional = (id: string) => {
    router.push(`/care-professionals/${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get unique roles for the filter
  const uniqueRoles = Array.from(new Set(demoCareProfessionals.map((p) => p.role)))

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search professionals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] h-10">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Professional
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessionals.map((professional) => (
              <TableRow
                key={professional.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewProfessional(professional.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                      <AvatarFallback>
                        {professional.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{professional.name}</div>
                  </div>
                </TableCell>
                <TableCell>{professional.role}</TableCell>
                <TableCell>{professional.specialization}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(professional.status)}>{professional.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{professional.email}</div>
                    <div className="text-gray-500">{professional.phone}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
