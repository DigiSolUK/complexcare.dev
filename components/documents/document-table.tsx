"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Download,
  FileEdit,
  Trash2,
  FileIcon as FilePdf,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
} from "lucide-react"

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

type Document = {
  id: string
  filename: string
  originalFilename: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  relatedToType: "patient" | "care_professional" | "organization" | "policy" | "template"
  relatedToName: string
  isPublic: boolean
}

const documents: Document[] = [
  {
    id: "D001",
    filename: "patient-care-plan-john-doe.pdf",
    originalFilename: "John Doe Care Plan.pdf",
    fileType: "application/pdf",
    fileSize: 2500000,
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: "2023-05-15T10:30:00Z",
    relatedToType: "patient",
    relatedToName: "John Doe",
    isPublic: false,
  },
  {
    id: "D002",
    filename: "medication-chart-jane-smith.xlsx",
    originalFilename: "Jane Smith Medication Chart.xlsx",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSize: 1200000,
    uploadedBy: "Nurse Williams",
    uploadedAt: "2023-05-16T09:15:00Z",
    relatedToType: "patient",
    relatedToName: "Jane Smith",
    isPublic: false,
  },
  {
    id: "D003",
    filename: "staff-handbook-2023.pdf",
    originalFilename: "Staff Handbook 2023.pdf",
    fileType: "application/pdf",
    fileSize: 5600000,
    uploadedBy: "Admin User",
    uploadedAt: "2023-04-01T14:45:00Z",
    relatedToType: "organization",
    relatedToName: "ComplexCare Organization",
    isPublic: true,
  },
  {
    id: "D004",
    filename: "infection-control-policy.docx",
    originalFilename: "Infection Control Policy.docx",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 1800000,
    uploadedBy: "Admin User",
    uploadedAt: "2023-03-12T11:20:00Z",
    relatedToType: "policy",
    relatedToName: "Clinical Policies",
    isPublic: true,
  },
  {
    id: "D005",
    filename: "assessment-template.docx",
    originalFilename: "Initial Assessment Template.docx",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 950000,
    uploadedBy: "Dr. James Wilson",
    uploadedAt: "2023-02-25T16:30:00Z",
    relatedToType: "template",
    relatedToName: "Assessment Templates",
    isPublic: true,
  },
]

interface DocumentTableProps {
  filter?: "patient" | "care_professional" | "organization" | "policy" | "template"
}

export function DocumentTable({ filter }: DocumentTableProps) {
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

  // Filter documents based on the prop
  const filteredDocuments = filter ? documents.filter((doc) => doc.relatedToType === filter) : documents

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Document]
    const bValue = b[sortColumn as keyof Document]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FilePdf className="h-4 w-4 text-red-500" />
    if (fileType.includes("spreadsheet")) return <FileSpreadsheet className="h-4 w-4 text-green-500" />
    if (fileType.includes("word")) return <FileText className="h-4 w-4 text-blue-500" />
    if (fileType.includes("image")) return <FileImage className="h-4 w-4 text-purple-500" />
    return <File className="h-4 w-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("filename")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Filename</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Related To</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("uploadedAt")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Uploaded</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDocuments.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(document.fileType)}
                  <span className="font-medium truncate max-w-[280px]" title={document.originalFilename}>
                    {document.originalFilename}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    document.relatedToType === "patient"
                      ? "default"
                      : document.relatedToType === "organization"
                        ? "secondary"
                        : document.relatedToType === "policy"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {document.relatedToName}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs">{document.uploadedBy}</span>
                </div>
              </TableCell>
              <TableCell>{formatFileSize(document.fileSize)}</TableCell>
              <TableCell>
                {document.fileType.includes("pdf")
                  ? "PDF"
                  : document.fileType.includes("spreadsheet")
                    ? "Spreadsheet"
                    : document.fileType.includes("word")
                      ? "Document"
                      : document.fileType.includes("image")
                        ? "Image"
                        : "File"}
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
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
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
