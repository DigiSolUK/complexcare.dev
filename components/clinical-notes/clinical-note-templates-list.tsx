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
import { ArrowUpDown, PlusCircle, MoreHorizontal, FileEdit, Trash2, Eye } from "lucide-react"
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
import { CreateTemplateDialog } from "./create-template-dialog"
import { EditTemplateDialog } from "./edit-template-dialog"
import { ViewTemplateDialog } from "./view-template-dialog" // New component
import {
  getClinicalNoteTemplates,
  deleteClinicalNoteTemplate,
  getClinicalNoteCategories,
} from "@/lib/actions/clinical-notes-actions"
import type { ClinicalNoteTemplate, ClinicalNoteCategory } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClinicalNoteTemplatesListProps {
  onTemplatesUpdated: () => void
}

export default function ClinicalNoteTemplatesList({ onTemplatesUpdated }: ClinicalNoteTemplatesListProps) {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([])
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ClinicalNoteTemplate | null>(null)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null)

  const fetchTemplatesAndCategories = async () => {
    setLoading(true)
    try {
      const categoriesResult = await getClinicalNoteCategories()
      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data)
      } else {
        toast({
          title: "Error",
          description: categoriesResult.error || "Failed to load categories.",
          variant: "destructive",
        })
      }

      const templatesResult = await getClinicalNoteTemplates(categoryFilter === "all" ? undefined : categoryFilter)
      if (templatesResult.success && templatesResult.data) {
        setTemplates(templatesResult.data)
      } else {
        toast({
          title: "Error",
          description: templatesResult.error || "Failed to load templates.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching templates/categories:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading templates and categories.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplatesAndCategories()
  }, [categoryFilter]) // Re-fetch when category filter changes

  const columns: ColumnDef<ClinicalNoteTemplate>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        cell: ({ row }) => <div>{row.original.categoryName || "N/A"}</div>,
      },
      {
        accessorKey: "content",
        header: "Content Preview",
        cell: ({ row }) => <div className="text-muted-foreground line-clamp-2">{row.getValue("content")}</div>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.original.createdAt).getTime()
          const dateB = new Date(rowB.original.createdAt).getTime()
          return dateA - dateB
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const template = row.original
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
                    setSelectedTemplate(template)
                    setIsViewDialogOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTemplate(template)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setTemplateToDeleteId(template.id)
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
    [categories],
  )

  const table = useReactTable({
    data: templates,
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
    },
  })

  const handleTemplateDeleted = async () => {
    const result = await deleteClinicalNoteTemplate(templateToDeleteId!)
    if (result.success) {
      toast({ title: "Success", description: "Template deleted successfully." })
      fetchTemplatesAndCategories()
      onTemplatesUpdated()
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete template.", variant: "destructive" })
    }
    setIsConfirmDeleteDialogOpen(false)
    setTemplateToDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search templates..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Template
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
                  Loading templates...
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
                  No templates found.
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

      <CreateTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTemplateCreated={fetchTemplatesAndCategories}
        categories={categories}
      />
      {selectedTemplate && (
        <>
          <EditTemplateDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onTemplateUpdated={fetchTemplatesAndCategories}
            template={selectedTemplate}
            categories={categories}
          />
          <ViewTemplateDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} template={selectedTemplate} />
        </>
      )}
      <ConfirmDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this template? This action cannot be undone."
        onConfirm={handleTemplateDeleted}
      />
    </div>
  )
}
