import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Demo data for audit logs
const demoAuditLogs = [
  {
    id: "AL001",
    timestamp: "10/06/2023 09:15:22",
    user: "Sarah Johnson",
    action: "Policy Update",
    details: "Updated Data Protection Policy to version 2.3",
    category: "Policy Management",
    severity: "Normal",
  },
  {
    id: "AL002",
    timestamp: "09/06/2023 14:32:45",
    user: "Michael Brown",
    action: "Training Completion",
    details: "Completed Medication Administration training module",
    category: "Training",
    severity: "Low",
  },
  {
    id: "AL003",
    timestamp: "09/06/2023 11:05:17",
    user: "Jessica Lee",
    action: "Risk Assessment",
    details: "Created new Patient Falls Risk Assessment",
    category: "Risk Management",
    severity: "High",
  },
  {
    id: "AL004",
    timestamp: "08/06/2023 16:48:33",
    user: "David Taylor",
    action: "Document Access",
    details: "Accessed patient records for Patient ID: P004",
    category: "Information Access",
    severity: "Normal",
  },
  {
    id: "AL005",
    timestamp: "08/06/2023 10:22:19",
    user: "Emily Wilson",
    action: "Incident Report",
    details: "Submitted incident report for medication error",
    category: "Incident Management",
    severity: "High",
  },
  {
    id: "AL006",
    timestamp: "07/06/2023 15:37:52",
    user: "Robert Martin",
    action: "Policy Review",
    details: "Reviewed and approved Health and Safety Policy",
    category: "Policy Management",
    severity: "Normal",
  },
  {
    id: "AL007",
    timestamp: "07/06/2023 09:05:41",
    user: "Sarah Johnson",
    action: "User Permission",
    details: "Modified user permissions for Jessica Lee",
    category: "User Management",
    severity: "High",
  },
  {
    id: "AL008",
    timestamp: "06/06/2023 14:12:38",
    user: "Michael Brown",
    action: "Training Assignment",
    details: "Assigned Safeguarding Adults training to all clinical staff",
    category: "Training",
    severity: "Normal",
  },
  {
    id: "AL009",
    timestamp: "06/06/2023 11:30:15",
    user: "System",
    action: "Backup Completed",
    details: "Automated system backup completed successfully",
    category: "System",
    severity: "Low",
  },
  {
    id: "AL010",
    timestamp: "05/06/2023 16:45:27",
    user: "Jessica Lee",
    action: "Document Upload",
    details: "Uploaded updated Infection Control Procedures document",
    category: "Document Management",
    severity: "Normal",
  },
]

export function ComplianceAuditLog() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Track all compliance-related activities and changes</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search audit logs..." className="max-w-sm" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="policy">Policy Management</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="risk">Risk Management</SelectItem>
              <SelectItem value="access">Information Access</SelectItem>
              <SelectItem value="incident">Incident Management</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="max-w-md truncate">{log.details}</TableCell>
                  <TableCell>{log.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.severity === "High" ? "destructive" : log.severity === "Normal" ? "default" : "secondary"
                      }
                    >
                      {log.severity}
                    </Badge>
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

