"use client"

import { useState, useEffect, useMemo } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, FileEdit, Trash2, PlusCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { CreateTodoDialog } from "./create-todo-dialog"
import { EditTodoDialog } from "./edit-todo-dialog" // Assuming you have an edit dialog
import { deleteTaskAction, getTasksAction } from "@/lib/actions/task-actions"
import type { Task, TaskStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PatientService } from "@/lib/services/patient-service"
import type { Patient } from "@/types"

interface TaskTableProps {
  initialTasks: Task[]
  onTasksUpdated: () => void
  patientId?: string // Optional patientId for filtering/defaulting new tasks
}

export function TaskTable({ initialTasks, onTasksUpdated, patientId }: TaskTableProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState(false) // Manage loading state for internal fetches
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>("all") // New filter for patient
  const [patients, setPatients] = useState<Patient[]>([]) // State to store patients for filter dropdown

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const filters: { status?: TaskStatus; patientId?: string } = {}
      if (statusFilter !== "all") {
        filters.status = statusFilter
      }
      if (selectedPatientFilter !== "all") {
        filters.patientId = selectedPatientFilter
      } else if (patientId) {
        // If patientId is passed as prop, always filter by it
        filters.patientId = patientId
      }

      const result = await getTasksAction(filters)
      if (result.success && result.data) {
        setTasks(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load tasks.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading tasks.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const patientService = await PatientService.create()
      const fetchedPatients = await patientService.getPatients()
      setPatients(fetchedPatients)
    } catch (error) {
      console.error("Failed to fetch patients for filter:", error)
      toast({
        title: "Error",
        description: "Failed to load patients for filtering.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    setTasks(initialTasks) // Update tasks when initialTasks prop changes
  }, [initialTasks])

  useEffect(() => {
    fetchTasks() // Re-fetch tasks when filters change
  }, [statusFilter, selectedPatientFilter, patientId]) // Include patientId in dependency array

  useEffect(() => {
    fetchPatients() // Fetch patients once for the filter dropdown
  }, [])

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
      },
      {
        accessorKey: "patientName",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Patient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.patientName || "N/A"}</div>,
        enableHiding: !!patientId, // Hide if already filtered by patient prop
      },
      {
        accessorKey: "assignedToName",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Assigned To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.assignedToName || "Unassigned"}</div>,
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const priority = row.getValue("priority") as Task["priority"]
          let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
          if (priority === "high" || priority === "urgent") variant = "destructive"
          if (priority === "medium") variant = "default"
          return <Badge variant={variant}>{priority}</Badge>
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as Task["status"]
          let variant: "default" | "secondary" | "outline" = "outline"
          if (status === "done") variant = "default"
          if (status === "in-progress") variant = "secondary"
          return <Badge variant={variant}>{status}</Badge>
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (row.original.dueDate ? format(new Date(row.original.dueDate), "PPP") : "N/A"),
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = rowA.original.dueDate ? new Date(rowA.original.dueDate).getTime() : 0
          const dateB = rowB.original.dueDate ? new Date(rowB.original.dueDate).getTime() : 0
          return dateA - dateB
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const task = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTask(task)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setTaskToDeleteId(task.id)
                    setIsConfirmDeleteDialogOpen(true)
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [patientId], // Re-memoize columns if patientId prop changes
  )

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility: {
        patientName: !patientId, // Hide patientName column if patientId is provided as a prop
      },
    },
  })

  const handleTaskDeleted = async () => {
    const result = await deleteTaskAction(taskToDeleteId!)
    if (result.success) {
      toast({ title: "Success", description: "Task deleted successfully." })
      onTasksUpdated()
      fetchTasks() // Re-fetch tasks after deletion
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete task.", variant: "destructive" })
    }
    setIsConfirmDeleteDialogOpen(false)
    setTaskToDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search tasks..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          {!patientId && ( // Only show patient filter if not already filtered by patient prop
            <Select value={selectedPatientFilter} onValueChange={setSelectedPatientFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading tasks...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      <CreateTodoDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={() => {
          onTasksUpdated()
          fetchTasks() // Re-fetch tasks after creation
        }}
        defaultPatientId={patientId} // Pass default patient ID if available
      />
      {selectedTask && (
        <EditTodoDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onTaskUpdated={() => {
            onTasksUpdated()
            fetchTasks() // Re-fetch tasks after update
          }}
          task={selectedTask}
        />
      )}
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleTaskDeleted}
      />
    </div>
  )
}
