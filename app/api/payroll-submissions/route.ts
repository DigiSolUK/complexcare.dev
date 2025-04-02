import { type NextRequest, NextResponse } from "next/server"
import { getPayrollSubmissions, submitPayrollToProvider } from "@/lib/services/payroll-provider-service"
import { getPayrollsByUser } from "@/lib/services/payroll-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")
    const providerId = searchParams.get("providerId") || undefined

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { submissions, error } = await getPayrollSubmissions(tenantId, providerId as string | undefined)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error in payroll submissions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, providerId, payPeriodStart, payPeriodEnd, userIds } = body

    if (!tenantId || !providerId || !payPeriodStart || !payPeriodEnd) {
      return NextResponse.json(
        {
          error: "Tenant ID, provider ID, and pay period dates are required",
        },
        { status: 400 },
      )
    }

    // Collect payroll data for all specified users
    const payrollData = []

    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        const { payrolls } = await getPayrollsByUser(tenantId, userId)

        // Filter payrolls for the specified pay period
        const periodPayrolls = payrolls.filter(
          (p) => p.pay_period_start >= payPeriodStart && p.pay_period_end <= payPeriodEnd,
        )

        payrollData.push(...periodPayrolls)
      }
    } else {
      // If no specific users, get all payrolls for the period
      const { payrolls } = await getPayrollsByUser(tenantId, "")

      // Filter payrolls for the specified pay period
      const periodPayrolls = payrolls.filter(
        (p) => p.pay_period_start >= payPeriodStart && p.pay_period_end <= payPeriodEnd,
      )

      payrollData.push(...periodPayrolls)
    }

    if (payrollData.length === 0) {
      return NextResponse.json(
        {
          error: "No payroll data found for the specified period",
        },
        { status: 404 },
      )
    }

    const { submission, error } = await submitPayrollToProvider(
      tenantId,
      providerId,
      payPeriodStart,
      payPeriodEnd,
      payrollData,
    )

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ submission }, { status: 201 })
  } catch (error) {
    console.error("Error in payroll submissions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

