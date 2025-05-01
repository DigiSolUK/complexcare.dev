"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type PayrollProvider = {
  id: string
  name: string
  type: string
  status: string
  [key: string]: any
}

interface PayrollProviderTableProps {
  providers?: PayrollProvider[]
}

export function PayrollProviderTable({ providers = [] }: PayrollProviderTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider Name</TableHead>
            <TableHead>Provider Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {isLoading ? "Loading providers..." : "No payroll providers found."}
              </TableCell>
            </TableRow>
          ) : (
            providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>{provider.type}</TableCell>
                <TableCell>
                  <Badge variant={provider.status === "active" ? "success" : "secondary"}>{provider.status}</Badge>
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
