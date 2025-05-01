import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export function InvoiceItemsTable({ items }: { items: InvoiceItem[] }) {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">£{item.unit_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">£{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Subtotal
                </TableCell>
                <TableCell className="text-right font-bold">£{calculateTotal().toFixed(2)}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
