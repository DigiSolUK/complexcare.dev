import { type NextRequest, NextResponse } from "next/server"
import { getPayrollProviders, createPayrollProvider } from "@/lib/services/payroll-provider-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { providers, error } = await getPayrollProviders(tenantId)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error in payroll providers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, ...providerData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { provider, error } = await createPayrollProvider(tenantId, providerData)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ provider }, { status: 201 })
  } catch (error) {
    console.error("Error in payroll providers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

