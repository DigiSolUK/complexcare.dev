import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileText, Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Demo data for compliance policies
const demoPolicies = [
  {
    id: "POL001",
    title: "Data Protection Policy",
    category: "Information Governance",
    version: "2.3",
    lastReviewed: "15/03/2023",
    nextReview: "15/03/2024",
    status: "Active",
  },
  {
    id: "POL002",
    title: "Medication Administration Policy",
    category: "Clinical",
    version: "3.1",
    lastReviewed: "22/01/2023",
    nextReview: "22/01/2024",
    status: "Active",
  },
  {
    id: "POL003",
    title: "Health and Safety Policy",
    category: "Health & Safety",
    version: "1.7",
    lastReviewed: "05/11/2022",
    nextReview: "05/11/2023",
    status: "Review Due",
  },
  {
    id: "POL004",
    title: "Safeguarding Adults Policy",
    category: "Safeguarding",
    version: "2.0",
    lastReviewed: "18/02/2023",
    nextReview: "18/02/2024",
    status: "Active",
  },
  {
    id: "POL005",
    title: "Infection Control Policy",
    category: "Clinical",
    version: "4.2",
    lastReviewed: "30/04/2023",
    nextReview: "30/04/2024",
    status: "Active",
  },
  {
    id: "POL006",
    title: "Complaints Handling Procedure",
    category: "Governance",
    version: "1.5",
    lastReviewed: "12/12/2022",
    nextReview: "12/12/2023",
    status: "Under Review",
  },
  {
    id: "POL007",
    title: "Staff Code of Conduct",
    category: "HR",
    version: "2.1",
    lastReviewed: "03/05/2023",
    nextReview: "03/05/2024",
    status: "Active",
  },
]

export function CompliancePolicies() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Compliance Policies</CardTitle>
          <CardDescription>Manage and track all compliance policies</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search policies..." className="max-w-sm" />
          <Button variant="outline">Filter</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Reviewed</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>{policy.id}</TableCell>
                  <TableCell className="font-medium">{policy.title}</TableCell>
                  <TableCell>{policy.category}</TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell>{policy.lastReviewed}</TableCell>
                  <TableCell>{policy.nextReview}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        policy.status === "Active"
                          ? "outline"
                          : policy.status === "Review Due"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Policy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Review</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive Policy</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

