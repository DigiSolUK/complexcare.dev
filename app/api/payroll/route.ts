import { type NextRequest, NextResponse } from "next/server"
import {
  getPayrolls,
  createPayroll,
  getPayrollsByUser,
  generatePayrollFromTimesheets,
} from "@/lib/services/payroll-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")
    const userId = searchParams.get("userId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    if (userId) {
      const { payrolls, error } = await getPayrollsByUser(tenantId, userId)
      if (error) {
        return NextResponse.json({ error }, { status: 500 })
      }
      return NextResponse.json({ payrolls })
    } else {
      const { payrolls, error } = await getPayrolls(tenantId)
      if (error) {
        return NextResponse.json({ error }, { status: 500 })
      }
      return NextResponse.json({ payrolls })
    }
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, generateFromTimesheets, ...payrollData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    if (generateFromTimesheets) {
      const { userId, startDate, endDate, hourlyRate } = payrollData
      if (!userId || !startDate || !endDate || !hourlyRate) {
        return NextResponse.json(
          {
            error: "User ID, start date, end date, and hourly rate are required",
          },
          { status: 400 },
        )
      }

      const { payroll, error } = await generatePayrollFromTimesheets(tenantId, userId, startDate, endDate, hourlyRate)

      if (error) {
        return NextResponse.json({ error }, { status: 500 })
      }

      return NextResponse.json({ payroll }, { status: 201 })
    } else {
      const { payroll, error } = await createPayroll(tenantId, payrollData)
      if (error) {
        return NextResponse.json({ error }, { status: 500 })
      }

      return NextResponse.json({ payroll }, { status: 201 })
    }
  } catch (error) {
    console.error("Error in payroll API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
