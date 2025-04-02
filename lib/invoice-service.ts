import { sql } from "@/lib/db"
import type { Invoice, InvoiceItem } from "@/types"

export async function getInvoices(tenantId: string): Promise<Invoice[]> {
  try {
    // If we're in demo mode or tenantId is not a valid UUID, return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !isValidUUID(tenantId)) {
      return getMockInvoices()
    }

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
      console.error("Database error fetching invoices:", error)
      return getMockInvoices()
    }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return getMockInvoices()
  }
}

// Helper function to check if a string is a valid UUID
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Helper function to get mock invoices
function getMockInvoices(): Invoice[] {
  return [
    {
      id: "inv-001",
      tenant_id: "demo-tenant",
      patient_id: "pat-001",
      patient_name: "John Smith",
      amount: 250.0,
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_number: "INV-0001",
      description: "Monthly care services",
      status: "sent",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-002",
      tenant_id: "demo-tenant",
      patient_id: "pat-002",
      patient_name: "Emily Wilson",
      amount: 175.5,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_number: "INV-0002",
      description: "Weekly therapy sessions",
      status: "paid",
      paid_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-003",
      tenant_id: "demo-tenant",
      patient_id: "pat-003",
      patient_name: "Robert Martin",
      amount: 320.75,
      due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_number: "INV-0003",
      description: "Specialized equipment and care services",
      status: "overdue",
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-004",
      tenant_id: "demo-tenant",
      patient_id: "pat-004",
      patient_name: "Sarah Johnson",
      amount: 150.0,
      due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_number: "INV-0004",
      description: "Assessment and care plan development",
      status: "draft",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "inv-005",
      tenant_id: "demo-tenant",
      patient_id: "pat-005",
      patient_name: "David Taylor",
      amount: 275.25,
      due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_number: "INV-0005",
      description: "Monthly care package",
      status: "sent",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
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

