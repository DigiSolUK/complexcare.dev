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
      SELECT i.*, p.first_name, p.last_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.tenant_id = ${tenant.id}
      ORDER BY i.created_at DESC
    `

    // Transform the data to include patient name
    const invoices = result.rows.map((row) => ({
      ...row,
      patient_name: row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : "Unknown Patient",
    }))

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await getCurrentTenant()

    if (!tenant || !tenant.id) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const body = await request.json()
    const { patientId, amount, dueDate, invoiceNumber, description, status, items } = body

    // Start a transaction
    await sql`BEGIN`

    // Create the invoice
    const result = await sql`
      INSERT INTO invoices (
        tenant_id, patient_id, amount, due_date, invoice_number, description, status
      )
      VALUES (
        ${tenant.id}, ${patientId}, ${amount}, ${dueDate}, ${invoiceNumber}, ${description}, ${status}
      )
      RETURNING *
    `

    const newInvoice = result.rows[0]

    // Create invoice items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO invoice_items (
            tenant_id, invoice_id, description, quantity, unit_price,
            tax_rate, tax_amount, discount_amount, total_amount
          )
          VALUES (
            ${tenant.id}, ${newInvoice.id}, ${item.description}, ${item.quantity}, ${item.unit_price},
            ${item.tax_rate}, ${item.tax_amount}, ${item.discount_amount}, ${item.total_amount}
          )
        `
      }
    }

    // Commit the transaction
    await sql`COMMIT`

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
