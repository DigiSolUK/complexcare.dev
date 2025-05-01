import { sql } from "@/lib/db"
import type { Payroll } from "@/types"

export async function getPayrolls(tenantId: string) {
  try {
    const payrolls = await sql`
      SELECT p.*, u.name as user_name
      FROM payroll p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.tenant_id = ${tenantId}
      ORDER BY p.pay_period_end DESC, p.created_at DESC
    `
    return { payrolls, error: null }
  } catch (error) {
    console.error("Error fetching payrolls:", error)
    return { payrolls: [], error: "Failed to fetch payrolls" }
  }
}

export async function getPayrollsByUser(tenantId: string, userId: string) {
  try {
    const payrolls = await sql`
      SELECT p.*, u.name as user_name
      FROM payroll p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.tenant_id = ${tenantId} AND p.user_id = ${userId}
      ORDER BY p.pay_period_end DESC, p.created_at DESC
    `
    return { payrolls, error: null }
  } catch (error) {
    console.error("Error fetching user payrolls:", error)
    return { payrolls: [], error: "Failed to fetch payrolls" }
  }
}

export async function getPayroll(tenantId: string, id: string) {
  try {
    const [payroll] = await sql`
      SELECT p.*, u.name as user_name
      FROM payroll p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.tenant_id = ${tenantId} AND p.id = ${id}
    `
    return { payroll, error: null }
  } catch (error) {
    console.error("Error fetching payroll:", error)
    return { payroll: null, error: "Failed to fetch payroll" }
  }
}

export async function createPayroll(tenantId: string, data: Partial<Payroll>) {
  try {
    // Calculate total pay
    const basicPay = data.basic_pay || 0
    const overtimePay = data.overtime_pay || 0
    const holidayPay = data.holiday_pay || 0
    const sickPay = data.sick_pay || 0
    const bonus = data.bonus || 0
    const deductions = data.deductions || 0
    const totalPay = basicPay + overtimePay + holidayPay + sickPay + bonus - deductions

    const [payroll] = await sql`
      INSERT INTO payroll (
        tenant_id, user_id, pay_period_start, pay_period_end,
        basic_hours, overtime_hours, holiday_hours, sick_hours,
        basic_pay, overtime_pay, holiday_pay, sick_pay,
        bonus, deductions, total_pay,
        payment_date, payment_reference, status, notes
      ) VALUES (
        ${tenantId}, ${data.user_id}, ${data.pay_period_start}, ${data.pay_period_end},
        ${data.basic_hours || 0}, ${data.overtime_hours || 0}, ${data.holiday_hours || 0}, ${data.sick_hours || 0},
        ${data.basic_pay || 0}, ${data.overtime_pay || 0}, ${data.holiday_pay || 0}, ${data.sick_pay || 0},
        ${data.bonus || 0}, ${data.deductions || 0}, ${totalPay},
        ${data.payment_date}, ${data.payment_reference || ""}, ${data.status || "draft"}, ${data.notes || ""}
      )
      RETURNING *
    `
    return { payroll, error: null }
  } catch (error) {
    console.error("Error creating payroll:", error)
    return { payroll: null, error: "Failed to create payroll" }
  }
}

