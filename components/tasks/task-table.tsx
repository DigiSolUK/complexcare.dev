"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types"
import { format } from "date-fns"
import { CreateTodoDialog } from "./create-todo-dialog"
import { deleteTask, updateTask } from "@/lib/actions/task-actions"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog" // Assuming this component exists

interface TaskTableProps {
  data: Task[]
  onTaskUpdated: () => void
}

export function TaskTable({ data, onTaskUpdated }: TaskTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false)
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsConfirmDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      const result = await deleteTask(taskToDelete)
      if (result.success) {
        toast({ title: "Success", description: "Task deleted successfully." })
        onTaskUpdated()
      } else {
        toast({ title: "Error", description: result.error || "Failed to delete task.", variant: "destructive" })
      }
      setTaskToDelete(null)
      setIsConfirmDeleteDialogOpen(false)
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const result = await updateTask(taskId, { status: newStatus })
    if (result.success) {
      toast({ title: "Success", description: `Task status updated to ${newStatus}.` })
      onTaskUpdated()
    } else {
      toast({ title: "Error", description: result.error || "Failed to update task status.", variant: "destructive" })
    }
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "patientName", // New column for patient name
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Patient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.original.patientName || "N/A"}</div>,
    },
    {
      accessorKey: "assignedToName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Assigned To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.original.assignedToName || "Unassigned"}</div>,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.original.dueDate
        return <div>{date ? format(date, "PPP") : "N/A"}</div>
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as Task["priority"]
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
        if (priority === "high") variant = "destructive"
        if (priority === "medium") variant = "default"
        return <Badge variant={variant}>{priority}</Badge>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Task["status"]
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
        if (status === "completed") variant = "default"
        if (status === "overdue") variant = "destructive"
        return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>Copy task ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in_progress")}>
                Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                Mark Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClick(task.id)}>Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateDialogOpen(true)} className="ml-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
      <CreateTodoDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onTaskCreated={onTaskUpdated} />
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
