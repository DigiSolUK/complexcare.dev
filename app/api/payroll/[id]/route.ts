import { type NextRequest, NextResponse } from "next/server"
import {
  getPayroll,
  updatePayroll,
  deletePayroll,
  processPayroll,
  markPayrollAsPaid,
} from "@/lib/services/payroll-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { payroll, error } = await getPayroll(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!payroll) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 })
    }

    return NextResponse.json({ payroll })
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, ...payrollData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { payroll, error } = await updatePayroll(tenantId, id, payrollData)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ payroll })
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { success, error } = await deletePayroll(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, action, paymentReference, paymentDate } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    let result
    if (action === "process") {
      result = await processPayroll(tenantId, id)
    } else if (action === "markAsPaid") {
      if (!paymentReference || !paymentDate) {
        return NextResponse.json(
          {
            error: "Payment reference and payment date are required",
          },
          { status: 400 },
        )
      }
      result = await markPayrollAsPaid(tenantId, id, paymentReference, paymentDate)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ payroll: result.payroll })
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

