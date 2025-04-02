"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, Globe, Clock, Lock } from "lucide-react"

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

type PageContent = {
  id: string
  title: string
  slug: string
  status: "published" | "draft" | "archived"
  lastUpdated: string
  isHomepage: boolean
  isProtected: boolean
  template: string
  type: "standard" | "landing" | "form" | "redirect"
}

const pageContents: PageContent[] = [
  {
    id: "PG001",
    title: "Home",
    slug: "/",
    status: "published",
    lastUpdated: "2023-05-20",
    isHomepage: true,
    isProtected: false,
    template: "Home",
    type: "landing",
  },
  {
    id: "PG002",
    title: "About Us",
    slug: "/about",
    status: "published",
    lastUpdated: "2023-05-15",
    isHomepage: false,
    isProtected: false,
    template: "Standard",
    type: "standard",
  },
  {
    id: "PG003",
    title: "Services",
    slug: "/services",
    status: "published",
    lastUpdated: "2023-05-10",
    isHomepage: false,
    isProtected: false,
    template: "Services",
    type: "standard",
  },
  {
    id: "PG004",
    title: "Contact Us",
    slug: "/contact",
    status: "published",
    lastUpdated: "2023-05-12",
    isHomepage: false,
    isProtected: false,
    template: "Contact",
    type: "form",
  },
  {
    id: "PG005",
    title: "Staff Portal",
    slug: "/staff-portal",
    status: "draft",
    lastUpdated: "2023-05-22",
    isHomepage: false,
    isProtected: true,
    template: "Portal",
    type: "standard",
  },
]

export function PageContentTable() {
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

  const sortedPageContents = [...pageContents].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof PageContent]
    const bValue = b[sortColumn as keyof PageContent]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: PageContent["status"]) => {
    switch (status) {
      case "published":
        return <Globe className="h-4 w-4 text-green-500" />
      case "draft":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "archived":
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: PageContent["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Draft
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Archived
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Title</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("slug")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>URL</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("lastUpdated")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Last Updated</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPageContents.map((page) => (
            <TableRow key={page.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="font-medium truncate max-w-[200px]">{page.title}</div>
                  {page.isHomepage && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Home
                    </Badge>
                  )}
                  {page.isProtected && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">{page.slug}</TableCell>
              <TableCell>
                <Badge variant="outline">{page.type.charAt(0).toUpperCase() + page.type.slice(1)}</Badge>
              </TableCell>
              <TableCell>{new Date(page.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(page.status)}
                  {getStatusBadge(page.status)}
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
                      <span>View Page</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Page</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Page</span>
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

