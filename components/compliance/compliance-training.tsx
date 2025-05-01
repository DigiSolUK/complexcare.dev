import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, MoreHorizontal, Play, Award, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Demo data for training modules
const demoTrainingModules = [
  {
    id: "TRN001",
    title: "Data Protection and GDPR",
    category: "Information Governance",
    duration: "45 mins",
    completionRate: 92,
    dueDate: "30/06/2023",
    status: "Active",
  },
  {
    id: "TRN002",
    title: "Medication Administration",
    category: "Clinical",
    duration: "60 mins",
    completionRate: 78,
    dueDate: "15/07/2023",
    status: "Active",
  },
  {
    id: "TRN003",
    title: "Health and Safety Essentials",
    category: "Health & Safety",
    duration: "90 mins",
    completionRate: 85,
    dueDate: "22/06/2023",
    status: "Active",
  },
  {
    id: "TRN004",
    title: "Safeguarding Adults",
    category: "Safeguarding",
    duration: "120 mins",
    completionRate: 95,
    dueDate: "10/07/2023",
    status: "Active",
  },
  {
    id: "TRN005",
    title: "Infection Control Procedures",
    category: "Clinical",
    duration: "75 mins",
    completionRate: 88,
    dueDate: "05/07/2023",
    status: "Active",
  },
  {
    id: "TRN006",
    title: "Fire Safety",
    category: "Health & Safety",
    duration: "30 mins",
    completionRate: 100,
    dueDate: "01/06/2023",
    status: "Completed",
  },
  {
    id: "TRN007",
    title: "Manual Handling",
    category: "Health & Safety",
    duration: "60 mins",
    completionRate: 72,
    dueDate: "18/07/2023",
    status: "Active",
  },
]

export function ComplianceTraining() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Training Modules</CardTitle>
          <CardDescription>Manage and track staff training compliance</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Training Module
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search training modules..." className="max-w-sm" />
          <Button variant="outline">Filter</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoTrainingModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>{module.id}</TableCell>
                  <TableCell className="font-medium">{module.title}</TableCell>
                  <TableCell>{module.category}</TableCell>
                  <TableCell>{module.duration}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={module.completionRate} className="h-2 w-[100px]" />
                      <span className="text-sm">{module.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{module.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        module.status === "Active" ? "outline" : module.status === "Completed" ? "default" : "secondary"
                      }
                    >
                      {module.status}
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
                          <Play className="mr-2 h-4 w-4" />
                          Start Training
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Award className="mr-2 h-4 w-4" />
                          View Completions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Module</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Staff</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive Module</DropdownMenuItem>
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
