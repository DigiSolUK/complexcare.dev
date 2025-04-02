import { type NextRequest, NextResponse } from "next/server"
import { getInvoices, createInvoice, getNextInvoiceNumber } from "@/lib/services/invoice-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Set a flag for demo mode
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    let tenantId = "demo-tenant"

    if (!demoMode) {
      try {
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        tenantId = user.tenant_id
      } catch (authError) {
        console.error("Authentication error:", authError)
        // Fall back to demo mode if authentication fails
        console.log("Authentication failed, using demo data")
      }
    }

    try {
      const invoices = await getInvoices(tenantId)
      return NextResponse.json(invoices)
    } catch (error) {
      console.error("Error in GET /api/invoices:", error)
      return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in GET /api/invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      data.invoiceNumber = await getNextInvoiceNumber(user.tenant_id)
    }

    const invoice = await createInvoice(
      user.tenant_id,
      data.patientId,
      data.amount,
      data.dueDate,
      data.invoiceNumber,
      data.description,
      data.status || "draft",
      data.items || [],
    )

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/invoices:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

