import { sql } from "@/lib/db"
import type { Invoice, InvoiceItem } from "@/types"

export async function getInvoices(tenantId: string): Promise<Invoice[]> {
  try {
    const result = await sql`
      SELECT i.*, p.first_name, p.last_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = ${tenantId}
      ORDER BY i.created_at DESC
    `

    return result.rows.map((row) => ({
      ...row,
      patient_name: row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : "Unknown Patient",
    }))
  } catch (error) {
    console.error("Error fetching invoices:", error)
    throw new Error("Failed to fetch invoices")
  }
}

export async function getInvoiceById(tenantId: string, id: string): Promise<Invoice | null> {
  try {
    const result = await sql`
      SELECT i.*, p.first_name, p.last_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = ${tenantId} AND i.id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    const invoice = {
      ...result.rows[0],
      patient_name:
        result.rows[0].first_name && result.rows[0].last_name
          ? `${result.rows[0].first_name} ${result.rows[0].last_name}`
          : "Unknown Patient",
    }

    // Get invoice items
    const itemsResult = await sql`
      SELECT * FROM invoice_items
      WHERE tenant_id = ${tenantId} AND invoice_id = ${id}
      ORDER BY created_at ASC
    `

    invoice.items = itemsResult.rows

    return invoice
  } catch (error) {
    console.error("Error fetching invoice:", error)
    throw new Error("Failed to fetch invoice")
  }
}

export async function createInvoice(
  tenantId: string,
  patientId: string,
  amount: number,
  dueDate: string,
  invoiceNumber: string,
  description: string,
  status: string,
  items: Omit<InvoiceItem, "id" | "tenant_id" | "invoice_id" | "created_at" | "updated_at">[],
): Promise<Invoice> {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Create the invoice
    const result = await sql`
      INSERT INTO invoices (
        tenant_id, patient_id, amount, due_date, invoice_number, description, status
      )
      VALUES (
        ${tenantId}, ${patientId}, ${amount}, ${dueDate}, ${invoiceNumber}, ${description}, ${status}
      )
      RETURNING *
    `

    const newInvoice = result.rows[0]

    // Create invoice items
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO invoice_items (
            tenant_id, invoice_id, description, quantity, unit_price,
            tax_rate, tax_amount, discount_amount, total_amount
          )
          VALUES (
            ${tenantId}, ${newInvoice.id}, ${item.description}, ${item.quantity}, ${item.unit_price},
            ${item.tax_rate}, ${item.tax_amount}, ${item.discount_amount}, ${item.total_amount}
          )
        `
      }
    }

    // Commit the transaction
    await sql`COMMIT`

    // Get the complete invoice with items
    return (await getInvoiceById(tenantId, newInvoice.id)) as Invoice
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error creating invoice:", error)
    throw new Error("Failed to create invoice")
  }
}

export async function updateInvoiceStatus(
  tenantId: string,
  id: string,
  status: string,
  paidDate?: string,
): Promise<Invoice> {
  try {
    const updateFields: any = { status }

    if (status === "paid" && paidDate) {
      updateFields.paid_date = paidDate
    }

    await sql`
      UPDATE invoices
      SET 
        status = ${status},
        paid_date = ${paidDate || null},
        updated_at = NOW()
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    return (await getInvoiceById(tenantId, id)) as Invoice
  } catch (error) {
    console.error("Error updating invoice status:", error)
    throw new Error("Failed to update invoice status")
  }
}

export async function getNextInvoiceNumber(tenantId: string): Promise<string> {
  try {
    const result = await sql`
      SELECT invoice_number FROM invoices
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (result.rows.length === 0) {
      return "INV-0001"
    }

    const lastInvoiceNumber = result.rows[0].invoice_number
    const matches = lastInvoiceNumber.match(/INV-(\d+)/)

    if (!matches || matches.length < 2) {
      return "INV-0001"
    }

    const lastNumber = Number.parseInt(matches[1], 10)
    const nextNumber = lastNumber + 1

    return `INV-${nextNumber.toString().padStart(4, "0")}`
  } catch (error) {
    console.error("Error generating next invoice number:", error)
    throw new Error("Failed to generate next invoice number")
  }
}
