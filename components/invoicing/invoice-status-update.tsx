"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Invoice {
  id: string
  status: string
}

interface InvoiceStatusUpdateProps {
  invoice: Invoice
  onStatusChange: (status: string) => Promise<void>
}

export function InvoiceStatusUpdate({ invoice, onStatusChange }: InvoiceStatusUpdateProps) {
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(invoice.status)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setLoading(true)
    try {
      await onStatusChange(newStatus)
      setCurrentStatus(newStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Current Status:</span>
        <Badge className={`${getStatusColor(currentStatus)} capitalize`}>{currentStatus}</Badge>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-2">Update status:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading || currentStatus === "draft"}
            onClick={() => handleStatusChange("draft")}
            className={currentStatus === "draft" ? "border-2 border-primary" : ""}
          >
            Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || currentStatus === "pending"}
            onClick={() => handleStatusChange("pending")}
            className={currentStatus === "pending" ? "border-2 border-primary" : ""}
          >
            Pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || currentStatus === "paid"}
            onClick={() => handleStatusChange("paid")}
            className={currentStatus === "paid" ? "border-2 border-primary" : ""}
          >
            Paid
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || currentStatus === "overdue"}
            onClick={() => handleStatusChange("overdue")}
            className={currentStatus === "overdue" ? "border-2 border-primary" : ""}
          >
            Overdue
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
