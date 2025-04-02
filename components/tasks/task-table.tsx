"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, Check, Clock, AlertCircle } from "lucide-react"

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

type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignedTo: string
  createdBy: string
  relatedToType: "patient" | "staff" | "general"
  relatedToId: string
  relatedToName: string
}

const tasks: Task[] = [
  {
    id: "T001",
    title: "Review medication plan",
    description: "Review and update the medication plan for John Doe",
    status: "pending",
    priority: "high",
    dueDate: "2023-06-15",
    assignedTo: "Dr. Sarah Johnson",
    createdBy: "Admin User",
    relatedToType: "patient",
    relatedToId: "P001",
    relatedToName: "John Doe",
  },
  {
    id: "T002",
    title: "Schedule follow-up appointment",
    description: "Schedule a follow-up appointment for Jane Smith",
    status: "completed",
    priority: "medium",
    dueDate: "2023-06-10",
    assignedTo: "Nurse Williams",
    createdBy: "Dr. Michael Chen",
    relatedToType: "patient",
    relatedToId: "P002",
    relatedToName: "Jane Smith",
  },
  {
    id: "T003",
    title: "Update DBS check",
    description: "Ensure DBS check is up to date for staff member",
    status: "in_progress",
    priority: "medium",
    dueDate: "2023-06-20",
    assignedTo: "HR Manager",
    createdBy: "Admin User",
    relatedToType: "staff",
    relatedToId: "S001",
    relatedToName: "Nurse Williams",
  },
  {
    id: "T004",
    title: "Prepare monthly report",
    description: "Prepare the monthly patient outcome report",
    status: "overdue",
    priority: "urgent",
    dueDate: "2023-06-05",
    assignedTo: "Admin User",
    createdBy: "Dr. James Wilson",
    relatedToType: "general",
    relatedToId: "G001",
    relatedToName: "Monthly Reporting",
  },
  {
    id: "T005",
    title: "Order medical supplies",
    description: "Order new medical supplies for the clinic",
    status: "pending",
    priority: "low",
    dueDate: "2023-06-25",
    assignedTo: "Admin Assistant",
    createdBy: "Admin User",
    relatedToType: "general",
    relatedToId: "G002",
    relatedToName: "Inventory Management",
  },
]

export function TaskTable() {
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

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Task]
    const bValue = b[sortColumn as keyof Task]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Cancelled
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Overdue
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Urgent
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Task</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("priority")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Priority</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("dueDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Due Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.relatedToType === "patient" ? "Patient: " : task.relatedToType === "staff" ? "Staff: " : ""}
                    {task.relatedToName}
                  </p>
                </div>
              </TableCell>
              <TableCell>{getPriorityBadge(task.priority)}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  {getStatusBadge(task.status)}
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
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Task</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark as Completed</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Task</span>
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

