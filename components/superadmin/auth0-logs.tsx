"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { getAuth0Logs } from "@/lib/actions/auth0-actions"

interface Auth0Log {
  _id: string
  date: string
  type: string
  description: string
  client_id: string
  client_name: string
  ip: string
  user_id: string
  user_name: string
  details?: any
}

interface Auth0LogsProps {
  initialLogs: Auth0Log[]
  totalLogs: number
  page: number
  perPage: number
}

export function Auth0Logs({ initialLogs, totalLogs, page, perPage }: Auth0LogsProps) {
  const router = useRouter()
  const [logs, setLogs] = useState<Auth0Log[]>(initialLogs)
  const [isLoading, setIsLoading] = useState(false)

  const totalPages = Math.ceil(totalLogs / perPage)

  const handlePageChange = (newPage: number) => {
    router.push(`/superadmin/auth0/logs?page=${newPage}`)
  }

  const refreshLogs = async () => {
    setIsLoading(true)
    try {
      const response = await getAuth0Logs(page - 1, perPage)
      setLogs(response.logs)
    } catch (error) {
      console.error("Error refreshing logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getLogTypeColor = (type: string) => {
    if (type.includes("failed") || type.includes("error")) {
      return "destructive"
    }
    if (type.includes("success")) {
      return "success"
    }
    return "default"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Auth0 Audit Logs</h3>
        <Button onClick={refreshLogs} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{formatDate(log.date)}</TableCell>
                <TableCell>
                  <Badge variant={getLogTypeColor(log.type)}>{log.type}</Badge>
                </TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.user_name || log.user_id || "N/A"}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>{log.client_name || log.client_id || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
