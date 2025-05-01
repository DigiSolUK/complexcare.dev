import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Payment {
  id: string
  date: string
  amount: number
  method: string
  reference: string
}

interface Invoice {
  id: string
  status: string
  payments?: Payment[]
}

export function InvoicePaymentHistory({ invoice }: { invoice: Invoice }) {
  const payments = invoice.payments || []

  return (
    <div>
      {payments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          {invoice.status === "paid" ? (
            <p>Payment information not available</p>
          ) : (
            <p>No payments have been recorded for this invoice</p>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.date), "PPP")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {payment.method}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                <TableCell className="text-right">£{payment.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
