"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, ExternalLink } from "lucide-react"

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

type JobPosting = {
  id: string
  title: string
  department: string
  location: string
  type: "full_time" | "part_time" | "contract" | "temporary"
  salary: string
  postedDate: string
  closingDate: string
  status: "active" | "closed" | "draft" | "expired"
  applicantsCount: number
}

const jobPostings: JobPosting[] = [
  {
    id: "JOB001",
    title: "Registered Nurse",
    department: "Clinical",
    location: "London, UK",
    type: "full_time",
    salary: "£35,000 - £40,000",
    postedDate: "2023-05-01",
    closingDate: "2023-06-30",
    status: "active",
    applicantsCount: 12,
  },
  {
    id: "JOB002",
    title: "Care Coordinator",
    department: "Care Management",
    location: "Manchester, UK",
    type: "full_time",
    salary: "£30,000 - £35,000",
    postedDate: "2023-05-05",
    closingDate: "2023-06-25",
    status: "active",
    applicantsCount: 8,
  },
  {
    id: "JOB003",
    title: "Healthcare Assistant",
    department: "Clinical Support",
    location: "Birmingham, UK",
    type: "part_time",
    salary: "£22,000 - £25,000 pro rata",
    postedDate: "2023-05-10",
    closingDate: "2023-06-20",
    status: "active",
    applicantsCount: 15,
  },
  {
    id: "JOB004",
    title: "Mental Health Specialist",
    department: "Clinical",
    location: "Bristol, UK",
    type: "full_time",
    salary: "£38,000 - £45,000",
    postedDate: "2023-04-15",
    closingDate: "2023-05-30",
    status: "closed",
    applicantsCount: 10,
  },
  {
    id: "JOB005",
    title: "Administrative Assistant",
    department: "Administration",
    location: "Edinburgh, UK",
    type: "contract",
    salary: "£25,000 - £28,000",
    postedDate: "2023-05-01",
    closingDate: "2023-05-15",
    status: "expired",
    applicantsCount: 2,
  },
]

export function JobPostingTable() {
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

  const sortedJobPostings = [...jobPostings].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof JobPosting]
    const bValue = b[sortColumn as keyof JobPosting]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusBadge = (status: JobPosting["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Closed
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Draft
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expired
          </Badge>
        )
    }
  }

  const getJobTypeBadge = (type: JobPosting["type"]) => {
    switch (type) {
      case "full_time":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Full Time
          </Badge>
        )
      case "part_time":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Part Time
          </Badge>
        )
      case "contract":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Contract
          </Badge>
        )
      case "temporary":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Temporary
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
                onClick={() => handleSort("title")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Job Title</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("postedDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Posted Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobPostings.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.id}</TableCell>
              <TableCell>
                <div className="font-medium">{job.title}</div>
                <div className="text-xs text-muted-foreground">{job.salary}</div>
              </TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{getJobTypeBadge(job.type)}</TableCell>
              <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
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
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Job Posting</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>View Applicants ({job.applicantsCount})</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Job Posting</span>
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

