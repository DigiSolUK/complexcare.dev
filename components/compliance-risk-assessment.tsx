import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, AlertTriangle, FileText, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Demo data for risk assessments
const demoRiskAssessments = [
  {
    id: "RA001",
    title: "Patient Falls Risk Assessment",
    category: "Clinical",
    riskLevel: "High",
    lastAssessed: "10/05/2023",
    nextAssessment: "10/08/2023",
    status: "Active",
    mitigationStatus: "In Progress",
  },
  {
    id: "RA002",
    title: "Medication Error Risk Assessment",
    category: "Clinical",
    riskLevel: "High",
    lastAssessed: "22/04/2023",
    nextAssessment: "22/07/2023",
    status: "Active",
    mitigationStatus: "Completed",
  },
  {
    id: "RA003",
    title: "Data Breach Risk Assessment",
    category: "Information Governance",
    riskLevel: "Medium",
    lastAssessed: "15/03/2023",
    nextAssessment: "15/06/2023",
    status: "Review Due",
    mitigationStatus: "In Progress",
  },
  {
    id: "RA004",
    title: "Staff Safety Risk Assessment",
    category: "Health & Safety",
    riskLevel: "Medium",
    lastAssessed: "05/05/2023",
    nextAssessment: "05/08/2023",
    status: "Active",
    mitigationStatus: "Completed",
  },
  {
    id: "RA005",
    title: "Infection Control Risk Assessment",
    category: "Clinical",
    riskLevel: "High",
    lastAssessed: "01/06/2023",
    nextAssessment: "01/09/2023",
    status: "Active",
    mitigationStatus: "In Progress",
  },
  {
    id: "RA006",
    title: "Fire Safety Risk Assessment",
    category: "Health & Safety",
    riskLevel: "Medium",
    lastAssessed: "12/02/2023",
    nextAssessment: "12/05/2023",
    status: "Overdue",
    mitigationStatus: "Not Started",
  },
  {
    id: "RA007",
    title: "Patient Record Security Assessment",
    category: "Information Governance",
    riskLevel: "Low",
    lastAssessed: "20/05/2023",
    nextAssessment: "20/08/2023",
    status: "Active",
    mitigationStatus: "Completed",
  },
]

export function ComplianceRiskAssessment() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Risk Assessments</CardTitle>
          <CardDescription>Manage and track organizational risk assessments</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Risk Assessment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search risk assessments..." className="max-w-sm" />
          <Button variant="outline">Filter</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Last Assessed</TableHead>
                <TableHead>Next Assessment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mitigation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoRiskAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.id}</TableCell>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell>{assessment.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.riskLevel === "High"
                          ? "destructive"
                          : assessment.riskLevel === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {assessment.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.lastAssessed}</TableCell>
                  <TableCell>{assessment.nextAssessment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.status === "Active"
                          ? "outline"
                          : assessment.status === "Review Due"
                            ? "default"
                            : assessment.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.mitigationStatus === "Completed"
                          ? "outline"
                          : assessment.mitigationStatus === "In Progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {assessment.mitigationStatus}
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
                          View Assessment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Update Risk Level
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Update Mitigation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Assessment</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Review</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive Assessment</DropdownMenuItem>
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

