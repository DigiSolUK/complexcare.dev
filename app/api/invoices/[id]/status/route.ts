import { type NextRequest, NextResponse } from "next/server"
import { updateInvoiceStatus } from "@/lib/services/invoice-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { status, paidDate } = data

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const invoice = await updateInvoiceStatus(user.tenant_id, params.id, status, paidDate)

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error in PATCH /api/invoices/[id]/status:", error)
    return NextResponse.json({ error: "Failed to update invoice status" }, { status: 500 })
  }
}

