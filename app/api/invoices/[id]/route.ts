import { type NextRequest, NextResponse } from "next/server"
import { getInvoiceById } from "@/lib/services/invoice-service"
import { getCurrentUser } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoice = await getInvoiceById(user.tenant_id, params.id)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error in GET /api/invoices/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if invoice exists and belongs to tenant
    const invoice = await getInvoiceById(user.tenant_id, params.id)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Only allow deletion of draft invoices
    if (invoice.status !== "draft") {
      return NextResponse.json({ error: "Only draft invoices can be deleted" }, { status: 400 })
    }

    // Start a transaction
    await sql`BEGIN`

    try {
      // Delete invoice items first
      await sql`
        DELETE FROM invoice_items
        WHERE tenant_id = ${user.tenant_id} AND invoice_id = ${params.id}
      `

      // Delete the invoice
      await sql`
        DELETE FROM invoices
        WHERE tenant_id = ${user.tenant_id} AND id = ${params.id}
      `

      // Commit the transaction
      await sql`COMMIT`

      return NextResponse.json({ success: true })
    } catch (error) {
      // Rollback the transaction on error
      await sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("Error in DELETE /api/invoices/[id]:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}

