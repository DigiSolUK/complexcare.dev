"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Mail, MoreHorizontal, Printer, Share2, FileEdit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Invoice {
  id: string
  invoice_number: string
  status: string
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter()

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading invoice ${invoice.invoice_number}`)
  }

  const handlePrint = () => {
    // In a real app, this would open the print dialog
    alert(`Printing invoice ${invoice.invoice_number}`)
  }

  const handleEmail = () => {
    // In a real app, this would send an email with the invoice
    alert(`Emailing invoice ${invoice.invoice_number}`)
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert(`Sharing invoice ${invoice.invoice_number}`)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      // In a real app, this would delete the invoice
      alert(`Deleting invoice ${invoice.invoice_number}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrint}>
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleEmail}>
        <Mail className="h-4 w-4" />
      </Button>
      <Button onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/invoicing/${invoice.id}/edit`)}>
            <FileEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
