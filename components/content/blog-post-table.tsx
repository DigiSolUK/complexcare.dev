"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, Globe, Clock } from "lucide-react"

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

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  status: "published" | "draft" | "scheduled" | "archived"
  publishDate: string | null
  createdDate: string
  category: string
  tags: string[]
  featuredImage: string | null
}

const blogPosts: BlogPost[] = [
  {
    id: "BP001",
    title: "The Benefits of Complex Care at Home",
    slug: "benefits-of-complex-care-at-home",
    excerpt: "Discover how in-home complex care services can improve patient outcomes and quality of life...",
    author: "Dr. Sarah Johnson",
    status: "published",
    publishDate: "2023-05-15",
    createdDate: "2023-05-10",
    category: "Patient Care",
    tags: ["home care", "patient outcomes", "quality of life"],
    featuredImage: "complex-care-at-home.jpg",
  },
  {
    id: "BP002",
    title: "Understanding Medication Management for Chronic Conditions",
    slug: "understanding-medication-management-chronic-conditions",
    excerpt: "A comprehensive guide to managing medications for patients with multiple chronic conditions...",
    author: "Nurse Williams",
    status: "published",
    publishDate: "2023-05-05",
    createdDate: "2023-04-25",
    category: "Medication",
    tags: ["medication management", "chronic conditions", "patient safety"],
    featuredImage: "medication-management.jpg",
  },
  {
    id: "BP003",
    title: "The Role of Technology in Modern Healthcare",
    slug: "role-of-technology-in-modern-healthcare",
    excerpt: "How technology is transforming the delivery of healthcare services and improving patient outcomes...",
    author: "Dr. Michael Chen",
    status: "draft",
    publishDate: null,
    createdDate: "2023-05-20",
    category: "Technology",
    tags: ["healthcare technology", "telehealth", "digital health"],
    featuredImage: "healthcare-technology.jpg",
  },
  {
    id: "BP004",
    title: "Mental Health Support for Caregivers",
    slug: "mental-health-support-for-caregivers",
    excerpt: "Tips and resources for caregivers to maintain their mental wellbeing while caring for others...",
    author: "Dr. Emily Williams",
    status: "scheduled",
    publishDate: "2023-06-10",
    createdDate: "2023-05-18",
    category: "Caregiver Support",
    tags: ["mental health", "caregiver support", "self-care"],
    featuredImage: "caregiver-support.jpg",
  },
  {
    id: "BP005",
    title: "Advances in Palliative Care Practices",
    slug: "advances-in-palliative-care-practices",
    excerpt: "Recent developments in palliative care that are improving comfort and dignity for patients...",
    author: "Dr. James Wilson",
    status: "archived",
    publishDate: "2023-02-10",
    createdDate: "2023-02-01",
    category: "Palliative Care",
    tags: ["palliative care", "patient comfort", "end of life care"],
    featuredImage: null,
  },
]

export function BlogPostTable() {
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

  const sortedBlogPosts = [...blogPosts].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof BlogPost]
    const bValue = b[sortColumn as keyof BlogPost]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: BlogPost["status"]) => {
    switch (status) {
      case "published":
        return <Globe className="h-4 w-4 text-green-500" />
      case "draft":
        return <FileEdit className="h-4 w-4 text-blue-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "archived":
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: BlogPost["status"]) => {
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
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Scheduled
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
            <TableHead className="w-[350px]">
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
                onClick={() => handleSort("author")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Author</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("publishDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBlogPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="font-medium">{post.title}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[300px]">{post.excerpt}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.author}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{post.category}</Badge>
              </TableCell>
              <TableCell>
                {post.publishDate ? (
                  new Date(post.publishDate).toLocaleDateString()
                ) : (
                  <span className="text-muted-foreground text-xs">Not published</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(post.status)}
                  {getStatusBadge(post.status)}
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
                      <span>View Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Post</span>
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
