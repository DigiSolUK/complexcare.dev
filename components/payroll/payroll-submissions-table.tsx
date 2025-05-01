"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CreatePayrollSubmissionDialog } from "./create-payroll-submission-dialog"

type PayrollSubmission = {
  id: string
  provider_id: string
  provider_name: string
  submission_date: string
  pay_period_start: string
  pay_period_end: string
  status: "draft" | "submitted" | "processed" | "error"
  error_message?: string
  created_at: string
}

interface PayrollSubmissionsTableProps {
  tenantId: string
}

export function PayrollSubmissionsTable({ tenantId }: PayrollSubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<PayrollSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubmissions()
  }, [tenantId])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/payroll-submissions?tenantId=${tenantId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch payroll submissions")
      }
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (err) {
      setError("Error loading payroll submissions. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
      case "processed":
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading payroll submissions...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreatePayrollSubmissionDialog tenantId={tenantId} onSubmit={fetchSubmissions} />
      </div>

      {submissions.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No payroll submissions found. Create a new submission to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Pay Period</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.provider_name}</TableCell>
                <TableCell>
                  {new Date(submission.pay_period_start).toLocaleDateString()} -{" "}
                  {new Date(submission.pay_period_end).toLocaleDateString()}
                </TableCell>
                <TableCell>{new Date(submission.submission_date).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/payroll/submissions/${submission.id}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Download started",
                          description: "Your payroll submission data is being downloaded.",
                        })
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
