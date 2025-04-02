"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, CheckCircle, XCircle, Calendar, Clock, Download, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Application = {
  id: string
  applicantName: string
  jobTitle: string
  jobId: string
  appliedDate: string
  status: "new" | "reviewing" | "interview_scheduled" | "offer_extended" | "hired" | "rejected"
  interviewDate: string | null
  resume: string
  coverLetter: string | null
}

const applications: Application[] = [
  {
    id: "APP001",
    applicantName: "John Smith",
    jobTitle: "Registered Nurse",
    jobId: "JOB001",
    appliedDate: "2023-05-15",
    status: "interview_scheduled",
    interviewDate: "2023-06-05",
    resume: "john-smith-resume.pdf",
    coverLetter: "john-smith-cover-letter.pdf",
  },
  {
    id: "APP002",
    applicantName: "Sarah Johnson",
    jobTitle: "Care Coordinator",
    jobId: "JOB002",
    appliedDate: "2023-05-16",
    status: "reviewing",
    interviewDate: null,
    resume: "sarah-johnson-resume.pdf",
    coverLetter: null,
  },
  {
    id: "APP003",
    applicantName: "Michael Wilson",
    jobTitle: "Healthcare Assistant",
    jobId: "JOB003",
    appliedDate: "2023-05-18",
    status: "new",
    interviewDate: null,
    resume: "michael-wilson-resume.pdf",
    coverLetter: "michael-wilson-cover-letter.pdf",
  },
  {
    id: "APP004",
    applicantName: "Emily Brown",
    jobTitle: "Registered Nurse",
    jobId: "JOB001",
    appliedDate: "2023-05-10",
    status: "offer_extended",
    interviewDate: "2023-05-25",
    resume: "emily-brown-resume.pdf",
    coverLetter: "emily-brown-cover-letter.pdf",
  },
  {
    id: "APP005",
    applicantName: "David Lee",
    jobTitle: "Care Coordinator",
    jobId: "JOB002",
    appliedDate: "2023-05-12",
    status: "rejected",
    interviewDate: "2023-05-22",
    resume: "david-lee-resume.pdf",
    coverLetter: null,
  },
]

export function ApplicationTable() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Application]
    const bValue = b[sortColumn as keyof Application]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "new":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "reviewing":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "interview_scheduled":
        return <Calendar className="h-4 w-4 text-orange-500" />
      case "offer_extended":
        return <Mail className="h-4 w-4 text-green-500" />
      case "hired":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            New
          </Badge>
        )
      case "reviewing":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Reviewing
          </Badge>
        )
      case "interview_scheduled":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Interview Scheduled
          </Badge>
        )
      case "offer_extended":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Offer Extended
          </Badge>
        )
      case "hired":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Hired
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("id")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>ID</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("applicantName")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Applicant</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("jobTitle")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Job</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("appliedDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Applied Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Interview Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {application.applicantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {application.applicantName}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{application.jobTitle}</div>
                <div className="text-xs text-muted-foreground">ID: {application.jobId}</div>
              </TableCell>
              <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {application.interviewDate ? (
                  new Date(application.interviewDate).toLocaleDateString()
                ) : (
                  <span className="text-muted-foreground text-xs">Not scheduled</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(application.status)}
                  {getStatusBadge(application.status)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download Resume</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Schedule Interview</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>Reject Application</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

