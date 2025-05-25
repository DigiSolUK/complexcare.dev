"use client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronRight, XCircle } from "lucide-react"
import type { ErrorLog } from "@/lib/services/error-logs-service"
import { formatDistanceToNow } from "date-fns"

interface ErrorLogsTableProps {
  logs: ErrorLog[]
  onResolve: (id: string) => void
}

export function ErrorLogsTable({ logs, onResolve }: ErrorLogsTableProps) {
  const router = useRouter()

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "authentication":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            Auth
          </Badge>
        )
      case "database":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Database
          </Badge>
        )
      case "api":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            API
          </Badge>
        )
      case "ui":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            UI
          </Badge>
        )
      case "integration":
        return (
          <Badge variant="outline" className="border-indigo-500 text-indigo-700">
            Integration
          </Badge>
        )
      case "validation":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Validation
          </Badge>
        )
      case "system":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            System
          </Badge>
        )
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/admin/error-logs/${id}`)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Severity</TableHead>
            <TableHead className="w-[100px]">Category</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="w-[150px]">Time</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No error logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center">
                    {getSeverityIcon(log.severity)}
                    <span className="ml-2">{getSeverityBadge(log.severity)}</span>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(log.category)}</TableCell>
                <TableCell className="font-mono text-xs truncate max-w-[300px]">{log.error_message}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</TableCell>
                <TableCell>
                  {log.resolved ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" /> Open
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(log.id)}>
                      Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    {!log.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => onResolve(log.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
