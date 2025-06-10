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
import { format } from "date-fns"
import { ArrowUpDown, PlusCircle, MoreHorizontal, Eye, FileEdit, Trash2 } from "lucide-react"

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
import { CreateClinicalNoteDialog } from "./create-clinical-note-dialog"
import { EditClinicalNoteDialog } from "./edit-clinical-note-dialog"
import { ViewClinicalNoteDialog } from "./view-clinical-note-dialog"
import { deleteClinicalNote } from "@/lib/actions/clinical-notes-actions"
import type { ClinicalNote } from "@/types"

interface ClinicalNotesListProps {
  initialNotes: ClinicalNote[]
  onNotesUpdated: () => void
  patientId?: string // Optional patientId for filtering
  defaultPatientId?: string // For creating new notes
  defaultPatientName?: string // For creating new notes
}

export default function ClinicalNotesList({
  initialNotes,
  onNotesUpdated,
  patientId,
  defaultPatientId,
  defaultPatientName,
}: ClinicalNotesListProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<ClinicalNote[]>(initialNotes)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  const columns: ColumnDef<ClinicalNote>[] = useMemo(
    () => [
      {
        accessorKey: "noteDate",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => format(new Date(row.original.noteDate), "PPP"),
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.original.noteDate).getTime()
          const dateB = new Date(rowB.original.noteDate).getTime()
          return dateA - dateB
        },
      },
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
        enableHiding: !!patientId, // Hide if already filtered by patient
      },
      {
        accessorKey: "careProfessionalName",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Care Professional
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.careProfessionalName || "N/A"}</div>,
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        cell: ({ row }) => <div>{row.original.categoryName || "N/A"}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const note = row.original
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
                    setSelectedNote(note)
                    setIsViewDialogOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedNote(note)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setNoteToDeleteId(note.id)
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
    [patientId],
  )

  const table = useReactTable({
    data: notes,
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
        patientName: !patientId, // Hide patientName column if patientId is provided
      },
    },
  })

  const handleNoteDeleted = async () => {
    const result = await deleteClinicalNote(noteToDeleteId!)
    if (result.success) {
      toast({ title: "Success", description: "Clinical note deleted successfully." })
      onNotesUpdated()
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete clinical note.", variant: "destructive" })
    }
    setIsConfirmDeleteDialogOpen(false)
    setNoteToDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search notes..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Note
        </Button>
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
                  No clinical notes found.
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

      <CreateClinicalNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onNoteCreated={onNotesUpdated}
        defaultPatientId={defaultPatientId}
        defaultPatientName={defaultPatientName}
      />
      {selectedNote && (
        <>
          <EditClinicalNoteDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onNoteUpdated={onNotesUpdated}
            note={selectedNote}
          />
          <ViewClinicalNoteDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} note={selectedNote} />
        </>
      )}
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this clinical note? This action cannot be undone."
        onConfirm={handleNoteDeleted}
      />
    </div>
  )
}
