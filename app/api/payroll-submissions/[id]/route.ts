import { type NextRequest, NextResponse } from "next/server"
import { getPayrollSubmission } from "@/lib/services/payroll-provider-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { submission, error } = await getPayrollSubmission(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!submission) {
      return NextResponse.json({ error: "Payroll submission not found" }, { status: 404 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error("Error in payroll submission API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
