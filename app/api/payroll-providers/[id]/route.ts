import { type NextRequest, NextResponse } from "next/server"
import {
  getPayrollProvider,
  updatePayrollProvider,
  deletePayrollProvider,
} from "@/lib/services/payroll-provider-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { provider, error } = await getPayrollProvider(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!provider) {
      return NextResponse.json({ error: "Payroll provider not found" }, { status: 404 })
    }

    return NextResponse.json({ provider })
  } catch (error) {
    console.error("Error in payroll provider API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, ...providerData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { provider, error } = await updatePayrollProvider(tenantId, id, providerData)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ provider })
  } catch (error) {
    console.error("Error in payroll provider API:", error)
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

    const { success, error } = await deletePayrollProvider(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error in payroll provider API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
