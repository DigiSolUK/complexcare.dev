import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  client_email: string
  amount: number
  status: string
  issue_date: string
  due_date: string
}

export function InvoiceDetails({ invoice }: { invoice: Invoice }) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Invoice Number</h3>
          <p className="text-lg font-semibold">{invoice.invoice_number}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
          <Badge className={`${getStatusColor(invoice.status)} capitalize`}>{invoice.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
          <p className="font-semibold">{invoice.client_name}</p>
          <p className="text-sm text-muted-foreground">{invoice.client_email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
          <p className="text-lg font-semibold">£{Number.parseFloat(invoice.amount.toString()).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Issue Date</h3>
          <p>{format(new Date(invoice.issue_date), "PPP")}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
          <p
            className={
              new Date(invoice.due_date) < new Date() && invoice.status !== "paid" ? "text-red-600 font-medium" : ""
            }
          >
            {format(new Date(invoice.due_date), "PPP")}
            {new Date(invoice.due_date) < new Date() && invoice.status !== "paid" && " (Overdue)"}
          </p>
        </div>
      </div>
    </div>
  )
}