export async function updatePayroll(tenantId: string, id: string, data: Partial<Payroll>) {
  try {
    // Calculate total pay if pay fields are provided
    let totalPay = data.total_pay
    if (
      data.basic_pay !== undefined ||
      data.overtime_pay !== undefined ||
      data.holiday_pay !== undefined ||
      data.sick_pay !== undefined ||
      data.bonus !== undefined ||
      data.deductions !== undefined
    ) {
      // Get current values if not provided
      const { payroll: currentPayroll } = await getPayroll(tenantId, id)

      const basicPay = data.basic_pay !== undefined ? data.basic_pay : currentPayroll?.basic_pay || 0
      const overtimePay = data.overtime_pay !== undefined ? data.overtime_pay : currentPayroll?.overtime_pay || 0
      const holidayPay = data.holiday_pay !== undefined ? data.holiday_pay : currentPayroll?.holiday_pay || 0
      const sickPay = data.sick_pay !== undefined ? data.sick_pay : currentPayroll?.sick_pay || 0
      const bonus = data.bonus !== undefined ? data.bonus : currentPayroll?.bonus || 0
      const deductions = data.deductions !== undefined ? data.deductions : currentPayroll?.deductions || 0

      totalPay = basicPay + overtimePay + holidayPay + sickPay + bonus - deductions
    }

    const [payroll] = await sql`
      UPDATE payroll
      SET 
        pay_period_start = COALESCE(${data.pay_period_start}, pay_period_start),
        pay_period_end = COALESCE(${data.pay_period_end}, pay_period_end),
        basic_hours = COALESCE(${data.basic_hours}, basic_hours),
        overtime_hours = COALESCE(${data.overtime_hours}, overtime_hours),
        holiday_hours = COALESCE(${data.holiday_hours}, holiday_hours),
        sick_hours = COALESCE(${data.sick_hours}, sick_hours),
        basic_pay = COALESCE(${data.basic_pay}, basic_pay),
        overtime_pay = COALESCE(${data.overtime_pay}, overtime_pay),
        holiday_pay = COALESCE(${data.holiday_pay}, holiday_pay),
        sick_pay = COALESCE(${data.sick_pay}, sick_pay),
        bonus = COALESCE(${data.bonus}, bonus),
        deductions = COALESCE(${data.deductions}, deductions),
        total_pay = COALESCE(${totalPay}, total_pay),
        payment_date = COALESCE(${data.payment_date}, payment_date),
        payment_reference = COALESCE(${data.payment_reference}, payment_reference),
        status = COALESCE(${data.status}, status),
        notes = COALESCE(${data.notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `
    return { payroll, error: null }
  } catch (error) {
    console.error("Error updating payroll:", error)
    return { payroll: null, error: "Failed to update payroll" }
  }
}

export async function deletePayroll(tenantId: string, id: string) {
  try {
    await sql`
      DELETE FROM payroll
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting payroll:", error)
    return { success: false, error: "Failed to delete payroll" }
  }
}

export async function processPayroll(tenantId: string, id: string) {
  try {
    const [payroll] = await sql`
      UPDATE payroll
      SET 
        status = 'processed',
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `
    return { payroll, error: null }
  } catch (error) {
    console.error("Error processing payroll:", error)
    return { payroll: null, error: "Failed to process payroll" }
  }
}

export async function markPayrollAsPaid(tenantId: string, id: string, paymentReference: string, paymentDate: string) {
  try {
    const [payroll] = await sql`
      UPDATE payroll
      SET 
        status = 'paid',
        payment_reference = ${paymentReference},
        payment_date = ${paymentDate},
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `
    return { payroll, error: null }
  } catch (error) {
    console.error("Error marking payroll as paid:", error)
    return { payroll: null, error: "Failed to mark payroll as paid" }
  }
}

export async function generatePayrollFromTimesheets(
  tenantId: string,
  userId: string,
  startDate: string,
  endDate: string,
  hourlyRate: number,
) {
  try {
    // Get approved timesheets for the period
    const timesheets = await sql`
      SELECT * FROM timesheets
      WHERE tenant_id = ${tenantId}
        AND user_id = ${userId}
        AND date >= ${startDate}
        AND date <= ${endDate}
        AND status = 'approved'
    `

    if (timesheets.length === 0) {
      return { payroll: null, error: "No approved timesheets found for this period" }
    }

    // Calculate hours and pay
    let basicHours = 0
    let overtimeHours = 0

    timesheets.forEach((timesheet: any) => {
      // Assuming standard day is 8 hours, anything over is overtime
      const dailyHours = timesheet.total_hours
      const standardHours = Math.min(dailyHours, 8)
      const dailyOvertime = Math.max(0, dailyHours - 8)

      basicHours += standardHours
      overtimeHours += dailyOvertime
    })

    const basicPay = basicHours * hourlyRate
    const overtimePay = overtimeHours * hourlyRate * 1.5 // Assuming 1.5x for overtime
    const totalPay = basicPay + overtimePay

    // Create payroll record
    const payrollData = {
      user_id: userId,
      pay_period_start: startDate,
      pay_period_end: endDate,
      basic_hours: basicHours,
      overtime_hours: overtimeHours,
      basic_pay: basicPay,
      overtime_pay: overtimePay,
      total_pay: totalPay,
      status: "draft",
    }

    return await createPayroll(tenantId, payrollData)
  } catch (error) {
    console.error("Error generating payroll from timesheets:", error)
    return { payroll: null, error: "Failed to generate payroll from timesheets" }
  }
}
