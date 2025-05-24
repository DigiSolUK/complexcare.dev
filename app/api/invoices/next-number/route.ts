import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentTenant } from "@/lib/tenant"

export async function GET() {
  try {
    const tenant = await getCurrentTenant()

    if (!tenant || !tenant.id) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const result = await sql`
      SELECT invoice_number FROM invoices
      WHERE tenant_id = ${tenant.id}
      ORDER BY created_at DESC
      LIMIT 1
    `

    let nextNumber = "INV-0001"

    if (result.rows.length > 0) {
      const lastInvoiceNumber = result.rows[0].invoice_number
      const matches = lastInvoiceNumber.match(/INV-(\d+)/)

      if (matches && matches.length >= 2) {
        const lastNumber = Number.parseInt(matches[1], 10)
        const nextNum = lastNumber + 1
        nextNumber = `INV-${nextNum.toString().padStart(4, "0")}`
      }
    }

    return NextResponse.json({ invoiceNumber: nextNumber })
  } catch (error) {
    console.error("Error generating next invoice number:", error)
    return NextResponse.json({ error: "Failed to generate invoice number" }, { status: 500 })
  }
}
